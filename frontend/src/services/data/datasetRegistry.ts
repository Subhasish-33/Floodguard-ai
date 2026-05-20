import type { DataManifest, GeoJsonFeatureCollection, TerrainGrid } from '@/types/geospatial'
import { parseAsciiGrid } from '@/utils/dem'

const defaultManifest: DataManifest = {
  geojson: {
    stateBoundary: '/data/geojson/odisha-state.geojson',
    districts: '/data/geojson/odisha-districts.geojson',
  },
  dem: {
    grid: '/data/dem/odisha-dem.asc',
  },
}

export const loadManifest = async (manifestPath: string): Promise<DataManifest> => {
  try {
    const response = await fetch(manifestPath)
    if (!response.ok) {
      return defaultManifest
    }
    const data = (await response.json()) as DataManifest
    return {
      geojson: { ...defaultManifest.geojson, ...data.geojson },
      dem: { ...defaultManifest.dem, ...data.dem },
    }
  } catch {
    return defaultManifest
  }
}

export const loadGeoJson = async (
  geoJsonPath: string | undefined,
): Promise<GeoJsonFeatureCollection | null> => {
  if (!geoJsonPath) return null
  try {
    const response = await fetch(geoJsonPath)
    if (!response.ok) return null
    return (await response.json()) as GeoJsonFeatureCollection
  } catch {
    return null
  }
}

export const loadTerrainGrid = async (
  terrainPath: string | undefined,
): Promise<TerrainGrid | null> => {
  if (!terrainPath) return null
  try {
    const response = await fetch(terrainPath)
    if (!response.ok) return null
    const raw = await response.text()
    return parseAsciiGrid(raw)
  } catch {
    return null
  }
}
