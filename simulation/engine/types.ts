/** Core flood simulation state — grid-aligned with DEM / terrain raster. */

export interface FloodSimulationConfig {
  /** Simulation steps per playback frame when playing live (typically 1–3). */
  stepsPerFrame: number
  /** Rainfall multiplier 0–1 → drives infiltration/excess accumulation. */
  rainfallIntensity: number
  /** Neighbor redistribution strength 0–1 (cellular propagation rate). */
  floodVelocity: number
  /** Global simulation speed multiplier (playback). */
  timeScale: number
  relaxationIterations: number
  dt: number
}

export interface FloodGridState {
  width: number
  height: number
  elevationNorm: Float32Array
  /** Water depth column in same vertical units as normalized elevation envelope. */
  depth: Float32Array
  /** Optional 1 = participates in propagation (hotspot cropping). */
  activeMask?: Uint8Array
}

/** Serializable tick result for APIs / parity with backend stubs. */
export interface FloodSimulationSnapshotDTO {
  width: number
  height: number
  timestep: number
  globalWaterFraction: number
  depthEncoding: number[]
  escalationPhaseCode: EscalationPhaseCode
}

export type EscalationPhaseCode =
  | 'DETECTION_PREDICTION'
  | 'RISK_ASSESSMENT'
  | 'ACTION_LOGISTICS'
  | 'LIVE_COORDINATION'

export interface EscalationPhase {
  code: EscalationPhaseCode
  label: string
  timelineLabel: string
}
