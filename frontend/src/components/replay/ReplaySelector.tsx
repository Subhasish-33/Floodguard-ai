/**
 * ReplaySelector.tsx — Cinematic Scenario Selection Modal
 * Phase-4: Mission-briefing aesthetic for historical disaster scenario selection.
 * Presents Cyclone Fani and Yaas with real statistics and tactical context.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useReplayStore, SCENARIO_CATALOG, type ScenarioId } from '@/store/useReplayStore'

interface ReplaySelectorProps {
  open: boolean
  onClose: () => void
}

const SCENARIO_IDS: ScenarioId[] = ['fani', 'yaas']

const StatBlock = ({ label, value, unit }: { label: string; value: string | number; unit?: string }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[9px] uppercase tracking-[0.38em] text-slate-500">{label}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-lg font-bold text-slate-100">{value}</span>
      {unit && <span className="text-[10px] text-slate-400">{unit}</span>}
    </div>
  </div>
)

export const ReplaySelector = ({ open, onClose }: ReplaySelectorProps) => {
  const [hoveredId, setHoveredId] = useState<ScenarioId | null>(null)
  const loadScenario              = useReplayStore((s) => s.loadScenario)
  const startReplay               = useReplayStore((s) => s.startReplay)
  const workerStatus              = useReplayStore((s) => s.workerStatus)

  const handleSelect = (id: ScenarioId) => {
    loadScenario(id)
    startReplay()
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-3xl"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.48em] text-cyan-400">
                  Historical Disaster Intelligence
                </p>
                <h2 className="mt-1 text-2xl font-bold text-slate-100">
                  Select Replay Scenario
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Relive Odisha's most devastating cyclones with real district-level data
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-700 px-4 py-2 text-[10px] uppercase tracking-[0.3em] text-slate-400 hover:border-slate-500 hover:text-slate-200"
              >
                Close
              </button>
            </div>

            {/* Scenario Cards */}
            <div className="grid gap-4 md:grid-cols-2">
              {SCENARIO_IDS.map((id) => {
                const meta = SCENARIO_CATALOG[id]
                const isHovered = hoveredId === id

                return (
                  <motion.button
                    key={id}
                    type="button"
                    onClick={() => handleSelect(id)}
                    onHoverStart={() => setHoveredId(id)}
                    onHoverEnd={() => setHoveredId(null)}
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    className="relative overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900/80 p-5 text-left transition-colors hover:border-cyan-500/40"
                  >
                    {/* Scan-line effect on hover */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent"
                          initial={{ y: 0, opacity: 0 }}
                          animate={{ y: [0, 200], opacity: [0, 1, 0] }}
                          transition={{ duration: 1.2, repeat: Infinity }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Category badge */}
                    <div className="mb-3 flex items-center justify-between">
                      <span className={`rounded-md border px-2 py-0.5 text-[9px] uppercase tracking-[0.3em] ${
                        id === 'fani'
                          ? 'border-red-500/40 bg-red-500/10 text-red-300'
                          : 'border-orange-500/40 bg-orange-500/10 text-orange-300'
                      }`}>
                        {meta.category}
                      </span>
                      <span className="text-[10px] text-slate-500">{meta.date}</span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-100">{meta.name}</h3>
                    <p className="mt-0.5 text-[10px] text-slate-400">{meta.landfallLocation}</p>

                    <p className="mt-3 text-xs leading-relaxed text-slate-300">{meta.brief}</p>

                    {/* Stats grid */}
                    <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-700/50 pt-4">
                      <StatBlock label="Max Wind" value={meta.maxWindKph} unit="km/h" />
                      <StatBlock label="Peak Rain" value={meta.rainfallPeakMm} unit="mm/day" />
                      <StatBlock label="Surge" value={`${meta.stormSurgeM}m`} />
                      <StatBlock label="Evacuated" value={(meta.totalEvacuated / 1e6).toFixed(1)} unit="M people" />
                      <StatBlock label="Districts" value={meta.affectedDistricts} unit="affected" />
                    </div>

                    {/* CTA */}
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-cyan-300"
                      animate={{ opacity: isHovered ? 1 : 0.5 }}
                    >
                      <span>{workerStatus === 'loading' ? 'Loading...' : 'Launch Replay'}</span>
                      <motion.span animate={{ x: isHovered ? [0, 4, 0] : 0 }} transition={{ duration: 0.8, repeat: Infinity }}>
                        →
                      </motion.span>
                    </motion.div>
                  </motion.button>
                )
              })}
            </div>

            <p className="mt-4 text-center text-[10px] text-slate-600">
              All data sourced from IMD cyclone reports and NDMA post-disaster assessments
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
