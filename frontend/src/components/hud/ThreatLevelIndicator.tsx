/**
 * ThreatLevelIndicator.tsx — Animated Tactical Threat Level HUD
 * Phase-4: Palantir-style threat level display with pulsing animations.
 * Driven by simulation escalation phase and district states.
 */

import { motion } from 'framer-motion'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useReplayStore } from '@/store/useReplayStore'

type ThreatLevel = 'MINIMAL' | 'ELEVATED' | 'SEVERE' | 'CRITICAL' | 'CATASTROPHIC'

interface ThreatConfig {
  label: ThreatLevel
  color: string
  bgColor: string
  borderColor: string
  glowColor: string
  pulse: boolean
}

const THREAT_CONFIGS: ThreatConfig[] = [
  { label: 'MINIMAL',      color: 'text-teal-700',   bgColor: 'bg-teal-50',    borderColor: 'border-teal-200',    glowColor: 'shadow-sm shadow-teal-500/10', pulse: false },
  { label: 'ELEVATED',     color: 'text-amber-700',  bgColor: 'bg-amber-50',   borderColor: 'border-amber-200',   glowColor: 'shadow-sm shadow-amber-500/10', pulse: false },
  { label: 'SEVERE',       color: 'text-orange-700', bgColor: 'bg-orange-50',  borderColor: 'border-orange-200',  glowColor: 'shadow-md shadow-orange-500/20', pulse: true },
  { label: 'CRITICAL',     color: 'text-red-700',    bgColor: 'bg-red-50',     borderColor: 'border-red-200',     glowColor: 'shadow-lg shadow-red-500/20',    pulse: true },
  { label: 'CATASTROPHIC', color: 'text-red-800',    bgColor: 'bg-red-100',    borderColor: 'border-red-300',     glowColor: 'shadow-xl shadow-red-600/30',    pulse: true },
]

const resolveTheatLevel = (escalation: string): ThreatConfig => {
  if (escalation === 'CATASTROPHIC' || escalation === 'catastrophic') return THREAT_CONFIGS[4]
  if (escalation === 'critical'     || escalation === 'CRITICAL')     return THREAT_CONFIGS[3]
  if (escalation === 'warning'      || escalation === 'WARNING'  || escalation === 'SEVERE')     return THREAT_CONFIGS[2]
  if (escalation === 'watch'        || escalation === 'WATCH'    || escalation === 'ELEVATED')    return THREAT_CONFIGS[1]
  return THREAT_CONFIGS[0]
}

export const ThreatLevelIndicator = () => {
  const escalation   = useSimulationStore((s) => s.escalation)
  const replayMode   = useReplayStore((s) => s.mode)
  const replayPhase  = useReplayStore((s) => s.replayPhase)

  const phaseLabel = replayMode === 'replay' ? replayPhase : (escalation?.code ?? 'DETECTION_PREDICTION')
  const config     = resolveTheatLevel(phaseLabel)

  const threatIdx = THREAT_CONFIGS.findIndex((c) => c.label === config.label)

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[9px] uppercase tracking-[0.45em] text-slate-500">Threat Level</p>

      <motion.div
        key={config.label}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative flex items-center gap-2 rounded-xl border px-3 py-2 ${config.bgColor} ${config.borderColor} shadow-lg ${config.glowColor}`}
      >
        {/* Pulse ring for severe+ */}
        {config.pulse && (
          <motion.div
            className={`absolute inset-0 rounded-xl border-2 ${config.borderColor}`}
            animate={{ opacity: [0.8, 0, 0.8], scale: [1, 1.06, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Dot indicator */}
        <div className="relative flex h-2.5 w-2.5 items-center justify-center">
          <div className={`h-2.5 w-2.5 rounded-full ${
            config.label === 'MINIMAL'      ? 'bg-teal-500' :
            config.label === 'ELEVATED'     ? 'bg-amber-500'  :
            config.label === 'SEVERE'       ? 'bg-orange-500'  :
            config.label === 'CRITICAL'     ? 'bg-red-500'     :
                                              'bg-red-600'
          }`} />
          {config.pulse && (
            <motion.div
              className={`absolute inset-0 rounded-full ${
                config.label === 'CRITICAL' || config.label === 'CATASTROPHIC' ? 'bg-red-500' : 'bg-orange-500'
              }`}
              animate={{ opacity: [0.8, 0], scale: [1, 2.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          )}
        </div>

        <span className={`text-[11px] font-bold tracking-[0.28em] uppercase ${config.color}`}>
          {config.label}
        </span>
      </motion.div>

      {/* Threat level bars */}
      <div className="flex gap-1 pt-0.5">
        {THREAT_CONFIGS.map((cfg, i) => (
          <motion.div
            key={cfg.label}
            className="h-1 flex-1 rounded-full"
            animate={{
              backgroundColor: i <= threatIdx
                ? cfg.label === 'MINIMAL'      ? '#14b8a6'
                : cfg.label === 'ELEVATED'     ? '#f59e0b'
                : cfg.label === 'SEVERE'       ? '#f97316'
                : cfg.label === 'CRITICAL'     ? '#ef4444'
                :                               '#dc2626'
                : 'rgba(0,0,0,0.06)',
              opacity: i <= threatIdx ? (config.pulse && i === threatIdx ? [1, 0.5, 1] : 1) : 0.3,
            }}
            transition={{ duration: 0.5, opacity: { duration: 1.4, repeat: config.pulse && i === threatIdx ? Infinity : 0 } }}
          />
        ))}
      </div>
    </div>
  )
}
