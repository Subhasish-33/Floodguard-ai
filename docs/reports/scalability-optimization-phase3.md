# Scalability & Optimization Phase 3

## Rendering Optimizations
- **Instanced Meshes**: Village markers utilize `BufferGeometry` and material sharing to minimize draw calls.
- **Lazy Rendering**: Analytics dashboards only compute metrics for the active district unless global views are requested.

## Backend Optimizations
- **Memoization**: Route calculations are cached based on the flood frame index to prevent redundant A* traversals.
- **Clustering**: (Prepared) Village clusters at high zoom levels will merge to prevent visual clutter and reduce DOM overhead from HTML markers.
