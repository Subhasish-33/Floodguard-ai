# Historical Disaster Replay System Documentation
## FloodGuard AI — Deterministic Scenario Replay Engine

### 1. Conceptual Design

The **Historical Disaster Replay System** allows emergency operators, planners, and policy-makers to load, replay, and analyze major historical disasters with frame-by-frame precision. 

Rather than relying on static slides or raw video captures, the platform dynamically recreates disaster conditions (surge heights, rainfall curves, district warnings) based on actual meteorological records.

---

### 2. Scenario Catalog

The platform encapsulates real historical cyclone trajectories with highly detailed geospatial curves:

#### 2.1. Cyclone Fani (May 3, 2019)
- **Profile**: Extremely Severe Cyclonic Storm (ESCS)
- **Peak Rainfall**: `204 mm/24h`
- **Max Wind Speed**: `250 km/h`
- **Storm Surge**: `1.5 m`
- **Total Evacuated**: `1,500,000 citizens`
- **Landfall Location**: Puri Coast
- **Operational Timeline**: T-24h (Detection and pre-emptive evacuation ordering) to T+48h (Action logistics, supply drops, and damage audits) over a 72-frame deterministic sequence.

#### 2.2. Cyclone Yaas (May 26, 2021)
- **Profile**: Very Severe Cyclonic Storm (VSCS)
- **Peak Rainfall**: `145 mm/24h`
- **Max Wind Speed**: `185 km/h`
- **Storm Surge**: `4.5 m` (Full moon tide interaction leading to extreme storm surge)
- **Landfall Location**: Bahanaga, Balasore
- **Operational Impact**: Focuses on severe coastal defense breaches and low-lying inundation scenarios.

---

### 3. Engine Dynamics & State

Replay states are kept strictly synchronous between the backend API scenario configurations, the dedicated thread-offloaded worker (`replayWorker.ts`), and the frontend coordinate layers via the Zustand `useReplayStore` hook:

```typescript
export interface ReplayState {
  activeScenario: 'fani' | 'yaas' | 'live' | null
  replayFrame: number
  isReplaying: boolean
  playbackSpeed: number
  timelineEvents: TimelineEvent[]
  
  setScenario: (scenario: 'fani' | 'yaas' | 'live' | null) => void
  setFrame: (frame: number) => void
  togglePlayback: () => void
  setSpeed: (speed: number) => void
}
```

#### Deterministic Frame Interpolation:
As playback ticks forward (T-24h to T+48h), wind speeds and precipitation levels are calculated using smooth cubic curves to represent the physical approach and departure of the cyclone.
- **Pre-landfall approach**: Escalates linearly as the eye approaches the centroid coordinate.
- **Landfall peak**: Reaches maximum values around frame 24 (the `T-0h` landfall event).
- **Post-landfall decay**: Dissipates gradually as the storm tracks inland across northern Odisha.

---

### 4. Interactive Command Controls

The emergency command center provides direct operational levers:
1. **Interactive Timeline HUD**: Highlighting key milestones like "Pre-emptive Evacuation Orders Issued" (T-18h), "Landfall Event" (T-0h), and "Supply UAV Deployments" (T+12h).
2. **Dynamic Escalation Banners**: Sweep-in UI alerts as individual districts trigger new threat boundaries (e.g., Puri transitioning from `WARNING` to `CRITICAL` at frame 18).
3. **Tactical Threat Overlays**: Instanced, shader-driven meshes that change color intensity mapping in sync with the current active frame metrics.
