import { create } from 'zustand'
import type { GeoJsonFeatureCollection, RiskLevel, RiskScore, TerrainGrid } from '@/types/geospatial'
import { appConfig } from '@/config/env'
import { riskLevelFromValue } from '@/utils/color'

interface DisasterState {
  selectedDistrictId: string | null
  hoveredDistrictId: string | null
  isLoadingData: boolean
  stateBoundary: GeoJsonFeatureCollection | null
  districtBoundaries: GeoJsonFeatureCollection | null
  terrain: TerrainGrid | null
  riskScores: RiskScore[]
  riskOpacity: number
  setLoading: (loading: boolean) => void
  setSelectedDistrict: (districtId: string | null) => void
  setHoveredDistrict: (districtId: string | null) => void
  setStateBoundary: (collection: GeoJsonFeatureCollection | null) => void
  setDistrictBoundaries: (collection: GeoJsonFeatureCollection | null) => void
  setTerrain: (terrain: TerrainGrid | null) => void
  setRiskOpacity: (opacity: number) => void
  hydrateRiskScores: (districtIds: Array<{ id: string; name: string }>) => void
  updateDistrictRisk: (districtId: string, value: number, level?: RiskLevel) => void
}

export const useDisasterStore = create<DisasterState>((set) => ({
  selectedDistrictId: null,
  hoveredDistrictId: null,
  isLoadingData: true,
  stateBoundary: null,
  districtBoundaries: null,
  terrain: null,
  riskScores: [],
  riskOpacity: appConfig.heatmapOpacity,
  setLoading: (loading) => set({ isLoadingData: loading }),
  setSelectedDistrict: (selectedDistrictId) => set({ selectedDistrictId }),
  setHoveredDistrict: (hoveredDistrictId) => set({ hoveredDistrictId }),
  setStateBoundary: (stateBoundary) => set({ stateBoundary }),
  setDistrictBoundaries: (districtBoundaries) => set({ districtBoundaries }),
  setTerrain: (terrain) => set({ terrain }),
  setRiskOpacity: (riskOpacity) => set({ riskOpacity }),
  hydrateRiskScores: (districtIds) =>
    set({
      riskScores: districtIds.map((district, index) => {
        const baseline =
          appConfig.initialDistrictRisk * 0.6 + ((index % 5) * 0.08 + 0.15) % 1
        return {
          districtId: district.id,
          districtName: district.name,
          value: Number(baseline.toFixed(2)),
          level: riskLevelFromValue(baseline),
        }
      }),
    }),
  updateDistrictRisk: (districtId, value, level) =>
    set((state) => ({
      riskScores: state.riskScores.map((risk) =>
        risk.districtId === districtId
          ? { ...risk, value, level: level ?? riskLevelFromValue(value) }
          : risk,
      ),
    })),
}))
