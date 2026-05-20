/**
 * floodWorker.ts — Flood Propagation Web Worker
 * Phase-4: Runs the entire cellular-automaton flood engine off the main thread.
 * Uses Transferable ArrayBuffers for zero-copy grid state exchange.
 */

import {
  buildFloodGridFromTerrain,
  advanceHydrologyStep,
  summarizeGlobalFlooding,
  mergeSimulationConfig,
  HOTSPOTS,
  type FloodGridState,
  type FloodSimulationConfig,
  type HotspotId,
} from '@simulation'

// ─── Worker State ─────────────────────────────────────────────────────────────

let grid: FloodGridState | null = null
let terrainElevation: Float32Array | null = null
let gridWidth = 0
let gridHeight = 0
let currentFrame = 0

// ─── Helpers ──────────────────────────────────────────────────────────────────

const mergeControls = (
  rainfallIntensity: number,
  floodIntensity: number,
  hotspot: string,
): FloodSimulationConfig => {
  const multiplier = hotspot === 'global' ? 1 : (HOTSPOTS[hotspot as Exclude<HotspotId, 'global'>]?.rainMultiplier ?? 1)
  return mergeSimulationConfig({
    rainfallIntensity: Math.min(1, Math.max(0, rainfallIntensity * multiplier)),
    floodVelocity: Math.min(1, Math.max(0.1, floodIntensity)),
    stepsPerFrame: Math.max(2, Math.round(4 + rainfallIntensity * 3)),
  })
}

const buildPropContext = (hotspot: string, grid: FloodGridState) => ({
  surgeBias: hotspot === 'global' ? 0.12 : (HOTSPOTS[hotspot as Exclude<HotspotId, 'global'>]?.floodBias ?? 0.12),
  activeMask: hotspot === 'global' ? undefined : grid.activeMask,
})

const sendGridUpdate = (frame: number) => {
  if (!grid) return
  const depthCopy = new Float32Array(grid.depth)
  const globalInundation = summarizeGlobalFlooding(depthCopy)
  const depthBuffer = depthCopy.buffer.slice(0) as ArrayBuffer

  self.postMessage(
    {
      type: 'GRID_UPDATE',
      payload: { depthBuffer, width: gridWidth, height: gridHeight, globalInundation, frameIndex: frame },
    },
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error — Worker postMessage accepts transfer array as second arg in browser
    [depthBuffer],
  )
}

// ─── Message Handler ──────────────────────────────────────────────────────────

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data

  try {
    switch (type) {
      case 'INIT': {
        const { terrainBuffer, width, height } = payload
        terrainElevation = new Float32Array(terrainBuffer)
        gridWidth = width
        gridHeight = height

        // Build a synthetic TerrainGrid from the buffer
        const syntheticTerrain = {
          width,
          height,
          elevation: terrainElevation,
          resolution: 1,
        }
        grid = buildFloodGridFromTerrain(syntheticTerrain as never)
        currentFrame = 0

        self.postMessage({ type: 'READY', payload: {} })
        break
      }

      case 'ADVANCE_STEP': {
        if (!grid) return
        const { rainfallIntensity, floodIntensity, hotspot, pulsesPerFrame } = payload
        const cfg = mergeControls(rainfallIntensity, floodIntensity, hotspot)
        const ctx = buildPropContext(hotspot, grid)

        advanceHydrologyStep(grid, cfg, ctx, pulsesPerFrame ?? 8)
        currentFrame += 1
        sendGridUpdate(currentFrame)
        break
      }

      case 'SEEK_FRAME': {
        if (!terrainElevation) return
        const { targetFrame, rainfallIntensity, floodIntensity, hotspot } = payload

        // Rebuild grid from scratch (deterministic replay)
        const syntheticTerrain = { width: gridWidth, height: gridHeight, elevation: terrainElevation, resolution: 1 }
        grid = buildFloodGridFromTerrain(syntheticTerrain as never)
        grid.depth.fill(0)

        const cfg = mergeControls(rainfallIntensity, floodIntensity, hotspot)
        const ctx = buildPropContext(hotspot, grid)
        const pulses = hotspot === 'global' ? 8 : 10

        for (let i = 0; i <= Math.max(0, targetFrame); i++) {
          advanceHydrologyStep(grid, cfg, ctx, pulses)
        }
        currentFrame = targetFrame
        sendGridUpdate(currentFrame)
        break
      }

      case 'RESET': {
        if (!terrainElevation) return
        const syntheticTerrain = { width: gridWidth, height: gridHeight, elevation: terrainElevation, resolution: 1 }
        grid = buildFloodGridFromTerrain(syntheticTerrain as never)
        grid.depth.fill(0)
        currentFrame = 0
        sendGridUpdate(0)
        break
      }

      default:
        console.warn('[FloodWorker] Unknown message type:', type)
    }
  } catch (err) {
    self.postMessage({ type: 'ERROR', payload: { message: String(err) } })
  }
}

export {}
