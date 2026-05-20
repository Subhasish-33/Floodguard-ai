"""
telemetry.py — System Telemetry + Simulation Audit API
Phase-4: Backend health metrics, simulation event ingestion, and audit trail.
"""

from __future__ import annotations

import time
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter
from pydantic import BaseModel

from app.core.cache import get_cache
from app.core.config import get_settings
from app.core.observability import get_metrics

router = APIRouter(tags=["telemetry"])

# ─── Schemas ──────────────────────────────────────────────────────────────────

class SimulationEvent(BaseModel):
    session_id: str
    event_type: str
    payload: dict[str, Any] = {}
    frame_index: int = 0


class TelemetryBatch(BaseModel):
    events: list[SimulationEvent]


# ─── In-Memory Simulation Audit Store ────────────────────────────────────────

_simulation_events: list[dict[str, Any]] = []
_SERVICE_START = time.time()

# ─── Routes ───────────────────────────────────────────────────────────────────

@router.get("/telemetry/system")
async def get_system_telemetry():
    """
    Backend health telemetry: uptime, cache stats, weather status, metrics.
    """
    settings = get_settings()
    cache = get_cache()
    metrics = get_metrics()

    return {
        "service": settings.service_name,
        "version": settings.api_version,
        "environment": settings.environment,
        "uptime_seconds": round(time.time() - _SERVICE_START, 1),
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "features": {
            "live_weather": settings.has_live_weather,
            "database":     settings.has_database,
            "rate_limiting": settings.rate_limit_enabled,
        },
        "cache": cache.stats(),
        "metrics": metrics.to_json(),
        "status": "operational",
    }


@router.get("/metrics")
async def prometheus_metrics():
    """Prometheus-compatible metrics endpoint for scraping."""
    from fastapi.responses import PlainTextResponse
    return PlainTextResponse(
        content=get_metrics().to_prometheus_text(),
        media_type="text/plain; version=0.0.4",
    )


@router.post("/telemetry/events", status_code=202)
async def ingest_simulation_events(batch: TelemetryBatch):
    """
    Batch-ingest simulation events for audit trail.
    Accepts events from the frontend simulation engine.
    """
    now = datetime.now(timezone.utc).isoformat()
    for event in batch.events:
        record = {
            **event.model_dump(),
            "ts": now,
            "server_received_at": now,
        }
        _simulation_events.append(record)
        get_metrics().inc("telemetry.events_ingested", labels={"type": event.event_type})

    # Keep last 5000 events
    if len(_simulation_events) > 5000:
        _simulation_events[:] = _simulation_events[-5000:]

    return {"status": "accepted", "count": len(batch.events)}


@router.get("/telemetry/audit")
async def get_simulation_audit(session_id: str | None = None, limit: int = 200):
    """Return simulation audit trail, optionally filtered by session."""
    events = _simulation_events
    if session_id:
        events = [e for e in events if e.get("session_id") == session_id]
    return {
        "total": len(events),
        "events": events[-limit:][::-1],  # Most recent first
    }
