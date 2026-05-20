# Phase-3 Readiness Checklist

## Product

- [ ] Calibrate CA parameters against at least one historical Odisha inundation footprint (qualitative + tabular).
- [ ] Publish operator playbook for Puri / Kendrapara / Jagatsinghpur scenarios.
- [ ] Integrate authoritative village registry + population weighting into UI risk badges.

## Engineering

- [ ] Web Worker simulation path for >512² grids with transferable buffers.
- [ ] Persist playback sessions + audit trails (who scrubbed which timeline).
- [ ] Integrate FastAPI authN/Z (JWT + RBAC).
- [ ] Establish integration tests covering `replayFloodingTimeline` ↔ Python kernel parity thresholds.

## Data

- [ ] Operational GeoTIFF COG pipeline + `rasterio` mosaic builder on backend.
- [ ] India-WRIS / Bhuvan ingestion stubs with checksum validation.
- [ ] Village geometry simplification + spatial index (PostGIS).

## Operations

- [ ] Deploy frontend to edge CDN + API to regional resilient cloud.
- [ ] Formal observability stack (metrics + tracing + synthetic scenario pings).
- [ ] Disaster-recovery drills for simulation service degradation modes.
