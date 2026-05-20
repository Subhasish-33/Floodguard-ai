# FloodGuard AI — Disaster Response Digital Twin (Premium Cinematic Edition)

AI-powered, Odisha-wide disaster intelligence platform with **multi-threaded physics simulation**, **historical disaster replay**, **live weather API ingestion**, **incident command logging**, and a **premium, cinematic Apple-inspired UI**.

---

## 1. Strategic Narrative

India loses over INR 1.5 lakh crore annually to cyclonic landfalls and severe flooding. **FloodGuard AI** transforms disaster response into an **enterprise-ready operational emergency command center** — combining the technical depth of Palantir Gotham with the **elegant, minimalist aesthetics of Apple-designed intelligence software**. 

By leveraging **client-side parallel computing threads (Web Workers)** and a **premium light-mode glassmorphism design system**, FloodGuard AI scales dynamically across hundreds of operators while maintaining a calm, immersive, and highly performant 60fps cinematic experience.

---

## 2. Cinematic & Enterprise Capabilities

- **Cinematic Apple-Inspired UX**: A complete transition to a premium "light-mode" design system featuring soft atmospheric map lighting, fluid scroll-driven storytelling on the Landing Page, and glassmorphism Command Center panels with subtle micro-interactions driven by `framer-motion`.
- **Thread-Decoupled Simulation Engine**: Hydro-CA, A* navigation computations, and statistical aggregations are processed completely off the rendering thread in dedicated Web Workers (`floodWorker`, `replayWorker`, `analyticsWorker`), maintaining a constant 60fps UI performance.
- **Deterministic Historical Replay**: Load and analyze major historical disasters with frame-by-frame precision:
  - **Cyclone Fani (2019)**: Peak rainfall of 204mm, 250km/h winds, and 1.5M evacuation sequence.
  - **Cyclone Yaas (2021)**: Record 4.5m storm surge breaching embankments.
- **Live Weather Ingestion Pipeline**: Active client polling and backend scheduler fetching dynamic meteorological bulletins from OpenWeatherMap and IMD. Live wind directions and rainfall accumulations act as mathematical simulation multipliers.
- **Incident Command Feed**: Unified incident panel enabling operators to register structural failures, trace rescue logistics, write command-logs, and log audit trails.

---

## 3. High-Performance Repository Topology

```text
.
├── frontend/
│   ├── src/
│   │   ├── workers/                # Dedicated background processing threads
│   │   │   ├── floodWorker.ts      # Cellular automaton hydrology engine
│   │   │   ├── replayWorker.ts     # Cyclone Fani & Yaas trajectory calculations
│   │   │   └── analyticsWorker.ts  # Real-time district pop-at-risk aggregation
│   │   ├── components/replay/      # VCR playback control bar & scenario briefing
│   │   └── utils/renderScheduler.ts# Priority requestAnimationFrame task throttler
├── backend/
│   ├── app/
│   │   ├── core/                   # Hardened rate limiting, security headers, metrics
│   │   ├── db/                     # PostGIS production schemas & repositories
│   │   └── services/weather/       # Resilient OpenWeatherMap poller & IMD adapters
├── infra/
│   ├── Dockerfile.backend      # Production Python slim container
│   ├── Dockerfile.frontend     # Optimized Nginx multi-stage SPA container
│   └── docker-compose.yml      # Backend + Frontend + PostGIS orchestration
```

---

## 4. Operational Ingest Verification & Setup

### 4.1. Local Quickstart (Docker Compose)
Launch the entire platform including the spatial database in detatched container mode:
```bash
docker-compose -f infra/docker-compose.yml up --build -d
```

### 4.2. Manual Frontend Setup
```bash
cd frontend
npm install
npm run dev        # Synchronizes assets and runs Vite HMR server
```

### 4.3. Manual Backend Setup
Ensure GDAL dependencies are available in your local shell for spatial libraries (`geopandas`/`rasterio`):
```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m uvicorn app.main:app --port 8000 --reload
```
- **Swagger Documentation**: Accessible at `http://127.0.0.1:8000/docs`
- **Readiness Metric**: Query `http://127.0.0.1:8000/health/ready` to verify cache and dependency states.

---

## 5. Comprehensive Experience Documentation Suite

Dive deeper into the architectural and design details of this release:
- **Architecture Overview**: [01 Cinematic Architecture](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/01-Cinematic-Architecture.md)
- **State & Routing**: [02 Routing and State](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/02-Routing-and-State.md)
- **Map Rendering**: [03 Map Rendering Engine](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/03-Map-Rendering-Engine.md)
- **HUD & Telemetry**: [04 Telemetry and HUD](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/04-Telemetry-and-HUD.md)
- **Operational Logistics**: [05 Incident Management](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/05-Incident-Management.md)
- **Animations**: [06 Motion Choreography](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/06-Motion-Choreography.md)
- **VCR Control System**: [07 Replay Control System](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/07-Replay-Control-System.md)
- **Live Overrides**: [08 Simulation Deck](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/08-Simulation-Deck.md)
- **Escalation & Status**: [09 Threat Intelligence](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/09-Threat-Intelligence.md)
- **Validation**: [10 Performance Verification](file:///Users/subhasish/Disaster%20Response%20Digital%20Twin/docs/reports/10-Performance-Verification.md)
