import { useMemo } from 'react'
import { useDisasterStore } from '@/store/useDisasterStore'

export const LegendPanel = () => {
  const riskOpacity = useDisasterStore((state) => state.riskOpacity)
  const setRiskOpacity = useDisasterStore((state) => state.setRiskOpacity)
  const riskScores = useDisasterStore((state) => state.riskScores)

  const topDistricts = useMemo(
    () => [...riskScores].sort((a, b) => b.value - a.value).slice(0, 6),
    [riskScores],
  )

  return (
    <div className="space-y-5 rounded-3xl glass-panel p-5">
      <div>
        <p className="text-[9px] uppercase tracking-widest text-slate-500">Risk Legend</p>
        <h3 className="text-base font-semibold text-slate-900 mt-1">AI Vulnerability Heatmap</h3>
      </div>

      <div className="space-y-2 text-sm">
        <LegendSwatch color="bg-rose-500" label="High vulnerability" subtitle="Immediate intervention required" />
        <LegendSwatch color="bg-amber-500" label="Moderate vulnerability" subtitle="Preparedness in progress" />
        <LegendSwatch color="bg-emerald-500" label="Safer corridor" subtitle="Lower current flood vulnerability" />
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/40 p-4 text-xs shadow-sm backdrop-blur-sm">
        <label htmlFor="opacity" className="mb-2 block text-[10px] text-slate-600 uppercase tracking-widest font-medium">
          Heatmap intensity: {(riskOpacity * 100).toFixed(0)}%
        </label>
        <input
          id="opacity"
          type="range"
          min={0.2}
          max={1}
          step={0.05}
          value={riskOpacity}
          onChange={(event) => setRiskOpacity(Number(event.target.value))}
          className="w-full accent-cyan-400"
        />
      </div>

      <div className="rounded-2xl border border-white/60 bg-white/40 p-4 text-xs shadow-sm backdrop-blur-sm">
        <p className="text-[10px] uppercase tracking-widest font-medium text-slate-600 mb-3">Top AI hotspots</p>
        <div className="space-y-2">
          {topDistricts.map((district) => (
            <div key={district.districtId} className="flex items-center justify-between text-slate-600">
              <span>{district.districtName}</span>
              <span className="font-semibold text-slate-900">{(district.value * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const LegendSwatch = ({
  color,
  label,
  subtitle,
}: {
  color: string
  label: string
  subtitle: string
}) => (
  <div className="flex items-start gap-3 rounded-xl border border-white/80 bg-white/60 p-2.5 shadow-sm">
    <span className={`mt-0.5 h-2.5 w-2.5 rounded-full ${color} shadow-sm`} />
    <div>
      <p className="text-slate-900 font-medium">{label}</p>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  </div>
)
