/**
 * replayWorker.ts — Historical Disaster Replay Web Worker
 * Phase-4: Computes Cyclone Fani / Yaas replay frame data off the main thread.
 * Drives district-level escalation curves derived from historical records.
 */

import type { ReplayEvent, DistrictState } from './workerBridge'

// ─── Historical Scenario Database ────────────────────────────────────────────

interface ScenarioDefinition {
  id: string
  name: string
  totalFrames: number
  events: ReplayEvent[]
  districtCurves: Record<string, DistrictCurve>
}

interface DistrictCurve {
  name: string
  population: number
  rainfallMmCurve: number[]   // mm/hr per frame
  floodDepthCurve: number[]   // meters per frame
  escalationCurve: ('WATCH' | 'WARNING' | 'CRITICAL' | 'CATASTROPHIC')[]
}

// Cyclone Fani — May 3, 2019
// Rated ESCS (Extremely Severe Cyclonic Storm), 250 km/h winds, 1.5M evacuated
const FANI_SCENARIO: ScenarioDefinition = {
  id: 'fani',
  name: 'Cyclone Fani (May 3, 2019)',
  totalFrames: 72,
  events: [
    { frame: 0,  label: 'IMD Alert: ESCS Warning Issued',         type: 'evacuation', severity: 'warning',  districtId: 'puri' },
    { frame: 6,  label: 'T-24h: Mass Evacuation Ordered',         type: 'evacuation', severity: 'critical', districtId: 'puri' },
    { frame: 12, label: 'T-18h: Storm Surge Warning — Coast',     type: 'surge',      severity: 'critical', districtId: 'kendrapara' },
    { frame: 18, label: 'T-12h: 1.2M Evacuated to Shelters',     type: 'evacuation', severity: 'critical' },
    { frame: 24, label: 'T-6h: Rainfall Commences (120mm/hr)',   type: 'escalation', severity: 'critical', districtId: 'puri' },
    { frame: 30, label: 'T+0: LANDFALL — Puri Coast (250km/h)',  type: 'landfall',   severity: 'critical', districtId: 'puri' },
    { frame: 33, label: 'Surge Front: Jagatsinghpur Flooding',   type: 'surge',      severity: 'critical', districtId: 'jagatsinghpur' },
    { frame: 36, label: 'Kendrapara: CATASTROPHIC Flooding',     type: 'escalation', severity: 'critical', districtId: 'kendrapara' },
    { frame: 42, label: 'T+6h: Wind Weakening, Rain Continues',  type: 'escalation', severity: 'warning' },
    { frame: 48, label: 'T+12h: Flood Peak — 64 Districts Hit',  type: 'escalation', severity: 'critical' },
    { frame: 54, label: 'T+18h: NDRF Deployed — Relief Ops',    type: 'relief',     severity: 'info' },
    { frame: 60, label: 'T+24h: Waters Receding — Northwest',   type: 'relief',     severity: 'info' },
    { frame: 66, label: 'T+36h: Restoration Operations Begin',  type: 'relief',     severity: 'info' },
    { frame: 71, label: 'Post-Fani: Recovery Phase Initiated',  type: 'relief',     severity: 'info' },
  ],
  districtCurves: {
    puri: {
      name: 'Puri',
      population: 1498604,
      rainfallMmCurve: buildRainfallCurve(72, { peakFrame: 30, peakMm: 204, risingFrames: 20, fallingFrames: 30 }),
      floodDepthCurve: buildDepthCurve(72, { peakFrame: 36, peakDepth: 4.2, risingFrames: 24, fallingFrames: 32 }),
      escalationCurve: buildEscalationCurve(72, { watchStart: 18, warningStart: 24, criticalStart: 30, catastrophicStart: 33, recoveryStart: 54 }),
    },
    kendrapara: {
      name: 'Kendrapara',
      population: 1440680,
      rainfallMmCurve: buildRainfallCurve(72, { peakFrame: 34, peakMm: 178, risingFrames: 22, fallingFrames: 28 }),
      floodDepthCurve: buildDepthCurve(72, { peakFrame: 38, peakDepth: 3.8, risingFrames: 26, fallingFrames: 30 }),
      escalationCurve: buildEscalationCurve(72, { watchStart: 20, warningStart: 26, criticalStart: 32, catastrophicStart: 36, recoveryStart: 56 }),
    },
    jagatsinghpur: {
      name: 'Jagatsinghpur',
      population: 1136604,
      rainfallMmCurve: buildRainfallCurve(72, { peakFrame: 32, peakMm: 156, risingFrames: 20, fallingFrames: 30 }),
      floodDepthCurve: buildDepthCurve(72, { peakFrame: 35, peakDepth: 3.1, risingFrames: 22, fallingFrames: 32 }),
      escalationCurve: buildEscalationCurve(72, { watchStart: 19, warningStart: 25, criticalStart: 31, catastrophicStart: 34, recoveryStart: 55 }),
    },
  },
}

// Cyclone Yaas — May 26, 2021
// Rated VSCS (Very Severe Cyclonic Storm), historic storm surge in Odisha
const YAAS_SCENARIO: ScenarioDefinition = {
  id: 'yaas',
  name: 'Cyclone Yaas (May 26, 2021)',
  totalFrames: 72,
  events: [
    { frame: 0,  label: 'IMD Alert: VSCS Warning — Bay of Bengal', type: 'evacuation', severity: 'warning' },
    { frame: 8,  label: 'T-24h: Coastal Evacuation Begins',        type: 'evacuation', severity: 'critical', districtId: 'kendrapara' },
    { frame: 14, label: 'T-18h: Storm Surge Warning — 2-4m',       type: 'surge',      severity: 'critical', districtId: 'kendrapara' },
    { frame: 20, label: 'T-12h: 900K Evacuated to Safe Zones',    type: 'evacuation', severity: 'critical' },
    { frame: 26, label: 'T-6h: Tidal Surge Begins (Full Moon)',   type: 'surge',      severity: 'critical', districtId: 'kendrapara' },
    { frame: 30, label: 'T+0: LANDFALL — Bahanaga (140km/h)',     type: 'landfall',   severity: 'critical', districtId: 'kendrapara' },
    { frame: 33, label: 'Surge Front: 4.5m Surge Recorded',       type: 'surge',      severity: 'critical', districtId: 'jagatsinghpur' },
    { frame: 36, label: 'Bhadrak: CATASTROPHIC Inundation',       type: 'escalation', severity: 'critical', districtId: 'kendrapara' },
    { frame: 40, label: 'T+8h: Embankment Breaches — 300 pts',   type: 'escalation', severity: 'critical' },
    { frame: 48, label: 'T+18h: 500K Still in Submerged Areas',  type: 'escalation', severity: 'critical' },
    { frame: 54, label: 'T+24h: Army + NDRF Relief Deployed',    type: 'relief',     severity: 'info' },
    { frame: 60, label: 'T+36h: Saline Intrusion Assessment',    type: 'relief',     severity: 'warning' },
    { frame: 66, label: 'T+48h: Gradual De-flooding Operations', type: 'relief',     severity: 'info' },
    { frame: 71, label: 'Post-Yaas: 180K Homes Damaged Report',  type: 'relief',     severity: 'warning' },
  ],
  districtCurves: {
    puri: {
      name: 'Puri',
      population: 1498604,
      rainfallMmCurve: buildRainfallCurve(72, { peakFrame: 32, peakMm: 95, risingFrames: 22, fallingFrames: 32 }),
      floodDepthCurve: buildDepthCurve(72, { peakFrame: 36, peakDepth: 2.1, risingFrames: 24, fallingFrames: 34 }),
      escalationCurve: buildEscalationCurve(72, { watchStart: 20, warningStart: 28, criticalStart: 34, catastrophicStart: -1, recoveryStart: 52 }),
    },
    kendrapara: {
      name: 'Kendrapara',
      population: 1440680,
      rainfallMmCurve: buildRainfallCurve(72, { peakFrame: 30, peakMm: 145, risingFrames: 20, fallingFrames: 30 }),
      floodDepthCurve: buildDepthCurve(72, { peakFrame: 34, peakDepth: 4.8, risingFrames: 22, fallingFrames: 32 }),
      escalationCurve: buildEscalationCurve(72, { watchStart: 18, warningStart: 24, criticalStart: 30, catastrophicStart: 33, recoveryStart: 54 }),
    },
    jagatsinghpur: {
      name: 'Jagatsinghpur',
      population: 1136604,
      rainfallMmCurve: buildRainfallCurve(72, { peakFrame: 32, peakMm: 118, risingFrames: 21, fallingFrames: 31 }),
      floodDepthCurve: buildDepthCurve(72, { peakFrame: 36, peakDepth: 3.4, risingFrames: 24, fallingFrames: 32 }),
      escalationCurve: buildEscalationCurve(72, { watchStart: 19, warningStart: 26, criticalStart: 32, catastrophicStart: 35, recoveryStart: 54 }),
    },
  },
}

const SCENARIOS: Record<string, ScenarioDefinition> = { fani: FANI_SCENARIO, yaas: YAAS_SCENARIO }

// ─── Curve Builders ───────────────────────────────────────────────────────────

function buildRainfallCurve(
  frames: number,
  opts: { peakFrame: number; peakMm: number; risingFrames: number; fallingFrames: number },
): number[] {
  const { peakFrame, peakMm, risingFrames, fallingFrames } = opts
  return Array.from({ length: frames }, (_, i) => {
    if (i < peakFrame - risingFrames) return 2
    if (i <= peakFrame) {
      const t = (i - (peakFrame - risingFrames)) / risingFrames
      return 2 + (peakMm - 2) * easeInQuad(t)
    }
    const t = Math.min(1, (i - peakFrame) / fallingFrames)
    return Math.max(2, peakMm * (1 - easeOutCubic(t)))
  })
}

function buildDepthCurve(
  frames: number,
  opts: { peakFrame: number; peakDepth: number; risingFrames: number; fallingFrames: number },
): number[] {
  const { peakFrame, peakDepth, risingFrames, fallingFrames } = opts
  return Array.from({ length: frames }, (_, i) => {
    if (i < peakFrame - risingFrames) return 0
    if (i <= peakFrame) {
      const t = (i - (peakFrame - risingFrames)) / risingFrames
      return peakDepth * easeInCubic(t)
    }
    const t = Math.min(1, (i - peakFrame) / fallingFrames)
    return Math.max(0, peakDepth * (1 - easeOutQuad(t)))
  })
}

function buildEscalationCurve(
  frames: number,
  opts: { watchStart: number; warningStart: number; criticalStart: number; catastrophicStart: number; recoveryStart: number },
): ('WATCH' | 'WARNING' | 'CRITICAL' | 'CATASTROPHIC')[] {
  const { watchStart, warningStart, criticalStart, catastrophicStart, recoveryStart } = opts
  return Array.from({ length: frames }, (_, i) => {
    if (i >= recoveryStart) return 'WARNING'
    if (catastrophicStart > 0 && i >= catastrophicStart) return 'CATASTROPHIC'
    if (i >= criticalStart) return 'CRITICAL'
    if (i >= warningStart) return 'WARNING'
    if (i >= watchStart) return 'WATCH'
    return 'WATCH'
  })
}

// Easing functions
const easeInQuad = (t: number) => t * t
const easeOutQuad = (t: number) => 1 - (1 - t) * (1 - t)
const easeInCubic = (t: number) => t * t * t
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

// ─── Worker State ─────────────────────────────────────────────────────────────

let activeScenario: ScenarioDefinition | null = null
let currentFrame = 0

const computeFrameState = (scenario: ScenarioDefinition, frame: number): DistrictState[] => {
  const safeFrame = Math.min(frame, scenario.totalFrames - 1)
  return Object.entries(scenario.districtCurves).map(([districtId, curve]) => {
    const floodDepth = curve.floodDepthCurve[safeFrame] ?? 0
    const rainfallMm = curve.rainfallMmCurve[safeFrame] ?? 0
    const escalationLevel = curve.escalationCurve[safeFrame] ?? 'WATCH'
    const depthRatio = floodDepth / 5.0
    const affectedPopulation = Math.floor(curve.population * Math.min(1, depthRatio * 0.8))

    return { districtId, floodDepth, rainfallMm, escalationLevel, affectedPopulation }
  })
}

// ─── Message Handler ──────────────────────────────────────────────────────────

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data

  try {
    switch (type) {
      case 'LOAD_SCENARIO': {
        const scenario = SCENARIOS[payload.scenarioId]
        if (!scenario) {
          self.postMessage({ type: 'ERROR', payload: { message: `Unknown scenario: ${payload.scenarioId}` } })
          return
        }
        activeScenario = scenario
        currentFrame = 0
        self.postMessage({
          type: 'SCENARIO_LOADED',
          payload: { totalFrames: scenario.totalFrames, events: scenario.events },
        })
        break
      }

      case 'SEEK': {
        if (!activeScenario) return
        currentFrame = Math.min(Math.max(0, payload.frame), activeScenario.totalFrames - 1)
        const states = computeFrameState(activeScenario, currentFrame)
        const phase = activeScenario.districtCurves['puri']?.escalationCurve[currentFrame] ?? 'WATCH'
        const rainfall = activeScenario.districtCurves['puri']?.rainfallMmCurve[currentFrame] ?? 0
        self.postMessage({ type: 'FRAME_UPDATE', payload: { frame: currentFrame, districtStates: states, phase, rainfall } })
        break
      }

      case 'ADVANCE': {
        if (!activeScenario) return
        currentFrame = Math.min(currentFrame + 1, activeScenario.totalFrames - 1)
        const states = computeFrameState(activeScenario, currentFrame)
        const phase = activeScenario.districtCurves['puri']?.escalationCurve[currentFrame] ?? 'WATCH'
        const rainfall = activeScenario.districtCurves['puri']?.rainfallMmCurve[currentFrame] ?? 0
        self.postMessage({ type: 'FRAME_UPDATE', payload: { frame: currentFrame, districtStates: states, phase, rainfall } })
        break
      }

      case 'RESET': {
        currentFrame = 0
        if (activeScenario) {
          const states = computeFrameState(activeScenario, 0)
          self.postMessage({ type: 'FRAME_UPDATE', payload: { frame: 0, districtStates: states, phase: 'WATCH', rainfall: 0 } })
        }
        break
      }

      default:
        console.warn('[ReplayWorker] Unknown message type:', type)
    }
  } catch (err) {
    self.postMessage({ type: 'ERROR', payload: { message: String(err) } })
  }
}

export {}
