/**
 * SidebarPanel.tsx — Phase-4 Tactical Intelligence Sidebar
 * Upgraded with weather data integration, incident count badges,
 * worker computation status, and district analytics.
 */


import { useMemo } from 'react'
import { useDisasterStore } from '@/store/useDisasterStore'
import { useIntelligenceStore } from '@/store/useIntelligenceStore'
import { useWeatherStore } from '@/store/useWeatherStore'
import { useIncidentStore } from '@/store/useIncidentStore'
import { useSimulationStore } from '@/store/useSimulationStore'
import { IncidentPanel } from '@/components/panels/IncidentPanel'

const MetricCard = ({ label, value, sub, color = 'text-slate-800' }: {
  label: string; value: string | number; sub?: string; color?: string
}) => (
  <div className="rounded-2xl border border-white/60 bg-white/40 p-3 shadow-sm backdrop-blur-sm">
    <p className="text-[9px] uppercase tracking-widest text-slate-500">{label}</p>
    <p className={`mt-1.5 text-xl font-semibold tabular-nums ${color}`}>{value}</p>
    {sub && <p className="text-[10px] text-slate-500 mt-1">{sub}</p>}
  </div>
)

export const SidebarPanel = () => {
  const riskScores       = useDisasterStore((s) => s.riskScores)
  const selectedDistrictId = useDisasterStore((s) => s.selectedDistrictId)
  const analytics        = useIntelligenceStore((s) => s.analytics)
  const districtWeather  = useWeatherStore((s) => s.weatherByDistrict)
  const isPolling        = useWeatherStore((s) => s.isPolling)
  const escalation       = useSimulationStore((s) => s.escalation)
  const incidents        = useIncidentStore((s) => s.incidents)
  const activeIncidents  = incidents.filter((i) => i.lifecycle !== 'RESOLVED')
  const criticalCount    = activeIncidents.filter((i) => i.severity === 'CRITICAL').length

  const selectedRisk = useMemo(
    () => riskScores.find((r) => r.districtId === selectedDistrictId) ?? null,
    [riskScores, selectedDistrictId],
  )

  const districtAnalytics = useMemo(
    () => analytics?.districtAnalytics.find((da) => da.districtId === selectedDistrictId),
    [analytics, selectedDistrictId],
  )

  const selectedWeather = selectedDistrictId ? districtWeather[selectedDistrictId] : null

  const averageRisk = useMemo(() => {
    if (!riskScores.length) return 0
    return riskScores.reduce((acc, r) => acc + r.value, 0) / riskScores.length
  }, [riskScores])

  return (
    <div
      className="space-y-5 rounded-3xl glass-panel p-5 max-h-[75vh] overflow-y-auto custom-scrollbar"
    >
      {/* Header */}
      <div>
        <p className="text-[9px] uppercase tracking-widest text-slate-500">Operational Intelligence</p>
        <h2 className="mt-1 text-base font-semibold text-slate-900">Command Dashboard</h2>
        <div className="mt-2 flex items-center gap-2">
          <span className={`text-[9px] uppercase tracking-widest font-bold ${
            escalation?.code === 'LIVE_COORDINATION' ? 'text-red-600' :
            escalation?.code === 'ACTION_LOGISTICS'  ? 'text-amber-600' : 'text-teal-600'
          }`}>
            {escalation?.label ?? 'Monitoring'}
          </span>
          {isPolling && (
            <span className="flex items-center gap-1 text-[9px] text-slate-500">
              <span className="inline-block h-1 w-1 rounded-full bg-blue-400 animate-pulse" />
              Weather Live
            </span>
          )}
        </div>
      </div>

      {/* Global Metrics */}
      <div className="grid grid-cols-2 gap-2">
        <MetricCard
          label="Affected Pop."
          value={analytics?.globalAffectedPopulation.toLocaleString() ?? '0'}
          color="text-red-600"
        />
        <MetricCard
          label="Villages at Risk"
          value={analytics?.globalVillagesAtRisk ?? 0}
          color="text-amber-600"
        />
        <MetricCard
          label="Active Incidents"
          value={activeIncidents.length}
          sub={criticalCount > 0 ? `${criticalCount} CRITICAL` : 'All monitored'}
          color={criticalCount > 0 ? 'text-red-600' : 'text-slate-800'}
        />
        <MetricCard
          label="Avg. Risk Score"
          value={`${(averageRisk * 100).toFixed(0)}%`}
          color={averageRisk > 0.7 ? 'text-red-600' : averageRisk > 0.4 ? 'text-amber-600' : 'text-teal-600'}
        />
      </div>

      {/* District Intelligence */}
      <div className="rounded-2xl border border-white/60 bg-white/40 p-4 text-xs shadow-sm backdrop-blur-sm">
        <p className="mb-3 text-[9px] uppercase tracking-widest text-slate-500">District Intelligence</p>
        {selectedRisk ? (
          <div>
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-slate-900">{selectedRisk.districtName}</p>
              <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold tracking-widest ${
                districtAnalytics?.escalationLevel === 'CRITICAL'
                  ? 'border-red-200 bg-red-50 text-red-700'
                  : districtAnalytics?.escalationLevel === 'WARNING'
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-white text-slate-600'
              }`}>
                {districtAnalytics?.escalationLevel ?? 'WATCH'}
              </span>
            </div>

            {districtAnalytics && (
              <div className="mt-2.5 space-y-1.5">
                {[
                  { label: 'Evacuation Urgency', value: `${(districtAnalytics.evacuationUrgency * 100).toFixed(1)}%`, color: 'text-amber-600' },
                  { label: 'Active Hotspots',    value: districtAnalytics.activeHotspots,                         color: 'text-blue-600'   },
                  { label: 'Villages at Risk',   value: `${districtAnalytics.villagesAtRisk} / ${districtAnalytics.totalVillages}`, color: 'text-orange-600' },
                ].map((row) => (
                  <div key={row.label} className="flex justify-between rounded-xl bg-white/60 px-3 py-2 border border-white/80 shadow-sm">
                    <span className="text-slate-600">{row.label}</span>
                    <span className={`font-semibold tabular-nums ${row.color}`}>{row.value}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Weather for selected district */}
            {selectedWeather && (
              <div className="mt-4 rounded-xl border border-white/60 bg-white/40 p-3 space-y-2 shadow-sm">
                <p className="text-[9px] uppercase tracking-widest text-blue-600">Live Weather</p>
                <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Rainfall</span>
                    <span className="font-mono text-blue-700">{selectedWeather.rainfallMmHr.toFixed(1)} mm/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Wind</span>
                    <span className="font-mono text-slate-700">{selectedWeather.windKph} km/h</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Alert</span>
                    <span className={`font-bold ${
                      selectedWeather.alertLevel === 'EXTREME'  ? 'text-red-600' :
                      selectedWeather.alertLevel === 'WARNING'  ? 'text-orange-600' :
                      selectedWeather.alertLevel === 'WATCH'    ? 'text-amber-600' : 'text-teal-600'
                    }`}>{selectedWeather.alertLevel}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">24h Accum</span>
                    <span className="font-mono text-blue-600">{selectedWeather.rainfallAccumMm.toFixed(0)} mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 text-[11px]">Select a district on the map to view tactical intelligence.</p>
        )}
      </div>

      {/* Evacuation Protocol */}
      <div className="rounded-2xl border border-red-200 bg-red-50/80 p-4 text-xs backdrop-blur-sm shadow-sm">
        <p className="font-bold text-red-700 text-[9px] uppercase tracking-widest mb-2">Live Evacuation Protocol</p>
        <p className="text-red-900/80 leading-relaxed text-[11px]">
          UAV Surveillance active. Escorting high-risk villages along safe routes.
          Submerged terrain dynamically recalculated for shortest-safe-paths.
        </p>
      </div>

      {/* Incident Panel */}
      <div className="border-t border-white/10 pt-4">
        <IncidentPanel />
      </div>
    </div>
  )
}
