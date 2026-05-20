import { create } from 'zustand'

import {

  PLAYBACK_TOTAL_FRAMES,

  type EscalationPhase,

  mergeSimulationConfig,

  type FloodSimulationConfig,

  type FloodGridState,

  summarizeGlobalFlooding,

  type HotspotId,

  resolveEscalationPhase,

  advanceHydrologyStep,

  HOTSPOTS,

} from '@simulation'

import { useDisasterStore } from '@/store/useDisasterStore'

import { computeBoundingBox } from '@/utils/geospatial'

import {

  mergeHydrologyControls,

  replayFloodingTimeline,

  buildPropagationContext,

} from '@/simulation/simulationRuntime'

export interface CameraIntent {
  targetXZ: [number, number]
  distanceScalar: number
}

interface SimulationPlaybackState {
  floodGrid: FloodGridState | null
  hotspot: HotspotId
  frameIndex: number
  paused: boolean
  playbackSpeed: number
  rainfallIntensity: number
  floodIntensity: number
  baseConfig: FloodSimulationConfig
  globalInundation: number
  escalation: EscalationPhase
  cameraIntent: CameraIntent | null

  setRainfallIntensity: (value: number) => void

  setFloodIntensity: (value: number) => void

  setPlaybackSpeed: (speed: number) => void

  setPaused: (paused: boolean) => void

  togglePlayback: () => void

  setHotspot: (hotspot: HotspotId) => void

  setFloodGrid: (grid: FloodGridState | null) => void

  restartScenario: () => void

  setCameraIntent: (intent: CameraIntent | null) => void

  seekPlaybackFrame: (frame: number) => void

  advanceLiveHydrologyPulse: () => void
}

const clampFrameIdx = (frame: number): number =>
  Math.min(PLAYBACK_TOTAL_FRAMES - 1, Math.max(0, Math.floor(frame)))

const initialConfig = mergeSimulationConfig({})

export const useSimulationStore = create<SimulationPlaybackState>((set, get) => ({
  floodGrid: null,
  hotspot: 'global',

  frameIndex: 0,
  paused: true,
  playbackSpeed: 1,
  rainfallIntensity: 0.62,
  floodIntensity: 0.68,

  baseConfig: initialConfig,
  globalInundation: 0,
  escalation: resolveEscalationPhase(0),
  cameraIntent: null,

  setRainfallIntensity: (rainfallIntensity) => {

    const next = rainfallIntensity

    set({ rainfallIntensity: next })

    if (get().paused) {

      get().seekPlaybackFrame(get().frameIndex)

    }

  },

  setFloodIntensity: (floodIntensity) => {

    set({ floodIntensity })

    if (get().paused) {

      get().seekPlaybackFrame(get().frameIndex)

    }

  },

  setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),

  setPaused: (paused) => set({ paused }),

  togglePlayback: () => set({ paused: !get().paused }),

  setHotspot: (hotspot) => {

    set({ hotspot })

    get().seekPlaybackFrame(get().frameIndex)

    if (hotspot === 'global') {

      set({ cameraIntent: null })

    }
  },

  setFloodGrid: (floodGrid) =>
    set({

      floodGrid,

      globalInundation: summarizeGlobalFlooding(floodGrid?.depth ?? new Float32Array(0)),

    }),

  restartScenario: () => get().seekPlaybackFrame(0),

  setCameraIntent: (cameraIntent) => set({ cameraIntent }),

  seekPlaybackFrame: (frame) => {

    const safeFrame = clampFrameIdx(frame)

    const { terrain, stateBoundary, districtBoundaries } = useDisasterStore.getState()

    const envelopeCollection = stateBoundary ?? districtBoundaries

    if (!terrain || !envelopeCollection || !districtBoundaries) {

      set({
        frameIndex: safeFrame,

        escalation: resolveEscalationPhase(safeFrame),

      })

      return

    }

    const envelopeBBox = computeBoundingBox(envelopeCollection)

    const {

      hotspot,

      rainfallIntensity,

      floodIntensity,

      baseConfig,
    } = get()

    const rebuilt = replayFloodingTimeline({
      terrain,
      envelope: envelopeBBox,

      districts: districtBoundaries,
      hotspot,
      rainfallIntensity,
      floodIntensity,
      baseConfig,
      targetFrame: safeFrame,
    })

    set({
      floodGrid: rebuilt,
      frameIndex: safeFrame,

      escalation: resolveEscalationPhase(safeFrame),

      globalInundation: summarizeGlobalFlooding(rebuilt.depth),

    })

  },

  advanceLiveHydrologyPulse: () => {

    const {
      floodGrid,
      hotspot,
      rainfallIntensity,
      floodIntensity,
      baseConfig,
      frameIndex,
      paused,

    } = get()

    if (paused || !floodGrid) return

    if (frameIndex >= PLAYBACK_TOTAL_FRAMES - 1) {

      set({ paused: true })

      return

    }

    const multiplier = hotspot === 'global' ? 1 : HOTSPOTS[hotspot].rainMultiplier

    const contextualConfig = mergeHydrologyControls({

      rainfallIntensity,
      floodIntensity,
      rainMultiplier: multiplier,

      baseCfg: baseConfig,

    })

    const maskForPropagation = hotspot === 'global' ? undefined : floodGrid.activeMask


    advanceHydrologyStep(
      floodGrid,
      contextualConfig,
      buildPropagationContext({ hotspot, mask: maskForPropagation }),

      hotspot === 'global' ? 8 : 10,

    )

    const nextFrame = clampFrameIdx(frameIndex + 1)

    set({
      frameIndex: nextFrame,

      escalation: resolveEscalationPhase(nextFrame),

      globalInundation: summarizeGlobalFlooding(floodGrid.depth),

    })

    if (nextFrame >= PLAYBACK_TOTAL_FRAMES - 1) {

      set({ paused: true })

    }

  },

}))
