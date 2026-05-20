/**
 * analyticsWorker.ts — Analytics Aggregation Web Worker
 * Phase-4: Computes population-at-risk, district breakdowns, and evacuation
 * scores entirely off the main thread so HUD updates never block rendering.
 */

import type { VillageInput, DistrictBreakdown } from './workerBridge'

// ─── Analytics Engine ─────────────────────────────────────────────────────────

function computeVillageRisk(village: VillageInput, depthAtCell: number) {
  const effectiveDepth = Math.max(0, depthAtCell - village.elevation * 0.05)

  let riskBand: 'SAFE' | 'WATCH' | 'WARNING' | 'CRITICAL' | 'CATASTROPHIC' = 'SAFE'
  if (effectiveDepth > 3.5)      riskBand = 'CATASTROPHIC'
  else if (effectiveDepth > 2.0) riskBand = 'CRITICAL'
  else if (effectiveDepth > 1.0) riskBand = 'WARNING'
  else if (effectiveDepth > 0.2) riskBand = 'WATCH'

  const affectedFraction =
    riskBand === 'CATASTROPHIC' ? 0.95 :
    riskBand === 'CRITICAL'     ? 0.75 :
    riskBand === 'WARNING'      ? 0.40 :
    riskBand === 'WATCH'        ? 0.10 : 0

  return { riskBand, affectedPopulation: Math.floor(village.population * affectedFraction) }
}

function escalationFromBand(worstBand: string): 'WATCH' | 'WARNING' | 'CRITICAL' | 'CATASTROPHIC' {
  if (worstBand === 'CATASTROPHIC') return 'CATASTROPHIC'
  if (worstBand === 'CRITICAL')     return 'CRITICAL'
  if (worstBand === 'WARNING')      return 'WARNING'
  return 'WATCH'
}

// ─── Message Handler ──────────────────────────────────────────────────────────

self.onmessage = (event: MessageEvent) => {
  const { type, payload } = event.data

  if (type !== 'COMPUTE_ANALYTICS') {
    console.warn('[AnalyticsWorker] Unknown message type:', type)
    return
  }

  try {
    const { villages, floodDepths } = payload as {
      villages: VillageInput[]
      floodDepths: Float32Array
    }

    // Per-district aggregation
    const districtMap = new Map<string, {
      villages: number
      atRisk: number
      totalAffected: number
      worstBand: string
      totalPopulation: number
    }>()

    let globalAffected = 0
    let globalAtRisk = 0

    for (const village of villages) {
      const rawDepth = floodDepths[village.gridIndex] ?? 0
      const { riskBand, affectedPopulation } = computeVillageRisk(village, rawDepth * 10) // scale to meters

      if (!districtMap.has(village.districtId)) {
        districtMap.set(village.districtId, { villages: 0, atRisk: 0, totalAffected: 0, worstBand: 'SAFE', totalPopulation: 0 })
      }

      const district = districtMap.get(village.districtId)!
      district.villages += 1
      district.totalPopulation += village.population
      district.totalAffected += affectedPopulation
      globalAffected += affectedPopulation

      if (riskBand !== 'SAFE') {
        district.atRisk += 1
        globalAtRisk += 1
        // Track worst band
        const bandOrder = ['SAFE', 'WATCH', 'WARNING', 'CRITICAL', 'CATASTROPHIC']
        if (bandOrder.indexOf(riskBand) > bandOrder.indexOf(district.worstBand)) {
          district.worstBand = riskBand
        }
      }
    }

    const districtBreakdown: DistrictBreakdown[] = []
    for (const [districtId, data] of districtMap.entries()) {
      const evacuationUrgency = data.totalPopulation > 0
        ? Math.min(1, data.totalAffected / data.totalPopulation)
        : 0

      districtBreakdown.push({
        districtId,
        affected: data.totalAffected,
        villagesAtRisk: data.atRisk,
        evacuationUrgency,
        escalationLevel: escalationFromBand(data.worstBand),
      })
    }

    // Sort by affected population descending
    districtBreakdown.sort((a, b) => b.affected - a.affected)

    self.postMessage({
      type: 'ANALYTICS_READY',
      payload: { globalAffected, villagesAtRisk: globalAtRisk, districtBreakdown },
    })
  } catch (err) {
    self.postMessage({ type: 'ERROR', payload: { message: String(err) } })
  }
}

export {}
