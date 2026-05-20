"""
incidents.py — Incident Management API
Phase-4: Full CRUD lifecycle management with audit trail and export.
"""

from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.core.observability import get_metrics

router = APIRouter(tags=["incidents"])

# ─── Schemas ──────────────────────────────────────────────────────────────────

class IncidentCreate(BaseModel):
    type: str = "FLOOD"
    severity: str = "MEDIUM"
    district_id: str | None = None
    village_name: str | None = None
    title: str
    description: str = ""
    lat: float | None = None
    lon: float | None = None
    simulation_frame: int | None = None
    tags: list[str] = []


class IncidentPatch(BaseModel):
    lifecycle: str | None = None
    severity: str | None = None
    operator_note: str | None = None


class AuditEntry(BaseModel):
    entry_id: str
    action: str
    from_state: str | None = None
    to_state: str | None = None
    timestamp: str
    operator_id: str


class IncidentOut(BaseModel):
    incident_id: str
    type: str
    severity: str
    lifecycle: str
    district_id: str | None
    village_name: str | None
    title: str
    description: str
    lat: float | None
    lon: float | None
    created_at: str
    updated_at: str
    simulation_frame: int | None
    tags: list[str]
    notes: list[dict[str, Any]]
    audit_trail: list[dict[str, Any]]


# ─── In-Memory Incident Store ─────────────────────────────────────────────────

_incidents: dict[str, dict[str, Any]] = {}


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _new_id() -> str:
    return str(uuid.uuid4())


# ─── Routes ───────────────────────────────────────────────────────────────────

@router.post("/incidents", response_model=IncidentOut, status_code=201)
async def create_incident(body: IncidentCreate):
    """Create a new incident event."""
    now = _now()
    inc: dict[str, Any] = {
        "incident_id": _new_id(),
        "type": body.type,
        "severity": body.severity,
        "lifecycle": "DETECTED",
        "district_id": body.district_id,
        "village_name": body.village_name,
        "title": body.title,
        "description": body.description,
        "lat": body.lat,
        "lon": body.lon,
        "created_at": now,
        "updated_at": now,
        "simulation_frame": body.simulation_frame,
        "tags": body.tags,
        "notes": [],
        "audit_trail": [{"entry_id": _new_id(), "action": "CREATED", "to_state": "DETECTED", "timestamp": now, "operator_id": "system"}],
    }
    _incidents[inc["incident_id"]] = inc
    get_metrics().inc("incidents.created", labels={"severity": body.severity})
    return inc


@router.get("/incidents", response_model=list[IncidentOut])
async def list_incidents(lifecycle: str | None = None, severity: str | None = None, limit: int = 50):
    """List incidents with optional lifecycle/severity filters."""
    result = list(_incidents.values())
    if lifecycle:
        result = [i for i in result if i["lifecycle"] == lifecycle.upper()]
    if severity:
        result = [i for i in result if i["severity"] == severity.upper()]
    result.sort(key=lambda i: i["created_at"], reverse=True)
    return result[:limit]


@router.get("/incidents/{incident_id}", response_model=IncidentOut)
async def get_incident(incident_id: str):
    inc = _incidents.get(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return inc


@router.patch("/incidents/{incident_id}", response_model=IncidentOut)
async def update_incident(incident_id: str, patch: IncidentPatch, operator_id: str = "operator"):
    inc = _incidents.get(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found.")

    now = _now()
    inc["updated_at"] = now

    if patch.lifecycle:
        lifecycle = patch.lifecycle.upper()
        inc["audit_trail"].append({
            "entry_id": _new_id(),
            "action": "LIFECYCLE_CHANGE",
            "from_state": inc["lifecycle"],
            "to_state": lifecycle,
            "timestamp": now,
            "operator_id": operator_id,
        })
        inc["lifecycle"] = lifecycle
        get_metrics().inc("incidents.lifecycle_transitions", labels={"to": lifecycle})

    if patch.severity:
        old_severity = inc["severity"]
        inc["severity"] = patch.severity.upper()
        inc["audit_trail"].append({
            "entry_id": _new_id(),
            "action": "SEVERITY_CHANGE",
            "from_state": old_severity,
            "to_state": patch.severity.upper(),
            "timestamp": now,
            "operator_id": operator_id,
        })

    if patch.operator_note:
        inc["notes"].append({
            "note_id": _new_id(),
            "content": patch.operator_note,
            "operator_id": operator_id,
            "timestamp": now,
        })

    return inc


@router.get("/incidents/{incident_id}/audit")
async def get_incident_audit(incident_id: str):
    """Return full audit trail for an incident."""
    inc = _incidents.get(incident_id)
    if not inc:
        raise HTTPException(status_code=404, detail="Incident not found.")
    return {"incident_id": incident_id, "audit_trail": inc["audit_trail"]}


@router.get("/incidents/export/audit-log")
async def export_audit_log():
    """Export full incident audit log as JSON for replay/compliance."""
    return {
        "exported_at": _now(),
        "total_incidents": len(_incidents),
        "incidents": list(_incidents.values()),
    }
