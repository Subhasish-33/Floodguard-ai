import { create } from 'zustand'
import type { VillageEntity, VillageFloodRisk, EvacuationRoute, DroneMission, AnalyticsDashboard } from '@/types/intelligence'

interface IntelligenceState {
  villages: VillageEntity[]
  villageRisks: VillageFloodRisk[]
  evacuationRoutes: EvacuationRoute[]
  droneMissions: DroneMission[]
  analytics: AnalyticsDashboard | null
  
  isLoadingIntelligence: boolean
  
  setVillages: (villages: VillageEntity[]) => void
  setVillageRisks: (risks: VillageFloodRisk[]) => void
  setEvacuationRoutes: (routes: EvacuationRoute[]) => void
  setDroneMissions: (missions: DroneMission[]) => void
  setAnalytics: (analytics: AnalyticsDashboard | null) => void
  
  fetchIntelligence: (districtId?: string) => Promise<void>
  updateLiveRisks: (frame: number) => Promise<void>
}

export const useIntelligenceStore = create<IntelligenceState>((set, get) => ({
  villages: [],
  villageRisks: [],
  evacuationRoutes: [],
  droneMissions: [],
  analytics: null,
  
  isLoadingIntelligence: false,
  
  setVillages: (villages) => set({ villages }),
  setVillageRisks: (villageRisks) => set({ villageRisks }),
  setEvacuationRoutes: (evacuationRoutes) => set({ evacuationRoutes }),
  setDroneMissions: (droneMissions) => set({ droneMissions }),
  setAnalytics: (analytics) => set({ analytics }),
  
  fetchIntelligence: async (_districtId?: string) => {
    set({ isLoadingIntelligence: true })
    try {
      // In operational mode, this would hit the FastAPI backend.
      // We simulate the fetch here for robustness if backend is down.
      const villageData: VillageEntity[] = Array.from({ length: 80 }).map((_, i) => {
        const id = `v_${i}`
        return {
          villageId: id,
          villageName: `Village ${i}`,
          districtId: ['puri', 'kendrapara', 'jagatsinghpur'][i % 3],
          baseRisk: Math.random(),
          population: {
            population2011: 500 + Math.floor(Math.random() * 4500)
          },
          centroid: {
            lat: 19.8 + (Math.random() - 0.5) * 1.5,
            lon: 85.8 + (Math.random() - 0.5) * 1.5
          },
          evacuationCandidate: Math.random() > 0.5,
          elevation: 1 + Math.random() * 20
        }
      })
      
      const routes: EvacuationRoute[] = villageData.filter(v => v.evacuationCandidate).slice(0, 15).map((v) => ({
        routeId: `rt_${v.villageId}`,
        originVillageId: v.villageId,
        safeZoneId: 'sz_highground',
        waypoints: [
          v.centroid,
          { lat: v.centroid.lat + 0.05, lon: v.centroid.lon + 0.05 },
          { lat: v.centroid.lat + 0.1, lon: v.centroid.lon + 0.15 }
        ],
        distanceKm: 5 + Math.random() * 10,
        estimatedTimeMins: 30 + Math.random() * 60,
        riskScore: Math.random(),
        status: Math.random() > 0.8 ? 'compromised' : 'safe'
      }))

      const drones: DroneMission[] = [
        {
          missionId: 'msn_puri_1',
          targetHotspot: 'puri',
          waypoints: [
            { lat: 19.81, lon: 85.81, elevation: 150, action: 'surveillance' },
            { lat: 19.85, lon: 85.85, elevation: 150, action: 'supply_drop' },
            { lat: 19.88, lon: 85.80, elevation: 150, action: 'return' }
          ],
          estimatedDuration: 45,
          status: 'active'
        }
      ]
      
      set({ villages: villageData, evacuationRoutes: routes, droneMissions: drones })
    } catch (e) {
      console.error("Failed to load intelligence data", e)
    } finally {
      set({ isLoadingIntelligence: false })
    }
  },
  
  updateLiveRisks: async (frame: number) => {
    const { villages } = get()
    if (villages.length === 0) return
    
    const escalation = frame / 60.0
    
    const risks = villages.map(v => {
      const depth = Math.max(0, escalation * (1 - (v.elevation || 10)/25) * 6.0)
      let band: 'safe' | 'watch' | 'warning' | 'critical' = 'safe'
      if (depth > 2.5) band = 'critical'
      else if (depth > 1.2) band = 'warning'
      else if (depth > 0.2) band = 'watch'
      
      return {
        villageId: v.villageId,
        floodDepth: depth,
        riskBand: band
      }
    })
    
    const analytics: AnalyticsDashboard = {
      globalAffectedPopulation: Math.floor(250000 * escalation),
      globalVillagesAtRisk: risks.filter(r => r.riskBand !== 'safe').length,
      overallEvacuationUrgency: escalation,
      districtAnalytics: [
        {
          districtId: 'puri',
          totalVillages: 45,
          villagesAtRisk: risks.filter(r => r.riskBand !== 'safe' && r.villageId.charCodeAt(2) % 3 === 0).length,
          affectedPopulation: Math.floor(120000 * escalation),
          evacuationUrgency: Math.min(1, escalation * 1.2),
          activeHotspots: 2,
          escalationLevel: escalation > 0.7 ? 'CRITICAL' : (escalation > 0.3 ? 'WARNING' : 'WATCH')
        }
      ]
    }
    
    set({ villageRisks: risks, analytics })
  }
}))
