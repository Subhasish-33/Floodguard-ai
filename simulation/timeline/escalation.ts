import type { EscalationPhase, EscalationPhaseCode } from '../engine/types'

import { PLAYBACK_TOTAL_FRAMES } from '../config/defaultSimulationConfig'

const PHASES: EscalationPhase[] = [
  {
    code: 'DETECTION_PREDICTION',

    label: 'Detection & prediction',

    timelineLabel: 'T-6h',

  },

  {

    code: 'RISK_ASSESSMENT',

    label: 'Risk assessment',

    timelineLabel: 'T-4h',

  },

  {

    code: 'ACTION_LOGISTICS',

    label: 'Action & logistics',

    timelineLabel: 'T-2h',

  },

  {

    code: 'LIVE_COORDINATION',

    label: 'Live coordination',

    timelineLabel: 'T-0h',

  },

]

export function resolveEscalationPhase(frameIndex: number): EscalationPhase {

  const t = PLAYBACK_TOTAL_FRAMES > 0 ? frameIndex / PLAYBACK_TOTAL_FRAMES : 0

  let phaseIndex = 0

  if (t < 0.25) phaseIndex = 0

  else if (t < 0.5) phaseIndex = 1

  else if (t < 0.78) phaseIndex = 2

  else phaseIndex = 3

  return PHASES[phaseIndex] ?? PHASES[0]
}

export function phaseCodeFromFrame(frameIndex: number): EscalationPhaseCode {

  return resolveEscalationPhase(frameIndex).code

}
