from typing import List
from fastapi import APIRouter, HTTPException

from app.schemas.intelligence import (
    Village, VillageFloodRisk, EvacuationRoute,
    DroneMission, DroneWaypoint, AnalyticsDashboard,
    DistrictAnalytics
)
import random

router = APIRouter(tags=["intelligence"])

# Mock Database for Operational Systems
# In a real deployed version, this connects to PostGIS
MOCK_VILLAGES = [
    Village(id=f"v_{i}", name=f"Village_{i}", district_id=random.choice(["puri", "kendrapara", "jagatsinghpur"]), population=random.randint(500, 5000), lat=19.8 + random.uniform(-0.5, 0.5), lon=86.1 + random.uniform(-0.5, 0.5), base_risk=random.uniform(0.1, 0.9), elevation=random.uniform(1.5, 20.0))
    for i in range(1, 101)
]

@router.get("/villages", response_model=List[Village])
async def get_villages(district_id: str = None) -> List[Village]:
    if district_id:
        return [v for v in MOCK_VILLAGES if v.district_id == district_id]
    return MOCK_VILLAGES

@router.get("/villages/risk", response_model=List[VillageFloodRisk])
async def get_villages_risk(district_id: str = None, simulation_frame: int = 0) -> List[VillageFloodRisk]:
    villages = get_villages(district_id)
    # Simulate risk escalation based on frame
    risks = []
    for v in MOCK_VILLAGES:
        depth = (simulation_frame / 60.0) * (1.0 - v.elevation/20.0) * 5.0
        depth = max(0.0, depth)
        
        if depth > 2.0:
            band = "critical"
        elif depth > 1.0:
            band = "warning"
        elif depth > 0.1:
            band = "watch"
        else:
            band = "safe"
            
        risks.append(VillageFloodRisk(village_id=v.id, flood_depth=depth, risk_band=band))
    return risks

@router.get("/evacuation/routes", response_model=List[EvacuationRoute])
async def get_evacuation_routes(village_id: str) -> List[EvacuationRoute]:
    village = next((v for v in MOCK_VILLAGES if v.id == village_id), None)
    if not village:
        raise HTTPException(status_code=404, detail="Village not found")
        
    return [
        EvacuationRoute(
            route_id=f"rt_{village_id}_s1",
            origin_village_id=village_id,
            safe_zone_id="sz_puri_highground",
            waypoints=[(village.lat, village.lon), (village.lat + 0.05, village.lon + 0.05)],
            distance_km=7.5,
            estimated_time_mins=45.0,
            risk_score=0.2,
            status="safe"
        )
    ]

@router.get("/drones/missions", response_model=List[DroneMission])
async def get_drone_missions(hotspot_id: str) -> List[DroneMission]:
    return [
        DroneMission(
            mission_id=f"msn_{hotspot_id}_1",
            target_hotspot=hotspot_id,
            waypoints=[
                DroneWaypoint(lat=19.8, lon=86.1, elevation=150.0, action="surveillance"),
                DroneWaypoint(lat=19.81, lon=86.12, elevation=150.0, action="supply_drop")
            ],
            estimated_duration=35.0,
            status="active"
        )
    ]

@router.get("/analytics/dashboard", response_model=AnalyticsDashboard)
async def get_analytics_dashboard(simulation_frame: int = 0) -> AnalyticsDashboard:
    base_urgency = min(1.0, simulation_frame / 60.0)
    
    return AnalyticsDashboard(
        global_affected_population=int(500000 * base_urgency),
        global_villages_at_risk=int(100 * base_urgency),
        overall_evacuation_urgency=base_urgency,
        district_analytics=[
            DistrictAnalytics(
                district_id="puri",
                total_villages=35,
                villages_at_risk=int(35 * base_urgency),
                affected_population=int(120000 * base_urgency),
                evacuation_urgency=base_urgency * 1.2,
                active_hotspots=2,
                escalation_level="CRITICAL" if base_urgency > 0.7 else "WARNING"
            )
        ]
    )
