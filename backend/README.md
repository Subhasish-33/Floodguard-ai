# FloodGuard Backend — Simulation Service

FastAPI façade that exposes flood rehearsal contracts, terrain lookups, and prediction stubs for the Phase-2 platform.

## Quick start

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

- OpenAPI UI: `http://127.0.0.1:8000/docs`
- Health: `GET /health`

## Layout

```text
backend/
├── app/
│   ├── main.py
│   ├── api/routes/simulation.py
│   ├── schemas/flood.py
│   └── services/flood_engine.py
└── requirements.txt
```

## Notes

- The NumPy kernel is intentionally lightweight—mirror of the browser-side CA for contract testing, not a calibrated hydraulic model.
- Swap `flood_engine.run_playback` with Rasterio/GeoPandas preprocessors as higher-fidelity DEMs arrive.
