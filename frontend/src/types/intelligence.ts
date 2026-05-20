export interface VillageDemographics {
  population2011?: number
  hhCount?: number
}

export interface VillageEntity {
  villageId: string
  villageName: string
  districtId: string
  baseRisk: number
  population?: VillageDemographics
  centroid: { lat: number; lon: number }
  evacuationCandidate: boolean
  elevation?: number
}

export interface VillageFloodRisk {
  villageId: string
  floodDepth: number
  riskBand: 'safe' | 'watch' | 'warning' | 'critical'
}

export interface EvacuationRoute {
  routeId: string
  originVillageId: string
  safeZoneId: string
  waypoints: { lat: number; lon: number }[]
  distanceKm: number
  estimatedTimeMins: number
  riskScore: number
  status: 'safe' | 'compromised'
}

export interface DroneWaypoint {
  lat: number
  lon: number
  elevation: number
  action: 'surveillance' | 'supply_drop' | 'return'
}

export interface DroneMission {
  missionId: string
  targetHotspot: string
  waypoints: DroneWaypoint[]
  estimatedDuration: number
  status: 'pending' | 'active' | 'completed'
}

export interface DistrictAnalytics {
  districtId: string
  totalVillages: number
  villagesAtRisk: number
  affectedPopulation: number
  evacuationUrgency: number
  activeHotspots: number
  escalationLevel: 'WATCH' | 'WARNING' | 'CRITICAL' | 'SAFE'
}

export interface AnalyticsDashboard {
  globalAffectedPopulation: number
  globalVillagesAtRisk: number
  overallEvacuationUrgency: number
  districtAnalytics: DistrictAnalytics[]
}
