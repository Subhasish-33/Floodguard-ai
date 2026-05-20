# Scalability & Optimization Report (Phase-2)

## Frontend

- **Rendering** – Physics mutations occur off React render path via R3F `useFrame`, limiting React churn.
- **Scrub determinism** – Jumping timeline rebuilds depth via closed-form replay loop O(frames * grid * passes); acceptable for prototyping grids ≤ 512².
- **Visual LOD roadmap** – decimate simulation grid independently from render mesh, upsample color weights bilinearly.
- **Bundle** – main chunk still >700 kB (Three.js ecosystem); acceptable for command center deployment; future `manualChunks` once Rolldown API stabilizes.

## Simulation Core

- Configurable relaxation iterations and pulses per frame to trade accuracy vs FPS.
- **Masking** hotspots lowers active cell count for coastal rehearsal, reducing CPU for densely populated meshes.
- TypeScript package located outside `src/` but compiled via path alias to preserve clean separation for eventual npm publish.

## Backend

- Stateless NumPy micro-kernel per request → horizontally scalable behind API gateway.
- Future: offload to Celery/Redis queue when frames > 10k or grid resolution crosses operational thresholds.

## Observability Hooks (planned)

- OpenTelemetry spans per `/simulation/flood-state`.
- Structured logging with `district_id`, `timestep`, `global_water_fraction`.
