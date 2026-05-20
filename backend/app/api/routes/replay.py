"""
replay.py — Historical Disaster Replay API
Phase-4: Scenario catalog, session management, and frame-level data endpoints.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.cache import get_cache
from app.core.observability import get_metrics

router = APIRouter(tags=["replay"])

# ─── Schemas ──────────────────────────────────────────────────────────────────

class ReplayScenarioMeta(BaseModel):
    scenario_id: str
    name: str
    date: str
    category: str
    max_wind_kph: int
    total_evacuated: int
    affected_districts: int
    rainfall_peak_mm: int
    storm_surge_m: float
    landfall_location: str
    total_frames: int
    brief: str


class ReplaySession(BaseModel):
    session_id: str
    scenario_id: str
    created_at: str
    status: str


class FrameData(BaseModel):
    frame: int
    timestamp_label: str
    district_states: list[dict[str, Any]]
    active_events: list[dict[str, Any]]
    global_rainfall_mm: float
    phase: str


# ─── Scenario Catalog ─────────────────────────────────────────────────────────

SCENARIO_CATALOG: dict[str, ReplayScenarioMeta] = {
    "fani": ReplayScenarioMeta(
        scenario_id="fani",
        name="Cyclone Fani",
        date="May 3, 2019",
        category="ESCS — Extremely Severe Cyclonic Storm",
        max_wind_kph=250,
        total_evacuated=1500000,
        affected_districts=14,
        rainfall_peak_mm=204,
        storm_surge_m=1.5,
        landfall_location="Puri Coast, 08:00 IST",
        total_frames=72,
        brief="The most powerful cyclone to strike Odisha in 20 years. Landfall near Puri with 250 km/h winds. Historic 1.5M evacuation.",
    ),
    "yaas": ReplayScenarioMeta(
        scenario_id="yaas",
        name="Cyclone Yaas",
        date="May 26, 2021",
        category="VSCS — Very Severe Cyclonic Storm",
        max_wind_kph=185,
        total_evacuated=900000,
        affected_districts=8,
        rainfall_peak_mm=145,
        storm_surge_m=4.5,
        landfall_location="Bahanaga, Balasore, 09:15 IST",
        total_frames=72,
        brief="Record 4.5m storm surge at full moon tide. 300+ embankment breaches. 180,000 homes damaged.",
    ),
}

# ─── In-Memory Session Store ──────────────────────────────────────────────────

_sessions: dict[str, ReplaySession] = {}

# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/replay/scenarios", response_model=list[ReplayScenarioMeta])
async def list_replay_scenarios():
    """List all available historical disaster replay scenarios."""
    get_metrics().inc("replay.scenario_list_requests")
    return list(SCENARIO_CATALOG.values())


@router.get("/replay/scenarios/{scenario_id}", response_model=ReplayScenarioMeta)
async def get_replay_scenario(scenario_id: str):
    """Get metadata for a specific replay scenario."""
    if scenario_id not in SCENARIO_CATALOG:
        raise HTTPException(status_code=404, detail=f"Scenario '{scenario_id}' not found.")
    return SCENARIO_CATALOG[scenario_id]


@router.post("/replay/sessions", response_model=ReplaySession, status_code=201)
async def create_replay_session(body: dict):
    """Start a new replay session for a given scenario."""
    scenario_id = body.get("scenario_id", "")
    if scenario_id not in SCENARIO_CATALOG:
        raise HTTPException(status_code=400, detail=f"Invalid scenario_id: {scenario_id}")

    session = ReplaySession(
        session_id=str(uuid.uuid4()),
        scenario_id=scenario_id,
        created_at=datetime.now(timezone.utc).isoformat(),
        status="active",
    )
    _sessions[session.session_id] = session
    get_metrics().inc("replay.sessions_created", labels={"scenario": scenario_id})
    return session


@router.get("/replay/sessions/{session_id}/frames/{frame}", response_model=FrameData)
async def get_replay_frame(session_id: str, frame: int):
    """
    Return computed frame data for a replay session.
    Deterministic: same frame always returns same data.
    """
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    meta = SCENARIO_CATALOG[session.scenario_id]
    safe_frame = max(0, min(frame, meta.total_frames - 1))

    # Compute relative time label
    hours_offset = round(((safe_frame / (meta.total_frames - 1)) * 72) - 36)
    sign = "+" if hours_offset >= 0 else ""
    timestamp_label = f"T{sign}{hours_offset}h"

    # District states (deterministic interpolation)
    t = safe_frame / (meta.total_frames - 1)
    landfall_t = 30 / (meta.total_frames - 1)

    peak_factor = min(1.0, t / landfall_t) if t < landfall_t else max(0.3, 1.0 - (t - landfall_t) / 0.6)

    puri_rainfall = round(meta.rainfall_peak_mm * peak_factor * 0.42, 1)
    kendrapara_rainfall = round(meta.rainfall_peak_mm * peak_factor * 0.38, 1)

    def escalation_level(depth: float) -> str:
        if depth > 3.5: return "CATASTROPHIC"
        if depth > 2.0: return "CRITICAL"
        if depth > 1.0: return "WARNING"
        if depth > 0.2: return "WATCH"
        return "WATCH"

    puri_depth = peak_factor * (4.2 if session.scenario_id == "fani" else 2.1)
    kendrapara_depth = peak_factor * (3.8 if session.scenario_id == "fani" else 4.8)

    district_states = [
        {
            "district_id": "puri",
            "rainfall_mm": puri_rainfall,
            "flood_depth": round(puri_depth, 2),
            "escalation_level": escalation_level(puri_depth),
            "affected_population": int(1498604 * min(1, puri_depth / 5.0) * 0.8),
        },
        {
            "district_id": "kendrapara",
            "rainfall_mm": kendrapara_rainfall,
            "flood_depth": round(kendrapara_depth, 2),
            "escalation_level": escalation_level(kendrapara_depth),
            "affected_population": int(1440680 * min(1, kendrapara_depth / 5.0) * 0.8),
        },
    ]

    phase = escalation_level(max(puri_depth, kendrapara_depth))
    global_rainfall = round((puri_rainfall + kendrapara_rainfall) / 2, 1)

    return FrameData(
        frame=safe_frame,
        timestamp_label=timestamp_label,
        district_states=district_states,
        active_events=[],
        global_rainfall_mm=global_rainfall,
        phase=phase,
    )


@router.post("/replay/sessions/{session_id}/persist")
async def persist_replay_session(session_id: str):
    """Mark session for persistence (Supabase integration hook)."""
    session = _sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found.")

    # In production: write to Supabase replay_logs table
    get_metrics().inc("replay.sessions_persisted")
    return {"status": "persisted", "session_id": session_id}
