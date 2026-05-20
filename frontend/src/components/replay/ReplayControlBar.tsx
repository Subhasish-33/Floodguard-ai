/**
 * ReplayControlBar.tsx — Disaster Replay Control Interface
 * Phase-4: VCR-style controls with timeline event HUD synchronized to replay frame.
 */

import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useReplayStore, SCENARIO_CATALOG } from '@/store/useReplayStore'

const formatFrame = (frame: number, total: number): string => {
  // Map frame to relative timeline: frames 0-71 represent T-36h to T+36h
  const hoursOffset = Math.round(((frame / (total - 1)) * 72) - 36)
  const sign = hoursOffset >= 0 ? '+' : ''
  return `T${sign}${hoursOffset}h`
}

export const ReplayControlBar = () => {
  const mode             = useReplayStore((s) => s.mode)
  const activeScenario   = useReplayStore((s) => s.activeScenario)
  const replayFrame      = useReplayStore((s) => s.replayFrame)
  const totalFrames      = useReplayStore((s) => s.totalFrames)
  const isPaused         = useReplayStore((s) => s.isPaused)
  const replaySpeed      = useReplayStore((s) => s.replaySpeed)
  const timelineEvents   = useReplayStore((s) => s.timelineEvents)
  const replayPhase      = useReplayStore((s) => s.replayPhase)
  const rainfall         = useReplayStore((s) => s.currentRainfallMm)
  const currentDistricts = useReplayStore((s) => s.currentDistrictStates)

  const startReplay   = useReplayStore((s) => s.startReplay)
  const pauseReplay   = useReplayStore((s) => s.pauseReplay)
  const stopReplay    = useReplayStore((s) => s.stopReplay)
  const seekFrame     = useReplayStore((s) => s.seekFrame)
  const setSpeed      = useReplayStore((s) => s.setReplaySpeed)
  const advanceFrame  = useReplayStore((s) => s.advanceFrame)
  const exitReplay    = useReplayStore((s) => s.exitReplay)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-advance frames when playing
  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!isPaused && mode === 'replay') {
      const ms = Math.max(100, 800 / replaySpeed)
      intervalRef.current = setInterval(() => advanceFrame(), ms)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPaused, replaySpeed, mode, advanceFrame])

  if (mode !== 'replay' || !activeScenario) return null

  const meta = SCENARIO_CATALOG[activeScenario]
  const scrubMax = Math.max(1, totalFrames - 1)
  const progress = replayFrame / scrubMax

  // Find nearest event to current frame
  const nearestEvent = timelineEvents.reduce<typeof timelineEvents[0] | null>((best, ev) => {
    if (ev.frame > replayFrame) return best
    if (!best || Math.abs(ev.frame - replayFrame) < Math.abs(best.frame - replayFrame)) return ev
    return best
  }, null)

  const phaseColor =
    replayPhase === 'CATASTROPHIC' ? 'text-red-700' :
    replayPhase === 'CRITICAL'     ? 'text-red-600' :
    replayPhase === 'WARNING'      ? 'text-orange-600' : 'text-amber-600'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      className="pointer-events-auto flex w-max max-w-[95vw] flex-col gap-5 rounded-[2.5rem] glass-panel p-6 shadow-2xl"
    >
      {/* Scenario Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            className="h-2 w-2 rounded-full bg-red-400"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          />
          <div>
            <p className="text-[9px] uppercase tracking-widest text-red-600">Historical Replay Active</p>
            <p className="text-sm font-bold text-slate-900">{meta.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className={`text-[11px] font-bold uppercase tracking-[0.28em] ${phaseColor}`}>{replayPhase}</p>
            <p className="text-[10px] text-slate-400">{formatFrame(replayFrame, totalFrames)}</p>
          </div>
          <button
            type="button"
            onClick={exitReplay}
            className="rounded-full border border-slate-300 bg-white/60 px-4 py-1.5 text-[9px] uppercase tracking-widest text-slate-600 hover:text-slate-900 hover:bg-white"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Current Event Label */}
      <AnimatePresence mode="wait">
        {nearestEvent && (
          <motion.div
            key={nearestEvent.frame}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={`rounded-xl border px-4 py-2.5 text-[11px] shadow-sm backdrop-blur-sm ${
              nearestEvent.severity === 'critical' ? 'border-red-200 bg-red-50 text-red-700' :
              nearestEvent.severity === 'warning'  ? 'border-orange-200 bg-orange-50 text-orange-700' :
                                                     'border-white/60 bg-white/40 text-slate-800'
            }`}
          >
            <span className="font-medium">{nearestEvent.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timeline Scrubber */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[9px] uppercase tracking-[0.32em] text-slate-600">
          <span>T-36h</span>
          <span>LANDFALL</span>
          <span>T+36h</span>
        </div>

        {/* Event markers */}
        <div className="relative h-1.5">
          <div className="absolute inset-0 rounded-full bg-slate-200" />
          <motion.div
            className="absolute left-0 h-full rounded-full bg-gradient-to-r from-yellow-500/70 via-red-500/80 to-red-700/60"
            style={{ width: `${progress * 100}%` }}
          />
          {/* Event dots */}
          {timelineEvents.map((ev) => {
            const pos = (ev.frame / scrubMax) * 100
            return (
              <div
                key={ev.frame}
                className={`absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full shadow-sm ${
                  ev.severity === 'critical' ? 'bg-red-500' :
                  ev.severity === 'warning'  ? 'bg-orange-500' : 'bg-slate-400'
                }`}
                style={{ left: `${pos}%` }}
                title={ev.label}
              />
            )
          })}
        </div>

        <input
          type="range"
          min={0}
          max={scrubMax}
          value={replayFrame}
          onChange={(e) => seekFrame(Number(e.target.value))}
          className="w-full accent-red-500"
          aria-label="Replay timeline scrubber"
        />
      </div>

      {/* Controls Row */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => isPaused ? startReplay() : pauseReplay()}
          className="flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-6 py-2.5 text-[11px] uppercase tracking-widest text-red-700 hover:bg-red-100 shadow-sm"
        >
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>

        <button
          type="button"
          onClick={stopReplay}
          className="rounded-full border border-slate-300 bg-white/60 px-5 py-2.5 text-[11px] uppercase tracking-widest text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm"
        >
          ⏹ Reset
        </button>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[9px] uppercase tracking-[0.3em] text-slate-500">Speed</span>
          {[0.5, 1, 2, 4].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSpeed(s)}
              className={`rounded-full px-3 py-1 text-[10px] font-mono transition-colors shadow-sm ${
                replaySpeed === s
                  ? 'bg-red-50 border border-red-200 text-red-700'
                  : 'border border-slate-300 bg-white/60 text-slate-600 hover:bg-white'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* District Summary */}
      {currentDistricts.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {currentDistricts.map((ds) => (
            <div key={ds.districtId} className={`rounded-2xl border px-4 py-3 shadow-sm backdrop-blur-sm ${
              ds.escalationLevel === 'CATASTROPHIC' ? 'border-red-200 bg-red-100' :
              ds.escalationLevel === 'CRITICAL'     ? 'border-red-200 bg-red-50' :
              ds.escalationLevel === 'WARNING'      ? 'border-orange-200 bg-orange-50' :
                                                      'border-white/60 bg-white/40'
            }`}>
              <p className="text-[9px] uppercase tracking-[0.28em] text-slate-500 capitalize">{ds.districtId}</p>
              <p className={`text-[10px] font-bold ${
                ds.escalationLevel === 'CATASTROPHIC' ? 'text-red-800' :
                ds.escalationLevel === 'CRITICAL'     ? 'text-red-600' :
                ds.escalationLevel === 'WARNING'      ? 'text-orange-600' : 'text-amber-600'
              }`}>{ds.escalationLevel}</p>
              <p className="text-[9px] text-slate-600">{ds.rainfallMm.toFixed(0)} mm/hr</p>
            </div>
          ))}
        </div>
      )}

      {rainfall > 0 && (
        <div className="flex items-center gap-2 text-[10px] text-slate-500">
          <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          Peak Rainfall: <span className="text-blue-700 font-mono font-semibold">{rainfall.toFixed(1)} mm/hr</span>
          <span className="ml-2">Affected Pop: <span className="text-red-600 font-mono font-semibold">
            {currentDistricts.reduce((a, d) => a + d.affectedPopulation, 0).toLocaleString()}
          </span></span>
        </div>
      )}
    </motion.div>
  )
}
