# Flood Simulation Architecture (Phase-2)

## Layered Responsibilities

1. **Terrain Layer** – imports ASCII DEM grid → `TerrainGrid` → normalized elevation envelope for both shading and physics.
2. **Propagation Layer** (`simulation/propagation/cellularAutomaton.ts`) – hydraulic head relaxation on a structured grid with optional activation mask (hotspot rehearsal footprint).
3. **Playback Layer** – deterministic rebuild via `replayFloodingTimeline` (scrubbing) vs incremental `advanceHydrologyStep` (live play).
4. **Presentation Layer** – GPU mesh colors track depth buffer; translucent water plane tracks `summarizeGlobalFlooding` scalar.
5. **API Layer** – FastAPI mirrors coarse NumPy kernel for parity testing and external orchestration (simulate frames remotely).

## Data Contracts

- **Hotspot mask** – union of district bounding raster + centroid seed kernel to emulate tidal/surge ingress.
- **Escalation phases** – derived from timeline index (`T-6h` through `T-0h`) using `resolveEscalationPhase`.
- **State snapshots** – `FloodGridState` carries `elevationNorm`, mutable `depth`, optional `activeMask`.

## Operational Modes

| Mode | Mask | Rain multiplier | Camera | Use case |
| --- | --- | --- | --- | --- |
| `global` | none (full grid) | 1.0 | overview | statewide rehearsal |
| `puri` / `kendrapara` / `jagatsinghpur` | district mask | HOTSPOT-specific | cinematic zoom | district scenario planning |

## Failure Handling

- Missing GeoJSON or DEM causes playback guard rails (`seekPlaybackFrame` early exit) while Phase-1 loaders finish.
