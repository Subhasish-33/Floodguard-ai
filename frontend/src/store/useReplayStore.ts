/**
 * useReplayStore.ts — Historical Disaster Replay State
 * Phase-4: Manages Cyclone Fani/Yaas replay scenarios with full
 * timeline event sequencing and worker-backed frame computation.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { ReplayEvent, DistrictState } from '@/workers/workerBridge'
import { getReplayBridge } from '@/workers/workerBridge'

export type ScenarioId = 'fani' | 'yaas'
export type ReplayPhase = 'WATCH' | 'WARNING' | 'CRITICAL' | 'CATASTROPHIC'
export type ReplayMode = 'live' | 'replay'

export interface ScenarioMeta {
  id: ScenarioId
  name: string
  date: string
  category: string
  maxWindKph: number
  totalEvacuated: number
  affectedDistricts: number
  rainfallPeakMm: number
  stormSurgeM: number
  landfallLocation: string
  brief: string
}

export const SCENARIO_CATALOG: Record<ScenarioId, ScenarioMeta> = {
  fani: {
    id: 'fani',
    name: 'Cyclone Fani',
    date: 'May 3, 2019',
    category: 'ESCS — Extremely Severe',
    maxWindKph: 250,
    totalEvacuated: 1500000,
    affectedDistricts: 14,
    rainfallPeakMm: 204,
    stormSurgeM: 1.5,
    landfallLocation: 'Puri Coast, 08:00 IST',
    brief: 'The most powerful cyclone to strike Odisha in 20 years. Landfall near Puri with 250 km/h winds and 204 mm/day rainfall. Historic pre-emptive evacuation of 1.5 million saved thousands of lives.',
  },
  yaas: {
    id: 'yaas',
    name: 'Cyclone Yaas',
    date: 'May 26, 2021',
    category: 'VSCS — Very Severe',
    maxWindKph: 185,
    totalEvacuated: 900000,
    affectedDistricts: 8,
    rainfallPeakMm: 145,
    stormSurgeM: 4.5,
    landfallLocation: 'Bahanaga, Balasore, 09:15 IST',
    brief: 'Record 4.5m storm surge devastated coastal Odisha at full moon tide. 300+ embankment breaches across Kendrapara and Bhadrak. 180,000 homes damaged despite 900K pre-landfall evacuation.',
  },
}

interface ReplayState {
  mode: ReplayMode
  activeScenario: ScenarioId | null
  replayFrame: number
  totalFrames: number
  replayPhase: ReplayPhase
  isReplaying: boolean
  isPaused: boolean
  replaySpeed: number
  timelineEvents: ReplayEvent[]
  currentDistrictStates: DistrictState[]
  currentRainfallMm: number
  workerStatus: 'idle' | 'loading' | 'ready' | 'error'

  // Actions
  setMode: (mode: ReplayMode) => void
  loadScenario: (scenarioId: ScenarioId) => void
  startReplay: () => void
  pauseReplay: () => void
  stopReplay: () => void
  seekFrame: (frame: number) => void
  advanceFrame: () => void
  setReplaySpeed: (speed: number) => void
  exitReplay: () => void

  // Internal updater (called by worker handler)
  _applyFrameUpdate: (frame: number, districtStates: DistrictState[], phase: string, rainfall: number) => void
  _applyScenarioLoaded: (totalFrames: number, events: ReplayEvent[]) => void
}

export const useReplayStore = create<ReplayState>()(
  persist(
    (set, get) => ({
      mode: 'live',
      activeScenario: null,
      replayFrame: 0,
      totalFrames: 72,
      replayPhase: 'WATCH',
      isReplaying: false,
      isPaused: true,
      replaySpeed: 1,
      timelineEvents: [],
      currentDistrictStates: [],
      currentRainfallMm: 0,
      workerStatus: 'idle',

      setMode: (mode) => set({ mode }),

      loadScenario: (scenarioId) => {
        set({ workerStatus: 'loading', activeScenario: scenarioId, mode: 'replay', replayFrame: 0 })

        const bridge = getReplayBridge()
        bridge.init()

        // Register handlers
        bridge.on('SCENARIO_LOADED', (msg) => {
          if (msg.type === 'SCENARIO_LOADED') {
            get()._applyScenarioLoaded(msg.payload.totalFrames, msg.payload.events)
          }
        })

        bridge.on('FRAME_UPDATE', (msg) => {
          if (msg.type === 'FRAME_UPDATE') {
            const { frame, districtStates, phase, rainfall } = msg.payload
            get()._applyFrameUpdate(frame, districtStates, phase, rainfall)
          }
        })

        bridge.on('ERROR', (msg) => {
          if (msg.type === 'ERROR') {
            console.error('[ReplayStore] Worker error:', msg.payload.message)
            set({ workerStatus: 'error' })
          }
        })

        bridge.send({ type: 'LOAD_SCENARIO', payload: { scenarioId } })
      },

      startReplay: () => set({ isReplaying: true, isPaused: false }),
      pauseReplay: () => set({ isPaused: true }),
      stopReplay:  () => {
        set({ isReplaying: false, isPaused: true, replayFrame: 0 })
        getReplayBridge().send({ type: 'RESET', payload: {} })
      },

      seekFrame: (frame) => {
        set({ replayFrame: frame })
        getReplayBridge().send({ type: 'SEEK', payload: { frame } })
      },

      advanceFrame: () => {
        const { replayFrame, totalFrames, isPaused } = get()
        if (isPaused) return
        if (replayFrame >= totalFrames - 1) {
          set({ isPaused: true })
          return
        }
        getReplayBridge().send({ type: 'ADVANCE', payload: {} })
      },

      setReplaySpeed: (replaySpeed) => set({ replaySpeed }),

      exitReplay: () => {
        set({ mode: 'live', activeScenario: null, replayFrame: 0, isReplaying: false, isPaused: true })
      },

      _applyFrameUpdate: (frame, districtStates, phase, rainfall) =>
        set({
          replayFrame: frame,
          replayPhase: (phase as ReplayPhase) ?? 'WATCH',
          currentDistrictStates: districtStates,
          currentRainfallMm: rainfall,
          workerStatus: 'ready',
        }),

      _applyScenarioLoaded: (totalFrames, events) =>
        set({ totalFrames, timelineEvents: events, workerStatus: 'ready' }),
    }),
    {
      name: 'floodguard-replay-state',
      partialize: (s) => ({ activeScenario: s.activeScenario, mode: s.mode }),
    },
  ),
)
