# Web Worker Architecture Documentation
## FloodGuard AI — Thread-Decoupled Geospatial Simulation System

### 1. The Main Thread Blocking Problem

In complex WebGL simulation systems, running physical calculations (such as cellular automata for water flow, pathfinding for evacuation, and heavy geospatial statistics aggregation) on the browser's main thread is highly risky. 

Because the browser's main thread handles rendering (via `requestAnimationFrame`), UI responsiveness, and user events, running O(N²) grid operations directly leads to:
- **Jank / Micro-stutters**: Frame rates dropping from 60fps to 10-15fps.
- **Input Lag**: Buttons, map rotations, and HUD sliders become unresponsive.
- **Browser Lockups**: Heavy calculation steps exceeding 16.6ms cause the browser to trigger "Page Unresponsive" dialogues.

---

### 2. Multi-Threaded Worker Pool Design

Phase-4 decouples computation from rendering using a **dedicated Web Worker pool**. Calculations are executed on concurrent CPU threads, communicating with the main thread via structured message-passing contracts.

```
 [ Main Thread ]                                        [ Worker Threads ]
   │
   ├─── User Drag/Rotate Map (60fps) ───────────────────── (Not Interrupted)
   │
   ├─── Send Grid Context ───(ArrayBuffer Transfer)─────► [ Flood Worker ]
   │                                                        │ Runs CA propagation
   │◄─── Grid Update ────────(ArrayBuffer Transfer)──────┴─ (No JSON overhead)
   │
   ├─── Trigger Aggregation ──(Message passing)──────────► [ Analytics Worker ]
   │                                                        │ Populates risk scores
   │◄─── District Stats ─────(Zustand sync)──────────────┴─ (T-24h to T+48h)
   │
   └─── Request Scenario ─────(Frame interpolation)─────► [ Replay Worker ]
```

---

### 3. Worker Implementations

#### 3.1. Flood propagation Worker (`floodWorker.ts`)
- **Responsibility**: Calculates cellular automaton-based hydrology heights.
- **Optimization Strategy**: To avoid expensive serialization/deserialization overhead when passing grid states (which can consist of 100,000+ floats), the worker utilizes **Transferable Objects**.
- **Data Transfer Code**:
```typescript
// Main thread sends buffer ownership to worker (zero-copy)
const buffer = new Float32Array(gridSize).buffer;
worker.postMessage({ type: 'COMPUTE_STEP', grid: buffer }, [buffer]);
```

#### 3.2. Analytics Worker (`analyticsWorker.ts`)
- **Responsibility**: Computes district population-at-risk, flood depths, and evacuation priority scores.
- **Performance Details**: Compares current cell water depth against village centroids, grouping them by district and updating statistical bands (`WATCH` | `WARNING` | `CRITICAL` | `CATASTROPHIC`).

#### 3.3. Historical Replay Worker (`replayWorker.ts`)
- **Responsibility**: Interpolates cyclone timeline escalation curves.
- **Performance Details**: Pre-calculates 72-frame trajectory points for historical models like Cyclone Fani or Cyclone Yaas, outputting frame state payloads to feed the UI's playback engine.

---

### 4. Generics-Based Coordinator (`workerBridge.ts`)

To ensure type safety across thread boundaries, the communication layer utilizes standard TypeScript Generics:

```typescript
export interface WorkerMessage<TType extends string, TPayload> {
  type: TType;
  payload: TPayload;
}

// Concrete worker messaging contract example
export type AnalyticsWorkerMessage = 
  | WorkerMessage<'COMPUTE_ANALYTICS', { villages: VillageInput[], floodDepths: Float32Array }>
  | WorkerMessage<'ANALYTICS_READY', { globalAffected: number, villagesAtRisk: number, districtBreakdown: DistrictBreakdown[] }>;
```

#### Benefits of `workerBridge.ts`:
1. **Unified Interface**: Spin up and interact with workers using a standardized `WorkerBridge` instance.
2. **Error Recovery**: Automatically restarts workers if they crash due to hardware faults or data anomalies.
3. **Task Throttling**: Drops obsolete computation requests if the queue builds up, ensuring workers only compute the latest UI state.
