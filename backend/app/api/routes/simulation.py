
from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.schemas.flood import (
    DistrictPlaybackState,
    FloodSimulationRequest,
    FloodSimulationResponse,
    PredictionStubResponse,
    TerrainLookupResponse,
)
from app.services import flood_engine

router = APIRouter(tags=["simulation"])


@router.post("/simulation/flood-state", response_model=FloodSimulationResponse)
async def create_flood_state(payload: FloodSimulationRequest) -> FloodSimulationResponse:
    depth_grid, global_fraction = flood_engine.run_playback(
        frames=max(1, payload.timestep),
        rainfall_mm=payload.rainfall_mm,
        velocity_scalar=payload.velocity_scalar,
    )

    flat_preview = depth_grid.ravel()[:256].astype(float).tolist()

    phase = (
        "DETECTION_PREDICTION"
        if payload.timestep < 8
        else "RISK_ASSESSMENT"
        if payload.timestep < 32
        else "ACTION_LOGISTICS"
        if payload.timestep < 60
        else "LIVE_COORDINATION"
    )

    return FloodSimulationResponse(
        district_id=payload.district_id,
        timestep=payload.timestep,
        global_water_fraction=global_fraction,
        escalation_phase=phase,
        depth_preview=flat_preview,
    )


@router.get("/simulation/terrain-sample", response_model=TerrainLookupResponse)
async def terrain_sample(district_id: str | None = None) -> TerrainLookupResponse:
    """Future hook: connect to PostGIS / COG pyramid. Returns representative envelope."""

    if district_id and district_id not in {
        "puri",
        "kendrapara",
        "jagatsinghpur",
    }:
        raise HTTPException(status_code=404, detail="District footprint not cached on API yet")

    return TerrainLookupResponse(
        district_id=district_id,
        resolution=(256, 256),
        max_elevation_m=840.0,
        min_elevation_m=1.8,
    )


@router.get("/simulation/district/{district_id}", response_model=DistrictPlaybackState)
async def district_playback_state(district_id: str, frame: int = 0) -> DistrictPlaybackState:
    _, fraction = flood_engine.run_playback(frames=max(1, frame), rainfall_mm=135.0, velocity_scalar=0.72)

    return DistrictPlaybackState(
        district_id=district_id,
        hotspot_mode=True,
        playback_frame=frame,
        inundation_fraction=fraction,
    )


@router.get("/predictions/flood-peak", response_model=PredictionStubResponse)
async def mock_prediction(rainfall_mm: float = 150.0) -> PredictionStubResponse:
    """Placeholder for future sklearn/torch service."""

    depth = min(4.5, 0.8 + rainfall_mm / 420.0)

    return PredictionStubResponse(model="baseline_quantile_stub", peak_depth_m=depth, confidence=0.62)
