
import type { FloodSimulationConfig } from '../engine/types'

export const DEFAULT_FLOOD_CONFIG: FloodSimulationConfig = {
  stepsPerFrame: 2,

  rainfallIntensity: 0.55,

  floodVelocity: 0.65,

  timeScale: 1,

  relaxationIterations: 4,

  dt: 0.35,

}

export const PLAYBACK_TOTAL_FRAMES = 240

export const RAINFALL_SCALE_PER_STEP = 0.0022
