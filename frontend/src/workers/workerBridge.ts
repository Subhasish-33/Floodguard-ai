/**
 * workerBridge.ts — Typed Worker Pool Manager
 * Phase-4: Non-blocking simulation orchestration via Web Workers.
 * Implements type-safe message-passing contracts with lifecycle tracking.
 */

// ─── Message Contract Types ───────────────────────────────────────────────────

export type WorkerStatus = 'idle' | 'initializing' | 'computing' | 'ready' | 'error'

export interface WorkerMessage<T = unknown> {
  type: string
  payload: T
  requestId?: string
}

export interface WorkerResponse<T = unknown> {
  type: string
  payload: T
  requestId?: string
  error?: string
}

// ─── Flood Worker Contracts ───────────────────────────────────────────────────

export type FloodWorkerIncoming =
  | { type: 'INIT'; payload: { terrainBuffer: ArrayBuffer; width: number; height: number } }
  | { type: 'ADVANCE_STEP'; payload: { rainfallIntensity: number; floodIntensity: number; hotspot: string; pulsesPerFrame: number } }
  | { type: 'SEEK_FRAME'; payload: { targetFrame: number; rainfallIntensity: number; floodIntensity: number; hotspot: string } }
  | { type: 'RESET'; payload: Record<string, never> }

export type FloodWorkerOutgoing =
  | { type: 'READY'; payload: Record<string, never> }
  | { type: 'GRID_UPDATE'; payload: { depthBuffer: ArrayBuffer; width: number; height: number; globalInundation: number; frameIndex: number } }
  | { type: 'ERROR'; payload: { message: string } }

// ─── Replay Worker Contracts ──────────────────────────────────────────────────

export type ReplayWorkerIncoming =
  | { type: 'LOAD_SCENARIO'; payload: { scenarioId: string } }
  | { type: 'SEEK'; payload: { frame: number } }
  | { type: 'ADVANCE'; payload: Record<string, never> }
  | { type: 'RESET'; payload: Record<string, never> }

export type ReplayWorkerOutgoing =
  | { type: 'SCENARIO_LOADED'; payload: { totalFrames: number; events: ReplayEvent[] } }
  | { type: 'FRAME_UPDATE'; payload: { frame: number; districtStates: DistrictState[]; phase: string; rainfall: number } }
  | { type: 'ERROR'; payload: { message: string } }

export interface ReplayEvent {
  frame: number
  label: string
  type: 'landfall' | 'evacuation' | 'escalation' | 'surge' | 'relief'
  districtId?: string
  severity: 'info' | 'warning' | 'critical'
}

export interface DistrictState {
  districtId: string
  floodDepth: number
  rainfallMm: number
  escalationLevel: 'WATCH' | 'WARNING' | 'CRITICAL' | 'CATASTROPHIC'
  affectedPopulation: number
}

// ─── Analytics Worker Contracts ───────────────────────────────────────────────

export type AnalyticsWorkerIncoming =
  | { type: 'COMPUTE_ANALYTICS'; payload: { villages: VillageInput[]; floodDepths: Float32Array; frame: number } }

export type AnalyticsWorkerOutgoing =
  | { type: 'ANALYTICS_READY'; payload: { globalAffected: number; villagesAtRisk: number; districtBreakdown: DistrictBreakdown[] } }

export interface VillageInput {
  villageId: string
  districtId: string
  population: number
  elevation: number
  gridIndex: number
}

export interface DistrictBreakdown {
  districtId: string
  affected: number
  villagesAtRisk: number
  evacuationUrgency: number
  escalationLevel: 'WATCH' | 'WARNING' | 'CRITICAL' | 'CATASTROPHIC'
}

// ─── WorkerBridge Implementation ──────────────────────────────────────────────

type MessageHandler<T> = (response: T) => void

export class WorkerBridge<TIn extends WorkerMessage, TOut extends WorkerResponse> {
  private worker: Worker | null = null
  private status: WorkerStatus = 'idle'
  private handlers: Map<string, MessageHandler<TOut>[]> = new Map()
  private readonly workerFactory: () => Worker
  private readonly name: string

  constructor(name: string, workerFactory: () => Worker) {
    this.name = name
    this.workerFactory = workerFactory
  }

  init(): void {
    if (this.worker) return
    this.status = 'initializing'
    this.worker = this.workerFactory()

    this.worker.onmessage = (event: MessageEvent<TOut>) => {
      const { type } = event.data
      const handlers = this.handlers.get(type) ?? []
      handlers.forEach((h) => h(event.data))

      // Also call wildcard handlers
      const wildcards = this.handlers.get('*') ?? []
      wildcards.forEach((h) => h(event.data))

      if (type === 'READY') this.status = 'ready'
      if (type === 'ERROR') this.status = 'error'
      if (type === 'GRID_UPDATE' || type === 'FRAME_UPDATE' || type === 'ANALYTICS_READY') {
        this.status = 'ready'
      }
    }

    this.worker.onerror = (err) => {
      console.error(`[WorkerBridge:${this.name}] Worker error:`, err)
      this.status = 'error'
      const errorHandlers = this.handlers.get('ERROR') ?? []
      errorHandlers.forEach((h) => h({ type: 'ERROR', payload: { message: err.message } } as TOut))
    }
  }

  send(message: TIn, transfer?: Transferable[]): void {
    if (!this.worker) {
      console.warn(`[WorkerBridge:${this.name}] Worker not initialized. Call init() first.`)
      return
    }
    this.status = 'computing'
    if (transfer && transfer.length > 0) {
      this.worker.postMessage(message, transfer)
    } else {
      this.worker.postMessage(message)
    }
  }

  on(type: string, handler: MessageHandler<TOut>): () => void {
    const existing = this.handlers.get(type) ?? []
    this.handlers.set(type, [...existing, handler])
    return () => {
      const current = this.handlers.get(type) ?? []
      this.handlers.set(type, current.filter((h) => h !== handler))
    }
  }

  getStatus(): WorkerStatus {
    return this.status
  }

  terminate(): void {
    this.worker?.terminate()
    this.worker = null
    this.status = 'idle'
    this.handlers.clear()
  }
}

// ─── Singleton Worker Bridge Instances ───────────────────────────────────────

let floodBridge: WorkerBridge<FloodWorkerIncoming, FloodWorkerOutgoing> | null = null
let replayBridge: WorkerBridge<ReplayWorkerIncoming, ReplayWorkerOutgoing> | null = null
let analyticsBridge: WorkerBridge<AnalyticsWorkerIncoming, AnalyticsWorkerOutgoing> | null = null

export const getFloodBridge = (): WorkerBridge<FloodWorkerIncoming, FloodWorkerOutgoing> => {
  if (!floodBridge) {
    floodBridge = new WorkerBridge('flood', () => new Worker(new URL('./floodWorker.ts', import.meta.url), { type: 'module' }))
  }
  return floodBridge
}

export const getReplayBridge = (): WorkerBridge<ReplayWorkerIncoming, ReplayWorkerOutgoing> => {
  if (!replayBridge) {
    replayBridge = new WorkerBridge('replay', () => new Worker(new URL('./replayWorker.ts', import.meta.url), { type: 'module' }))
  }
  return replayBridge
}

export const getAnalyticsBridge = (): WorkerBridge<AnalyticsWorkerIncoming, AnalyticsWorkerOutgoing> => {
  if (!analyticsBridge) {
    analyticsBridge = new WorkerBridge('analytics', () => new Worker(new URL('./analyticsWorker.ts', import.meta.url), { type: 'module' }))
  }
  return analyticsBridge
}

export const terminateAllWorkers = (): void => {
  floodBridge?.terminate()
  replayBridge?.terminate()
  analyticsBridge?.terminate()
  floodBridge = null
  replayBridge = null
  analyticsBridge = null
}
