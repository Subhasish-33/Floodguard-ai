import type { FloodGridState, FloodSimulationConfig } from '../engine/types'

export interface PropagationStepContext {

  activeMask?: Uint8Array

  surgeBias: number

}

/**

 * Terrain-aware cellular flood relaxation:

 * Rain forcing adds depth; multi-pass redistribution moves water downhill by hydraulic gradient.

 */

export function stepCellularPropagation(
  state: FloodGridState,
  config: FloodSimulationConfig,

  context: PropagationStepContext,
): void {
  const { width, height, elevationNorm: elev, depth } = state

  const mask = context.activeMask ?? state.activeMask

  let working = Float32Array.from(depth)

  const rainPulse =
    config.rainfallIntensity * config.dt * 0.0045 * (1 + context.surgeBias * 0.9)

  for (let i = 0; i < working.length; i += 1) {
    if (mask && mask[i] === 0) continue

    working[i] += rainPulse
  }

  const passes = Math.max(2, config.relaxationIterations)

  const flux = config.floodVelocity * config.dt * 0.18

  for (let pass = 0; pass < passes; pass += 1) {

    const buffer = Float32Array.from(working)

    for (let y = 1; y < height - 1; y += 1) {
      for (let x = 1; x < width - 1; x += 1) {

        const idx = y * width + x
        if (mask && mask[idx] === 0) continue

        const neighbors = [idx + 1, idx - 1, idx + width, idx - width]

        for (const neighbor of neighbors) {
          if (mask && mask[neighbor] === 0) continue

          const head = elev[idx] + buffer[idx]

          const headNeighbor = elev[neighbor] + buffer[neighbor]

          const deltaHead = head - headNeighbor

          if (deltaHead <= 0 || buffer[idx] <= 0) continue

          const slopeFactor = Math.max(0.15, deltaHead)

          let transfer = flux * slopeFactor * Math.min(buffer[idx], deltaHead)

          transfer = Math.min(transfer, buffer[idx] * 0.42)

          buffer[idx] -= transfer
          buffer[neighbor] += transfer
        }
      }
    }

    working = buffer
  }

  for (let i = 0; i < working.length; i += 1) {
    working[i] = Math.max(0, working[i])
  }

  depth.set(working)
}
