import { useEffect } from 'react'
import { appConfig } from '@/config/env'
import { loadGeoJson, loadManifest, loadTerrainGrid } from '@/services/data/datasetRegistry'
import { useDisasterStore } from '@/store/useDisasterStore'
import type { GeoJsonFeatureCollection } from '@/types/geospatial'
import { createFallbackTerrain } from '@/utils/dem'

const deriveDistrictMetadata = (
  districts: GeoJsonFeatureCollection | null | undefined,
): Array<{ id: string; name: string }> => {
  if (!districts?.features) return []
  return districts.features.map((feature, index) => {
    const properties = feature.properties as Record<string, string | undefined>
    const districtId =
      properties?.district_id ??
      properties?.district_code ??
      properties?.id ??
      `district-${index}`
    const districtName =
      properties?.district_name ?? properties?.name ?? `District ${index + 1}`
    return { id: districtId, name: districtName }
  })
}

export const useDatasetLoader = (): void => {
  const {
    setLoading,
    setStateBoundary,
    setDistrictBoundaries,
    setTerrain,
    hydrateRiskScores,
  } = useDisasterStore()

  useEffect(() => {
    const boot = async (): Promise<void> => {
      setLoading(true)
      const manifest = await loadManifest(appConfig.manifestPath)

      const [stateBoundary, districtBoundaries, terrain] = await Promise.all([
        loadGeoJson(manifest.geojson.stateBoundary),
        loadGeoJson(manifest.geojson.districts),
        loadTerrainGrid(manifest.dem.grid),
      ])

      setStateBoundary(stateBoundary)
      setDistrictBoundaries(districtBoundaries)
      setTerrain(terrain ?? createFallbackTerrain())
      hydrateRiskScores(deriveDistrictMetadata(districtBoundaries))
      setLoading(false)
    }

    void boot()
  }, [
    hydrateRiskScores,
    setDistrictBoundaries,
    setLoading,
    setStateBoundary,
    setTerrain,
  ])
}
