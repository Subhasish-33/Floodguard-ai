# Backend API Reference (Phase-2)

Base URL (local): `http://127.0.0.1:8000`

## Health

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/health` | Liveness probe |

## Simulation Routes (prefix `/api`)

| Method | Path | Body / Params | Response |
| --- | --- | --- | --- |
| `POST` | `/simulation/flood-state` | `FloodSimulationRequest` JSON | `FloodSimulationResponse` |
| `GET` | `/simulation/terrain-sample` | `district_id` optional | `TerrainLookupResponse` |
| `GET` | `/simulation/district/{district_id}` | `frame` query (int) | `DistrictPlaybackState` |
| `GET` | `/predictions/flood-peak` | `rainfall_mm` query | `PredictionStubResponse` |

### Example

```bash
curl -X POST http://127.0.0.1:8000/api/simulation/flood-state \
  -H 'Content-Type: application/json' \
  -d '{"district_id":"puri","rainfall_mm":180,"velocity_scalar":0.7,"timestep":42}'
```

## Notes

- Responses include coarse depth preview (flattened slice) for telemetry dashboards.
- Terrain sample endpoint currently returns representative range; connect Rasterio pipeline in Phase-3.
