/**
 * CommandCenterLayout.tsx — Phase-4 Operational Command Center
 * Palantir Gotham / NASA Mission Control aesthetic with:
 * - Live clock + threat level header
 * - Telemetry bar
 * - Cinematic escalation banners
 * - Replay controls
 * - Weather-aware sidebar
 * - Incident management integration
 */

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapScene } from '@/components/map/MapScene'
import { LegendPanel } from '@/components/panels/LegendPanel'
import { SimulationDeck } from '@/components/panels/SimulationDeck'
import { SidebarPanel } from '@/components/panels/SidebarPanel'
import { AlignLeft, Layers } from 'lucide-react'
import { ReplayControlBar } from '@/components/replay/ReplayControlBar'
import { ReplaySelector } from '@/components/replay/ReplaySelector'
import { ThreatLevelIndicator } from '@/components/hud/ThreatLevelIndicator'
import { TelemetryBar } from '@/components/hud/TelemetryBar'
import { DistrictEscalationBanner } from '@/components/hud/DistrictEscalationBanner'
import { useSimulationLifecycle } from '@/hooks/useSimulationLifecycle'
import { useWeatherStore } from '@/store/useWeatherStore'
import { useReplayStore } from '@/store/useReplayStore'
import { useSimulationStore } from '@/store/useSimulationStore'

// ─── Live Clock ───────────────────────────────────────────────────────────────

const LiveClock = () => {
  const [time, setTime] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-right">
      <p className="font-mono text-sm tabular-nums text-slate-700">
        {time.toLocaleTimeString('en-IN', { hour12: false })} IST
      </p>
      <p className="text-[10px] text-slate-500">
        {time.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
      </p>
    </div>
  )
}

// ─── Connection Status Badge ──────────────────────────────────────────────────

const ConnectionBadge = () => {
  const apiConnected = useWeatherStore((s) => s.apiConnected)
  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        className={`h-1.5 w-1.5 rounded-full ${apiConnected ? 'bg-emerald-400' : 'bg-yellow-400'}`}
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <span className="text-[9px] uppercase tracking-[0.35em] text-slate-500">
        {apiConnected ? 'LIVE' : 'MOCK'}
      </span>
    </div>
  )
}

// ─── Main Layout ──────────────────────────────────────────────────────────────

export const CommandCenterLayout = () => {
  const [replaySelectorOpen, setReplaySelectorOpen] = useState(false)
  const [leftHovered, setLeftHovered] = useState(false)
  const [rightHovered, setRightHovered] = useState(false)
  useSimulationLifecycle()

  const startWeatherPolling = useWeatherStore((s) => s.startPolling)
  const replayMode          = useReplayStore((s) => s.mode)
  const escalation          = useSimulationStore((s) => s.escalation)

  // Start weather polling on mount
  useEffect(() => {
    startWeatherPolling()
  }, [startWeatherPolling])

  // Dynamic scan-line opacity based on escalation
  const scanlineOpacity =
    escalation?.code === 'LIVE_COORDINATION' ? 0.03 : 0

  return (
    <div className="relative min-h-screen overflow-hidden text-slate-900">

      {/* Background scan-line effect for critical escalations */}
      <AnimatePresence>
        {scanlineOpacity > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: scanlineOpacity }}
            exit={{ opacity: 0 }}
            className="pointer-events-none fixed inset-0 z-0"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239,68,68,0.04) 2px, rgba(239,68,68,0.04) 4px)',
            }}
          />
        )}
      </AnimatePresence>

      {/* Cinematic escalation banners */}
      <DistrictEscalationBanner />

      {/* Replay scenario selector modal */}
      <ReplaySelector open={replaySelectorOpen} onClose={() => setReplaySelectorOpen(false)} />

      {/* ═══════════ HEADER ═══════════ */}
      <header className="fixed left-0 right-0 top-0 z-30 glass-panel border-b-0 shadow-sm text-slate-900">
        <div className="mx-auto max-w-[1700px] px-4">
          <div className="flex items-center gap-4 py-2.5">

            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-teal-500/20 bg-teal-500/10 text-teal-700">
                <span className="text-sm">🛡️</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-teal-600">FloodGuard AI</p>
                  <span className="rounded border border-teal-500/20 bg-teal-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-teal-700">Phase-4</span>
                </div>
                <h1 className="text-sm font-semibold text-slate-900">Odisha Disaster Intelligence Command</h1>
              </div>
            </div>

            {/* Telemetry bar */}
            <div className="hidden lg:block">
              <TelemetryBar />
            </div>

            <div className="flex flex-1 items-center justify-end gap-4">
              <ConnectionBadge />

              <button
                type="button"
                id="btn-open-replay-selector"
                onClick={() => setReplaySelectorOpen(true)}
                className={`flex items-center gap-2 rounded-xl border px-3 py-1.5 text-[10px] uppercase tracking-widest transition-colors ${
                  replayMode === 'replay'
                    ? 'border-red-400/40 bg-red-500/10 text-red-600'
                    : 'border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-900'
                }`}
              >
                {replayMode === 'replay' ? '⏺ Replay Active' : '🎬 History Replay'}
              </button>

              <LiveClock />
            </div>
          </div>
        </div>
      </header>

      {/* ═══════════ FULL BLEED MAP ═══════════ */}
      <div className="fixed inset-0 z-0">
        <MapScene />
        {/* Replay overlay in map when active */}
        {replayMode === 'replay' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute left-6 top-24 z-10 rounded-xl border border-red-200 bg-white/80 px-3 py-1.5 backdrop-blur-xl shadow-lg"
          >
            <p className="text-[9px] font-bold uppercase tracking-widest text-red-600">
              ⏺ Historical Replay
            </p>
          </motion.div>
        )}
      </div>

      {/* ═══════════ FLOATING CONTROLS ═══════════ */}
      <div className="fixed inset-0 pointer-events-none z-20">
        
        {/* LEFT SIDEBAR (Bunker / Hover Expand) */}
        <motion.aside
          onHoverStart={() => setLeftHovered(true)}
          onHoverEnd={() => setLeftHovered(false)}
          animate={{ 
            x: leftHovered ? 0 : -320, 
            opacity: leftHovered ? 1 : 0.4
          }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
          className="pointer-events-auto absolute left-4 top-24 flex w-[320px] flex-col gap-4"
        >
          {/* Bunker Icon when collapsed */}
          {!leftHovered && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute -right-12 top-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl glass-panel text-slate-500 hover:text-slate-900"
            >
              <AlignLeft size={18} />
            </motion.div>
          )}
          
          <div className="rounded-2xl glass-panel p-4">
            <ThreatLevelIndicator />
          </div>
          <SidebarPanel />
        </motion.aside>

        {/* BOTTOM DECK */}
        <div className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2">
          <AnimatePresence mode="wait">
            {replayMode === 'replay' ? (
              <motion.div key="replay" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <ReplayControlBar />
              </motion.div>
            ) : (
              <motion.div key="live" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
                <SimulationDeck />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT SIDEBAR (Bunker / Hover Expand) */}
        <motion.aside
          onHoverStart={() => setRightHovered(true)}
          onHoverEnd={() => setRightHovered(false)}
          animate={{ 
            x: rightHovered ? 0 : 300, 
            opacity: rightHovered ? 1 : 0.4
          }}
          transition={{ type: 'spring', damping: 24, stiffness: 200 }}
          className="pointer-events-auto absolute right-4 top-24 flex w-[300px] flex-col gap-4"
        >
          {/* Bunker Icon when collapsed */}
          {!rightHovered && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="absolute -left-12 top-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl glass-panel text-slate-500 hover:text-slate-900"
            >
              <Layers size={18} />
            </motion.div>
          )}

          <LegendPanel />
        </motion.aside>
      </div>
    </div>
  )
}
