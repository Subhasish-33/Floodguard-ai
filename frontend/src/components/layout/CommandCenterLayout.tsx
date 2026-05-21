import { useEffect } from 'react'
import { MapScene } from '@/components/map/MapScene'
import { useSimulationLifecycle } from '@/hooks/useSimulationLifecycle'
import { useWeatherStore } from '@/store/useWeatherStore'
import { useIncidentStore } from '@/store/useIncidentStore'
import { useNavigate } from 'react-router-dom'

const LeftSidebar = () => {
  const navigate = useNavigate()
  return (
    <div className="pointer-events-auto absolute left-6 top-24 bottom-24 w-64 flex flex-col justify-between glass-panel-heavy rounded-2xl p-4">
      <div>
        <div className="flex items-center gap-3 mb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-slate-900">Command Center</h2>
            <p className="text-[11px] text-slate-500">Odisha State Hub</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          <button onClick={() => navigate('/command-center')} className="flex items-center gap-3 w-full rounded-xl bg-blue-100/50 px-4 py-3 text-blue-700 text-left transition-colors">
            <span className="text-blue-600">◎</span>
            <span className="text-[11px] font-bold tracking-widest uppercase">Threat Map</span>
          </button>
          <button onClick={() => navigate('/analytics')} className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
            <span className="text-slate-400">📊</span>
            <span className="text-[11px] font-bold tracking-widest uppercase">Strategic Analytics</span>
          </button>
          <button onClick={() => navigate('/evacuation')} className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
            <span className="text-slate-400">🏃</span>
            <span className="text-[11px] font-bold tracking-widest uppercase">Evacuation Intel</span>
          </button>
          <button onClick={() => navigate('/weather')} className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
            <span className="text-slate-400">((•))</span>
            <span className="text-[11px] font-bold tracking-widest uppercase">Live Weather</span>
          </button>
          <button onClick={() => navigate('/drones')} className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
            <span className="text-slate-400">🛰</span>
            <span className="text-[11px] font-bold tracking-widest uppercase">Drone Operations</span>
          </button>
          <button onClick={() => navigate('/incidents')} className="flex items-center gap-3 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
            <span className="text-slate-400">⚠</span>
            <span className="text-[11px] font-bold tracking-widest uppercase">Emergency Protocol</span>
          </button>
        </nav>
      </div>

      <div className="space-y-4">
        <button className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-800 px-4 py-3 text-white text-[10px] font-bold tracking-widest uppercase hover:bg-teal-700 transition-colors">
          ▶ Initiate Simulation
        </button>
        <button className="w-full flex items-center gap-3 rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
          <span className="text-slate-400">⚙</span>
          <span className="text-[11px] font-bold tracking-widest uppercase">System Health</span>
        </button>
      </div>
    </div>
  )
}

const RightSidebar = () => {
  const incidents = useIncidentStore(s => s.incidents)
  const activeIncidents = incidents.filter(i => i.lifecycle !== 'RESOLVED').slice(0, 2)

  return (
    <div className="pointer-events-auto absolute right-6 top-24 w-72 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Live Alerts</h3>
        
        {activeIncidents.length > 0 ? activeIncidents.map(inc => (
          <div key={inc.incidentId} className={`rounded-xl border p-4 shadow-sm backdrop-blur-md ${
            inc.severity === 'CRITICAL' ? 'border-red-200 bg-red-50/90' : 'border-orange-200 bg-orange-50/90'
          }`}>
            <div className="flex items-center justify-between mb-1">
               <div className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest ${
                 inc.severity === 'CRITICAL' ? 'text-red-700' : 'text-orange-700'
               }`}>
                 <span>{inc.severity === 'CRITICAL' ? '⚠' : '≡'}</span> {inc.severity} LEVEL
               </div>
               <span className="text-[9px] text-slate-400">2m ago</span>
            </div>
            <p className="text-xs font-medium text-slate-800 leading-snug">{inc.title}</p>
          </div>
        )) : (
           <div className="rounded-xl border border-slate-200 bg-slate-50/90 p-4 shadow-sm backdrop-blur-md">
             <p className="text-xs text-slate-500">No active alerts.</p>
           </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2">Evacuation Summary</h3>
        <div className="rounded-xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-md">
           <div className="flex items-center justify-between mb-4">
             <span className="text-xs font-medium text-slate-600">Active Zones</span>
             <span className="text-xl font-light text-teal-800">3</span>
           </div>
           <div className="flex items-center justify-between mb-6">
             <span className="text-xs font-medium text-slate-600">People Relocated</span>
             <span className="text-2xl font-light text-teal-800">12.4k</span>
           </div>
           <div className="space-y-1.5">
             <div className="flex justify-between text-[9px] font-bold uppercase tracking-widest text-slate-500">
                <span>Capacity</span>
             </div>
             <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                <div className="h-full bg-teal-700 w-[65%] rounded-full"></div>
             </div>
           </div>
        </div>
      </div>
    </div>
  )
}

const BottomPill = () => {
  return (
    <div className="pointer-events-auto absolute bottom-6 left-1/2 -translate-x-1/2">
      <div className="glass-pill px-2 py-2 flex items-center gap-6">
        <div className="flex items-center gap-2 pl-2">
          <button className="text-slate-500 hover:text-slate-800">⏮</button>
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-700 text-white shadow-md hover:bg-teal-800">
            ▶
          </button>
          <button className="text-slate-500 hover:text-slate-800">⏭</button>
          <div className="ml-2 flex flex-col justify-center rounded-lg bg-white/50 px-3 py-1 border border-white">
            <span className="text-[9px] font-bold text-slate-500 uppercase">T-</span>
            <span className="text-xs font-mono font-medium text-slate-800">04:00:00</span>
          </div>
        </div>

        <div className="h-8 w-px bg-slate-300"></div>

        <div className="flex items-center gap-4 pr-6">
          <button className="flex flex-col items-center gap-1 text-teal-700">
            <span className="text-lg">📈</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">Timeline</span>
            <div className="h-0.5 w-full bg-teal-600 rounded-full mt-0.5"></div>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
            <span className="text-lg">♺</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">Scenarios</span>
            <div className="h-0.5 w-full bg-transparent rounded-full mt-0.5"></div>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
            <span className="text-lg">↺</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">Playback</span>
            <div className="h-0.5 w-full bg-transparent rounded-full mt-0.5"></div>
          </button>
          <button className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors">
            <span className="text-lg">◎</span>
            <span className="text-[9px] font-bold tracking-widest uppercase">Forecast</span>
            <div className="h-0.5 w-full bg-transparent rounded-full mt-0.5"></div>
          </button>
        </div>
      </div>
    </div>
  )
}

export const CommandCenterLayout = () => {
  useSimulationLifecycle()
  const startWeatherPolling = useWeatherStore((s) => s.startPolling)

  useEffect(() => {
    startWeatherPolling()
  }, [startWeatherPolling])

  return (
    <div className="relative h-screen w-full overflow-hidden text-slate-900 bg-[#f0f4f8]">
      {/* Background map */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 map-overlay-gradient z-10"></div>
        <MapScene />
      </div>

      {/* Floating Layout Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <LeftSidebar />
        <RightSidebar />
        <BottomPill />
      </div>
      
      {/* Map Controls */}
      <div className="pointer-events-auto absolute bottom-8 right-6 flex flex-col gap-2 z-20">
        <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80">+</button>
        <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80">-</button>
        <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80">⌖</button>
        <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80">⚏</button>
      </div>
    </div>
  )
}
