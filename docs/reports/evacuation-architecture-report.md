# Evacuation Architecture Report

## System Design
The evacuation architecture operates as a multi-tier directed graph where villages represent source nodes and high-elevation shelters represent sinks. 

### A* Routing & Safe Zones
- Routes dynamically evaluate edge weights based on terrain elevation, water depth, and distance.
- High-elevation shelters are automatically identified using DEM querying.

### Fallback System
- The system computes primary, secondary, and tertiary routes. If a primary route edge is compromised by flood propagation, the system fails over.
