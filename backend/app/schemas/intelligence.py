from pydantic import BaseModel, Field
from typing import List, Optional, Tuple

class Village(BaseModel):
    id: str
    name: str
    district_id: str
    population: int
    lat: float
    lon: float
    base_risk: float
    elevation: float

class VillageFloodRisk(BaseModel):
    village_id: str
    flood_depth: float
    risk_band: str # safe, watch, warning, critical

class EvacuationRoute(BaseModel):
    route_id: str
    origin_village_id: str
    safe_zone_id: str
    waypoints: List[Tuple[float, float]] # (lat, lon)
    distance_km: float
    estimated_time_mins: float
    risk_score: float
    status: str # safe, compromised

class DroneWaypoint(BaseModel):
    lat: float
    lon: float
    elevation: float
    action: str # surveillance, supply_drop, return

class DroneMission(BaseModel):
    mission_id: str
    target_hotspot: str
    waypoints: List[DroneWaypoint]
    estimated_duration: float
    status: str # pending, active, completed

class DistrictAnalytics(BaseModel):
    district_id: str
    total_villages: int
    villages_at_risk: int
    affected_population: int
    evacuation_urgency: float
    active_hotspots: int
    escalation_level: str

class AnalyticsDashboard(BaseModel):
    global_affected_population: int
    global_villages_at_risk: int
    overall_evacuation_urgency: float
    district_analytics: List[DistrictAnalytics]
