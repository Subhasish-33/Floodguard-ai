import type { BoundingBox, GeoJsonFeatureCollection, TerrainGrid } from '@/types/geospatial'

import {
  HOTSPOTS,
  buildBBoxMaskUniformGrid,
  centroidToGridSeedMask,
  buildFloodGridFromTerrain,
  advanceHydrologyStep,
  mergeSimulationConfig,
  type FloodGridState,
  type FloodSimulationConfig,
  type HotspotId,
  type PropagationStepContext,
} from '@simulation'

import { lonLatToScene, computeBoundingBox } from '@/utils/geospatial'

import type { GeoJsonFeature } from '@/types/geospatial'

const wrapCollection = (features: GeoJsonFeature[]): GeoJsonFeatureCollection => ({
  type: 'FeatureCollection',
  features,
})

export const subsetDistrictFeatures = (
  districts: GeoJsonFeatureCollection,
  districtId: string,
): GeoJsonFeatureCollection =>
  wrapCollection(
    districts.features.filter((feature) => String(feature.properties?.district_id) === districtId),
  )

export function buildHotspotActivationMask(params: {
  envelope: BoundingBox
  terrain: TerrainGrid
  hotspot: Exclude<HotspotId, 'global'>
  districts: GeoJsonFeatureCollection
}): Uint8Array {
  const { envelope, terrain, hotspot, districts } = params

  const definition = HOTSPOTS[hotspot]
  const districtSubset = subsetDistrictFeatures(districts, definition.districtId)
  const regionBBox = districtSubset.features.length ? computeBoundingBox(districtSubset) : envelope

  const bboxMask = buildBBoxMaskUniformGrid(terrain.width, terrain.height, envelope, regionBBox)
  const lonSpan = envelope.maxLon - envelope.minLon || 1
  const latSpan = envelope.maxLat - envelope.minLat || 1
  const centroidSeed = centroidToGridSeedMask(terrain.width, terrain.height, {
    x: (definition.centroid.lon - envelope.minLon) / lonSpan,
    y: (definition.centroid.lat - envelope.minLat) / latSpan,
  })

  const merged = new Uint8Array(bboxMask.length)

  for (let i = 0; i < merged.length; i += 1) {
    merged[i] = bboxMask[i] || centroidSeed[i] ? 1 : 0
  }

  return merged
}

export const buildSceneFocusForHotspot = (
  hotspot: Exclude<HotspotId, 'global'>,
  envelope: BoundingBox,
): ReturnType<typeof lonLatToScene> => {
  const definition = HOTSPOTS[hotspot]
  return lonLatToScene(definition.centroid, envelope, 20)
}

export const mergeHydrologyControls = ({
  rainfallIntensity,
  floodIntensity,
  rainMultiplier,
  baseCfg,
}: {
  rainfallIntensity: number
  floodIntensity: number
  rainMultiplier: number
  baseCfg: FloodSimulationConfig
}): FloodSimulationConfig =>
  mergeSimulationConfig({
    ...baseCfg,
    rainfallIntensity: Math.min(1, Math.max(0, rainfallIntensity * rainMultiplier)),
    floodVelocity: Math.min(1, Math.max(0.1, floodIntensity)),
    stepsPerFrame: Math.max(2, Math.round(baseCfg.stepsPerFrame + rainfallIntensity * 3)),
  })

export function buildPropagationContext(params: {
  hotspot: HotspotId
  mask?: Uint8Array | null
}): PropagationStepContext {
  const surgeBias = params.hotspot === 'global' ? 0.12 : HOTSPOTS[params.hotspot].floodBias

  const activeMask = params.hotspot === 'global' ? undefined : params.mask ?? undefined

  return {
    surgeBias,
    activeMask,
  }
}

export function hydrateGridForTerrain(terrain: TerrainGrid): FloodGridState {

  return buildFloodGridFromTerrain(terrain)
}

/** Deterministic regeneration for HUD scrubbing + parity tests. */

export function replayFloodingTimeline(params: {
  terrain: TerrainGrid
  envelope: BoundingBox
  districts: GeoJsonFeatureCollection
  hotspot: HotspotId
  rainfallIntensity: number
  floodIntensity: number
  baseConfig: FloodSimulationConfig
  targetFrame: number
}): FloodGridState {

  const {
    terrain,

    envelope,

    districts,

    hotspot,

    rainfallIntensity,

    floodIntensity,

    baseConfig,

    targetFrame,
  } = params

  const grid = hydrateGridForTerrain(terrain)

  grid.depth.fill(0)

  const multiplier = hotspot === 'global' ? 1 : HOTSPOTS[hotspot].rainMultiplier

  grid.activeMask =

    hotspot === 'global'

      ? undefined

      : buildHotspotActivationMask({

          envelope,

          terrain,

          hotspot,

          districts,

        })

  const pulsesPerFrame = hotspot === 'global' ? 8 : 10

  const safeTarget = Math.floor(Math.max(0, targetFrame))

  const maskForContext = hotspot === 'global' ? undefined : grid.activeMask


  for (let idx = 0; idx <= safeTarget; idx += 1) {

    advanceHydrologyStep(

      grid,

      mergeHydrologyControls({
        rainfallIntensity,
        floodIntensity,
        rainMultiplier: multiplier,

        baseCfg: baseConfig,
      }),

      buildPropagationContext({ hotspot, mask: maskForContext }),

      pulsesPerFrame,

    )


  }


  return grid

}
