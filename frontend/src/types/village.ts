/** Phase-2 scaffolding for village intelligence (Phase-3 evacuation graph attach). */

export type VillageRiskBand = 'safe' | 'watch' | 'warning' | 'critical'

export interface VillageDemographics {

  population2011?: number

  hhCount?: number

}

export interface VillageEntity {

  villageId: string

  villageName: string

  districtId: string

  /** Normalized exposure score 0-1 from ML or rules engine */

  baseRisk: number

  population?: VillageDemographics

  centroid: { lat: number; lon: number }

  evacuationCandidate: boolean

}

export interface VillageFloodState extends VillageEntity {

  depthMeters: number

  band: VillageRiskBand

  lastUpdatedFrame: number

}

export interface EvacuationRouteStub {

  routeId: string

  originVillageId: string

  safeZoneId: string

  geometryRef: string

}
