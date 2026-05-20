import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useDisasterStore } from '@/store/useDisasterStore'
import { useIntelligenceStore } from '@/store/useIntelligenceStore'

export const SidebarPanel = () => {
  const riskScores = useDisasterStore((state) => state.riskScores)
  const selectedDistrictId = useDisasterStore((state) => state.selectedDistrictId)
  
  const analytics = useIntelligenceStore((state) => state.analytics)

  const selectedRisk = useMemo(
    () => riskScores.find((risk) => risk.districtId === selectedDistrictId) ?? null,
    [riskScores, selectedDistrictId],
  )

  const averageRisk = useMemo(() => {
    if (!riskScores.length) return 0
    return riskScores.reduce((acc, risk) => acc + risk.value, 0) / riskScores.length
  }, [riskScores])
  
  const districtAnalytics = useMemo(() => {
    return analytics?.districtAnalytics.find(da => da.districtId === selectedDistrictId)
  }, [analytics, selectedDistrictId])

  return (
    <motion.div
      className="space-y-4 rounded-2xl border border-cyan-500/20 bg-slate-900/70 p-4 shadow-[0_0_40px_rgba(14,116,144,0.15)] backdrop-blur max-h-[85vh] overflow-y-auto custom-scrollbar"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Phase-3 Command Center</p>
        <h2 className="text-lg font-semibold text-slate-100">Operational Intelligence</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/65 p-3">
          <p className="text-slate-400">Affected Population</p>
          <p className="mt-2 text-xl font-semibold text-red-400">{analytics?.globalAffectedPopulation.toLocaleString() || 0}</p>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800/65 p-3">
          <p className="text-slate-400">Villages At Risk</p>
          <p className="mt-2 text-xl font-semibold text-orange-400">{analytics?.globalVillagesAtRisk || 0}</p>
        </div>
      </div>

      <div className="rounded-xl border border-slate-700/50 bg-slate-800/65 p-3 text-sm">
        <p className="mb-2 text-slate-400">Selected District Intelligence</p>
        {selectedRisk ? (
          <div>
            <p className="text-base font-semibold text-slate-100">{selectedRisk.districtName}</p>
            {districtAnalytics ? (
              <div className="mt-3 space-y-2 text-xs">
                 <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                    <span className="text-slate-400">Escalation</span>
                    <span className={`font-bold ${districtAnalytics.escalationLevel === 'CRITICAL' ? 'text-red-400' : 'text-orange-400'}`}>{districtAnalytics.escalationLevel}</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                    <span className="text-slate-400">Evacuation Urgency</span>
                    <span className="text-amber-300">{(districtAnalytics.evacuationUrgency * 100).toFixed(1)}%</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-900/50 p-2 rounded">
                    <span className="text-slate-400">Active Hotspots</span>
                    <span className="text-cyan-300">{districtAnalytics.activeHotspots}</span>
                 </div>
              </div>
            ) : (
              <div className="mt-3 text-xs text-slate-400">No operational data available for this district.</div>
            )}
          </div>
        ) : (
          <p className="text-slate-400 text-xs">Select a district to view tactical data.</p>
        )}
      </div>

      <div className="rounded-xl border border-red-500/25 bg-red-500/5 p-3 text-xs text-red-100">
        <p className="font-medium text-red-400">Live Evacuation Protocol</p>
        <p className="mt-1 text-red-200/70">
          UAV Surveillance active. Escorting high-risk villages along safe routes. Submerged terrain is dynamically recalculated for shortest-safe-paths.
        </p>
      </div>
    </motion.div>
  )
}
