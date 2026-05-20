
import type { FloodGridState, FloodSimulationConfig } from './types'

import { phaseCodeFromFrame } from '../timeline/escalation'

import {

  DEFAULT_FLOOD_CONFIG,

  PLAYBACK_TOTAL_FRAMES,

} from '../config/defaultSimulationConfig'

import { stepCellularPropagation, type PropagationStepContext } from '../propagation/cellularAutomaton'

export function mergeSimulationConfig(partial?: Partial<FloodSimulationConfig>): FloodSimulationConfig {

  return { ...DEFAULT_FLOOD_CONFIG, ...partial }

}

/** Composite flood intelligence metric for dashboard + water-plane animation. */

export function summarizeGlobalFlooding(depth: Float32Array): number {

  if (depth.length === 0) return 0

  let sum = 0

  let maxDepth = 0

  for (let i = 0; i < depth.length; i += 1) {

    sum += depth[i]

    maxDepth = Math.max(maxDepth, depth[i])

  }

  const mean = sum / depth.length

  return Math.min(1, mean * 12 + maxDepth * 2.8)

}

export function advanceHydrologyStep(
  grid: FloodGridState,

  config: FloodSimulationConfig,

  context: PropagationStepContext,

  steps: number,
): number {

  for (let s = 0; s < Math.max(1, steps); s += 1) {

    stepCellularPropagation(grid, config, context)

  }

  return summarizeGlobalFlooding(grid.depth)

}

export function serializeFloodSimulationSnapshot(grid: FloodGridState, timestep: number) {

  return {

    width: grid.width,

    height: grid.height,

    timestep,

    globalWaterFraction: summarizeGlobalFlooding(grid.depth),

    depthEncoding: Array.from(grid.depth, (value) => Number(value.toFixed(5))),

    escalationPhaseCode: phaseCodeFromFrame(timestep),

  }

}

export { PLAYBACK_TOTAL_FRAMES, DEFAULT_FLOOD_CONFIG }
