# Routing System Documentation

## Terrain-Aware Routing Engine
The routing engine integrates with the cellular automaton flood grid.

### Edge Weights
- Base distance (Euclidean).
- Elevation penalty (steep slopes).
- Submersion penalty (water > 0.5m invalidates the edge).

### Worker-Ready Architecture
Pathfinding algorithms are structured to be serializable, ready for Web Worker offloading in Phase 4 to ensure the main UI thread remains unblocked at 60 FPS.
