import type { TerrainGrid } from '@/types/geospatial'

export const parseAsciiGrid = (raw: string): TerrainGrid => {
  const lines = raw.trim().split('\n').map((line) => line.trim())
  const header: Record<string, number> = {}
  let dataStart = 0

  for (let i = 0; i < Math.min(lines.length, 6); i += 1) {
    const [key, value] = lines[i].split(/\s+/)
    if (key && value && Number.isFinite(Number(value))) {
      header[key.toLowerCase()] = Number(value)
      dataStart = i + 1
    }
  }

  const width = header.ncols ?? 128
  const height = header.nrows ?? 128
  const values = lines
    .slice(dataStart)
    .flatMap((line) => line.split(/\s+/).map((v) => Number(v)))
    .filter(Number.isFinite)

  const trimmedValues = values.slice(0, width * height)
  const minElevation = Math.min(...trimmedValues)
  const maxElevation = Math.max(...trimmedValues)

  return { width, height, values: trimmedValues, minElevation, maxElevation }
}

export const normalizeElevation = (value: number, min: number, max: number): number => {
  const range = max - min || 1
  return (value - min) / range
}

export const createFallbackTerrain = (width = 128, height = 128): TerrainGrid => {
  const values: number[] = []
  for (let row = 0; row < height; row += 1) {
    for (let col = 0; col < width; col += 1) {
      const ridge = Math.sin(col / 8) * 12 + Math.cos(row / 11) * 10
      const basin = Math.sin((row + col) / 14) * 6
      values.push(120 + ridge + basin)
    }
  }

  const minElevation = Math.min(...values)
  const maxElevation = Math.max(...values)
  return { width, height, values, minElevation, maxElevation }
}
