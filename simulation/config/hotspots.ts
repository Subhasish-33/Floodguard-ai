/**
 * Operational flood rehearsal hotspots — district-scoped playback + framing.
 * Coordinates approximate district centroids (WGS84) for camera focus.
 */

export type HotspotId = 'global' | 'puri' | 'kendrapara' | 'jagatsinghpur'

export interface HotspotDefinition {
  id: Exclude<HotspotId, 'global'>
  /** Must match GeoJSON district_id property. */
  districtId: string
  districtName: string
  centroid: { lat: number; lon: number }
  /** Playback bias: boosts low-lying accumulation for cinematics per district persona. */
  floodBias: number
  rainMultiplier: number
  cameraElevationFactor: number
  cameraRadialOffset: number
}

export const HOTSPOTS: Record<Exclude<HotspotId, 'global'>, HotspotDefinition> = {
  puri: {
    id: 'puri',
    districtId: 'puri',
    districtName: 'Puri',
    centroid: { lat: 19.8134, lon: 85.8315 },
    floodBias: 1.08,
    rainMultiplier: 1.12,
    cameraElevationFactor: 0.92,
    cameraRadialOffset: 0.94,
  },
  kendrapara: {
    id: 'kendrapara',
    districtId: 'kendrapara',
    districtName: 'Kendrapara',
    centroid: { lat: 20.5083, lon: 86.4194 },
    floodBias: 1.22,
    rainMultiplier: 1.18,
    cameraElevationFactor: 0.88,
    cameraRadialOffset: 0.9,
  },
  jagatsinghpur: {
    id: 'jagatsinghpur',
    districtId: 'jagatsinghpur',
    districtName: 'Jagatsinghpur',
    centroid: { lat: 20.2871, lon: 86.171 },
    floodBias: 1.15,
    rainMultiplier: 1.08,
    cameraElevationFactor: 0.9,
    cameraRadialOffset: 0.92,
  },
}
