/** Minimal DEM-ish grid contract shared with frontend terrain loader (shape parity). */

export interface TerrainElevationGrid {
  width: number
  height: number
  values: number[]
  minElevation: number
  maxElevation: number
}

export function normalizeElevation(value: number, min: number, max: number): number {
  const range = max - min || 1
  return (value - min) / range
}
