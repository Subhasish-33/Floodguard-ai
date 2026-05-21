/**
 * DistrictEscalationBanner.tsx — Cinematic Escalation Notifications
 * Phase-4: Sweep-in alert banners when districts hit WARNING/CRITICAL.
 * Auto-dismisses with persistence in the incident log.
 */

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSimulationStore } from '@/store/useSimulationStore'
import { useReplayStore } from '@/store/useReplayStore'
import { useIncidentStore } from '@/store/useIncidentStore'

interface EscalationAlert {
  id: string
  districtName: string
  districtId: string
  level: 'WARNING' | 'CRITICAL' | 'CATASTROPHIC'
  timestamp: string
}

const LEVEL_CONFIG = {
  WARNING:      { color: 'text-orange-200', bg: 'bg-orange-900/70', border: 'border-orange-400/60', icon: '⚡', label: 'WARNING' },
  CRITICAL:     { color: 'text-red-200',    bg: 'bg-red-900/70',    border: 'border-red-400/70',    icon: '🔴', label: 'CRITICAL' },
  CATASTROPHIC: { color: 'text-red-100',    bg: 'bg-red-950/80',    border: 'border-red-300/80',    icon: '🔺', label: 'CATASTROPHIC' },
}

export const DistrictEscalationBanner = () => {
  const [alerts, setAlerts] = useState<EscalationAlert[]>([])
  const seenRef             = useRef<Set<string>>(new Set())

  const createIncident = useIncidentStore((s) => s.createIncident)
  const replayStates   = useReplayStore((s) => s.currentDistrictStates)
  const replayMode     = useReplayStore((s) => s.mode)
  const escalation     = useSimulationStore((s) => s.escalation)

  useEffect(() => {
    const checkAndAlert = (districtId: string, districtName: string, level: string) => {
      if (level !== 'WARNING' && level !== 'CRITICAL' && level !== 'CATASTROPHIC') return
      const key = `${districtId}:${level}`
      if (seenRef.current.has(key)) return
      seenRef.current.add(key)

      const alert: EscalationAlert = {
        id: `${Date.now()}-${districtId}`,
        districtName,
        districtId,
        level: level as EscalationAlert['level'],
        timestamp: new Date().toISOString(),
      }

      setAlerts((prev) => [alert, ...prev].slice(0, 4))

      // Auto-create incident
      createIncident({
        type: 'FLOOD',
        severity: level === 'WARNING' ? 'HIGH' : 'CRITICAL',
        districtId,
        title: `${level} Flood Alert — ${districtName}`,
        description: `Automated escalation detected. District reached ${level} inundation level.`,
        tags: ['automated', 'escalation'],
      })

      // Auto-dismiss after 8s
      setTimeout(() => {
        setAlerts((prev) => prev.filter((a) => a.id !== alert.id))
      }, 8000)
    }

    if (replayMode === 'replay') {
      replayStates.forEach((ds) => {
        const name = ds.districtId.charAt(0).toUpperCase() + ds.districtId.slice(1)
        checkAndAlert(ds.districtId, name, ds.escalationLevel)
      })
    } else {
      // Live simulation
      const level = (escalation?.code ?? 'DETECTION_PREDICTION').replace('LIVE_COORDINATION', 'CRITICAL').replace('ACTION_LOGISTICS', 'WARNING')
      if (level === 'CRITICAL' || level === 'WARNING') {
        checkAndAlert('statewide', 'Odisha Statewide', level)
      }
    }
  }, [replayStates, replayMode, escalation, createIncident])

  return (
    <div className="pointer-events-none fixed right-4 top-24 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {alerts.map((alert) => {
          const cfg = LEVEL_CONFIG[alert.level]
          return (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: 60, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.88 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={`w-72 rounded-xl border px-4 py-3 backdrop-blur ${cfg.bg} ${cfg.border} shadow-2xl`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg leading-none">{cfg.icon}</span>
                <div>
                  <p className={`text-[10px] font-bold uppercase tracking-[0.35em] ${cfg.color}`}>
                    {cfg.label}
                  </p>
                  <p className="mt-0.5 text-xs font-semibold text-slate-100">
                    {alert.districtName}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">
                    Flood escalation detected · {new Date(alert.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Sweep-in progress bar that drains over 8s */}
              <motion.div
                className={`mt-2 h-0.5 rounded-full ${
                  alert.level === 'CATASTROPHIC' ? 'bg-red-400' :
                  alert.level === 'CRITICAL'     ? 'bg-red-400' : 'bg-orange-400'
                }`}
                initial={{ scaleX: 1, originX: 0 }}
                animate={{ scaleX: 0 }}
                transition={{ duration: 8, ease: 'linear' }}
              />
            </motion.div>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
