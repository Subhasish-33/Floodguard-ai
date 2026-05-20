import type { FloodGridState } from '../engine/types'

import type { TerrainElevationGrid } from './types'
import { normalizeElevation } from './types'

/**
 * Build simulation grid elevation envelope from DEM terrain payload.
 * Kept isolated for future DEM upscaling / worker offload.
 */

export function buildFloodGridFromTerrain(terrain: TerrainElevationGrid): FloodGridState {
  const count = terrain.width * terrain.height
  const elevationNorm = new Float32Array(count)
  const depth = new Float32Array(count)
  const { values, width, height, minElevation, maxElevation } = terrain

  for (let i = 0; i < count; i += 1) {
    elevationNorm[i] = normalizeElevation(values[i] ?? minElevation, minElevation, maxElevation)
  }

  return { width, height, elevationNorm, depth }
}

/**
 * Rasterize centroid into grid index for seeded ingress (nearest cell footprint).
 */

export function centroidToGridSeedMask(
  width: number,
  height: number,
  centroidNorm: { x: number; y: number },
): Uint8Array {
  const cx = Math.min(width - 1, Math.max(0, Math.floor(centroidNorm.x * (width - 1))))
  const cy = Math.min(height - 1, Math.max(0, Math.floor(centroidNorm.y * (height - 1))))
  const mask = new Uint8Array(width * height)

  const radius = 2
  for (let dy = -radius; dy <= radius; dy += 1) {
    for (let dx = -radius; dx <= radius; dx += 1) {
      const x = cx + dx
      const y = cy + dy
      if (x >= 0 && x < width && y >= 0 && y < height) {
        mask[y * width + x] = 1
      }
    }
  }
  return mask
}
