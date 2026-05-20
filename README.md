# FloodGuard AI — Disaster Response Digital Twin (Phase-3)

AI-powered, Odisha-scale disaster intelligence platform with **live terrain-aware flood rehearsal**, **village intelligence**, **evacuation routing**, **drone coordination**, and HTTP simulation contracts for operational command centers.

## Strategic Narrative

India loses over INR 1.5 lakh crore annually to floods, cyclones, and compound disasters. Phase-3 transforms FloodGuard from a predictive simulation engine into an **operational disaster-response command interface**. It fuses physical flood propagation with human telemetry to execute life-saving logistical missions.

## Phase-3 Capabilities (New)

- **Village Intelligence System**: Real-time telemetry on affected populations, synthetic district demographics, and deterministic risk-band scoring (safe/watch/warning/critical) driven by dynamic water-level intersection.
- **Evacuation Architecture**: A* pathfinding concepts integrated over 3D terrain to connect high-risk villages to secure high-ground zones avoiding submerged paths.
- **Drone Coordination Layer**: Tactical UAV waypoints (surveillance, supply drops, return paths) orchestrated for live reconnaissance over flooded hotspots.
- **Operational Command Dashboard**: Tactical intelligence panels broadcasting global escalation level, active hotspots, and district-level evacuation urgency metrics.
- **Backend Expansion**: FastAPI endpoints prepared for PostGIS, capable of serving village intelligence, routing tasks, and drone logistics to multi-tenant consumers.

## Phase-2 Capabilities (Carried Forward)

- Cellular-automaton-style flood propagation with configurable rainfall + hydraulic velocity.
- Deterministic timeline scrubbing with escalation tagging.
- Hotspot rehearsal lanes for Puri, Kendrapara, and Jagatsinghpur.
- Animated inundation visuals: dynamic terrain tinting + translucent water veil.

## Architecture at a Glance

```text
[data/manifest + GeoJSON + DEM]
            │
            ▼
[Dataset sync → frontend/public/data]
            │
            ├─► React/Vite HUD + Zustand disaster + simulation + intelligence stores
            │       └─► R3F scene (terrain, water, villages, drones, evacuation paths)
            │
            └─► simulation/ TS package ──► importable engine for worker/CLIs
            │
FastAPI (`backend/app`) mirrors physics + operational logistics for API consumers
```

## Repository Structure (Phase-3 Updates)

```text
.
├── frontend/
│   ├── src/
│   │   ├── components/map/layers/  # Added IntelligenceLayer (villages, drones)
│   │   ├── store/                  # Added useIntelligenceStore.ts
│   │   └── types/                  # Added intelligence.ts
├── backend/
│   ├── app/
│   │   ├── api/routes/             # Added intelligence.py (villages, routes, drones)
│   │   ├── schemas/                # Added intelligence schemas
├── docs/
│   └── reports/                    # Phase-3 technical, scalability, and routing reports
```

## Hotspot Evacuation Workflow (Phase-3)

1. Operator selects a coastal district inside the `SimulationDeck`.
2. `useSimulationLifecycle` activates flood physics and simultaneously fetches intelligence via `useIntelligenceStore`.
3. As flood depth rises, villages automatically escalate from `watch` to `critical`.
4. High-risk markers blink red in the 3D scene, displaying population at risk and real-time submersion depth.
5. Evacuation routes visualize safe paths to high ground, turning red if compromised by flood propagation.
6. Tactical UAVs execute sweeping loops over hotspots to provide simulated ground truth.

## Frontend Setup

```bash
cd frontend
npm install
npm run dev        # runs dataset sync automatically
```

## Backend Setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Interactive API docs: `http://127.0.0.1:8000/docs`

## Documentation / Reports (Phase-3)

- `docs/reports/phase3-technical-implementation-report.md`
- `docs/reports/evacuation-architecture-report.md`
- `docs/reports/routing-system-documentation.md`
- `docs/reports/scalability-optimization-phase3.md`
- `docs/reports/business-viability-phase3.md`
- `docs/reports/ai-integration-recommendations-phase3.md`
- `docs/reports/deployment-readiness-report.md`

## Investor / Demo Guidance

Demonstrate the **hotspot choreography** and advance the simulation timeline to watch the **tactical village intelligence** update in real-time. Show the Command Center side-panel to prove that this is a Palantir-style operational tool—not just a map. Emphasize that evacuation paths and drone assets actively react to the physical flood plane.
