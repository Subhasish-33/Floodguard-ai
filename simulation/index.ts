
/** Public simulation package surface for frontend + tooling. */

export type {

  FloodGridState,

  FloodSimulationConfig,

  FloodSimulationSnapshotDTO,

  EscalationPhase,

  EscalationPhaseCode,

} from './engine/types'

export {

  summarizeGlobalFlooding,

  mergeSimulationConfig,

  advanceHydrologyStep,

  serializeFloodSimulationSnapshot,

  PLAYBACK_TOTAL_FRAMES,

  DEFAULT_FLOOD_CONFIG,

} from './engine/engine'

export { stepCellularPropagation, type PropagationStepContext } from './propagation/cellularAutomaton'

export { resolveEscalationPhase, phaseCodeFromFrame } from './timeline/escalation'

export {

  HOTSPOTS,

  type HotspotDefinition,

  type HotspotId,

} from './config/hotspots'

export {

  buildFloodGridFromTerrain,

  centroidToGridSeedMask,

} from './terrain/gridFromTerrain'

export type { TerrainElevationGrid } from './terrain/types'

export { buildBBoxMaskUniformGrid, type LonLatBounds } from './terrain/gridMask'

export {

  snapshotAt,

  recordFrame,

  clearSnapshots,

  createFrameRingBuffer,

  cloneDepthBuffer,

} from './cache/frameCache'

export { clampFrame } from './playback/controller'
