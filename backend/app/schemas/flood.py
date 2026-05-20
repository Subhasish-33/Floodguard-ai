
from __future__ import annotations

from pydantic import BaseModel, Field


class FloodSimulationRequest(BaseModel):
    district_id: str | None = Field(default=None, description="Optional hotspot district scope")
    rainfall_mm: float = Field(ge=0.0, le=600.0, default=120.0)
    velocity_scalar: float = Field(ge=0.1, le=1.0, default=0.65)
    timestep: int = Field(ge=0, le=500, default=0)


class FloodSimulationResponse(BaseModel):
    district_id: str | None
    timestep: int
    global_water_fraction: float
    escalation_phase: str
    depth_preview: list[float] = Field(default_factory=list, description="Flattened coarse grid sample")


class TerrainLookupResponse(BaseModel):
    district_id: str | None = None
    resolution: tuple[int, int]
    max_elevation_m: float
    min_elevation_m: float


class PredictionStubResponse(BaseModel):
    model: str
    peak_depth_m: float
    confidence: float


class DistrictPlaybackState(BaseModel):
    district_id: str
    hotspot_mode: bool
    playback_frame: int
    inundation_fraction: float
