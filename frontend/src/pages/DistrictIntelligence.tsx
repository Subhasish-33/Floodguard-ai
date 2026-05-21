import { MapScene } from '@/components/map/MapScene'

export const DistrictIntelligence = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden text-slate-900 bg-[#eef2f6]">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#eef2f6]/40 via-transparent to-[#eef2f6]/80 z-10 pointer-events-none"></div>
        <MapScene />
      </div>

      <div className="absolute inset-0 pointer-events-none z-20 p-6 pt-24">
        
        {/* Header Area */}
        <div className="mb-6 pointer-events-auto">
          <div className="flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-slate-400 mb-1">
             <span className="hover:text-slate-600 cursor-pointer">Odisha</span>
             <span>›</span>
             <span className="text-teal-600">Puri District</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">Puri Intelligence Hub</h1>
        </div>

        {/* Layout Grid */}
        <div className="flex gap-6 h-[calc(100vh-180px)]">
          
          {/* Left Column */}
          <div className="w-[320px] flex flex-col gap-4 pointer-events-auto">
             
             {/* Risk Level */}
             <div className="glass-panel rounded-2xl p-5">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Flood Risk Level</span>
                  <div className="flex items-center gap-1.5 rounded-md bg-red-100 px-2 py-1">
                     <div className="h-1.5 w-1.5 rounded-full bg-red-500"></div>
                     <span className="text-[9px] font-bold text-red-700">Critical</span>
                  </div>
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">High / Critical</h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Mahanadi river delta indicating severe breach risk within 24h.
                </p>
             </div>

             {/* Chart Placeholder */}
             <div className="glass-panel rounded-2xl p-5 flex-1">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Water Level Trends (Mahanadi)</span>
                <div className="mt-4 h-32 w-full relative">
                   <div className="absolute left-0 bottom-0 top-0 w-px bg-slate-200"></div>
                   <div className="absolute left-0 right-0 bottom-0 h-px bg-slate-200"></div>
                   <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                     <path d="M0 80 Q 25 70, 50 60 T 100 20" fill="none" stroke="#0f766e" strokeWidth="2" />
                     <path d="M0 80 Q 25 70, 50 60 T 100 20 L 100 100 L 0 100 Z" fill="rgba(20, 184, 166, 0.1)" />
                   </svg>
                   <div className="absolute -right-6 top-[20%] text-[9px] font-medium text-slate-500">+4m</div>
                   <div className="absolute -right-6 bottom-0 text-[9px] font-medium text-slate-500">0m</div>
                   <div className="absolute left-0 -bottom-5 text-[9px] font-medium text-slate-400">-12h</div>
                   <div className="absolute right-0 -bottom-5 text-[9px] font-medium text-slate-400">Now</div>
                </div>
             </div>

             {/* Village Status */}
             <div className="glass-panel rounded-2xl p-5">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500 mb-4 block">Key Village Status</span>
                <div className="space-y-3">
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-800">Astaranga</span>
                     <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">Evacuating</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-800">Kakatpur</span>
                     <span className="rounded bg-red-100 px-2 py-0.5 text-[10px] font-medium text-red-700">Inundated</span>
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-sm font-medium text-slate-800">Gop</span>
                     <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">On Alert</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Map Center Area (Flexible) */}
          <div className="flex-1 relative pointer-events-auto">
             {/* Hovering Map Labels */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40px] flex items-center gap-2 glass-pill px-3 py-1.5 shadow-md">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
                <span className="text-[10px] font-bold text-slate-800">Gop Breach Zone</span>
             </div>

             <div className="absolute top-[60%] left-[30%] flex items-center gap-2 glass-pill px-3 py-1.5 shadow-md">
                <span className="text-teal-700">✈</span>
                <span className="text-[10px] font-bold text-slate-800">Drone Alpha-1</span>
             </div>
          </div>

          {/* Right Column */}
          <div className="w-[320px] flex flex-col gap-4 pointer-events-auto">
             
             {/* Live Weather & Pop */}
             <div className="glass-panel rounded-2xl p-5 flex justify-between">
                <div>
                  <span className="text-[9px] font-bold tracking-widest uppercase text-slate-500">Live Weather</span>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-xl">⛅</span>
                     <span className="text-2xl font-light text-slate-900">28°C</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-slate-500">
                     <span>💨 45km/h</span>
                     <span>🌧 12mm/h</span>
                  </div>
                </div>
                <div className="text-right">
                   <span className="flex items-center justify-end gap-1 text-[9px] font-bold tracking-widest uppercase text-red-500">
                     ⚠ Population at Risk
                   </span>
                   <div className="text-2xl font-bold text-red-700 mt-1">124k</div>
                </div>
             </div>

             {/* Shelter Zones */}
             <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                   <span className="text-ocean-600">🏛</span>
                   <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Shelter Zones</span>
                </div>
                <div className="flex justify-between items-center mb-1">
                   <span className="text-xs font-medium text-slate-700">Primary Shelters</span>
                   <span className="text-xs font-bold text-slate-900">14 Active</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                   <span className="text-xs font-medium text-slate-700">Current Occupancy</span>
                   <span className="text-xs font-bold text-ocean-700">62%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
                   <div className="h-full bg-ocean-600 w-[62%] rounded-full"></div>
                </div>
                <p className="text-[9px] text-right text-slate-500">Capacity remaining: ~3,400</p>
             </div>

             {/* Active Assets */}
             <div className="glass-panel rounded-2xl p-5 flex-1">
                <div className="flex items-center gap-2 mb-4">
                   <span className="text-teal-600">◎</span>
                   <span className="text-[10px] font-bold tracking-widest uppercase text-slate-500">Active Assets</span>
                </div>
                <div className="space-y-4">
                   <div className="flex gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-700 text-[10px]">
                         ✈
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-800">Drone Alpha-1</p>
                         <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">Surveying coastal embankment. Battery: 84%</p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700 text-[10px]">
                         🚚
                      </div>
                      <div>
                         <p className="text-xs font-bold text-slate-800">Relief Team 4</p>
                         <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">En route to Astaranga. ETA: 12 mins</p>
                      </div>
                   </div>
                </div>
             </div>
             
             {/* Map Controls block right aligned with Assets */}
             <div className="absolute right-0 bottom-0 flex flex-col gap-2">
                <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80 shadow-md">+</button>
                <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80 shadow-md">-</button>
                <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80 shadow-md">⌖</button>
                <button className="h-10 w-10 rounded-full glass-panel flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-white/80 shadow-md">⚏</button>
             </div>

          </div>
        </div>

        {/* Bottom Panel */}
        <div className="absolute bottom-6 left-[344px] right-[344px] pointer-events-auto">
           <div className="glass-pill px-4 py-3 flex items-center gap-4">
              <button className="h-12 w-12 shrink-0 flex items-center justify-center rounded-full bg-teal-800 text-white shadow-md hover:bg-teal-700">
                ▶
              </button>
              <div className="flex-1">
                 <div className="flex justify-between items-end mb-2">
                    <span className="text-xs font-bold text-slate-700">Predicted Inundation (T+24h)</span>
                    <span className="text-[10px] font-bold text-teal-700">14:00 IST</span>
                 </div>
                 <div className="relative h-1.5 bg-slate-200 rounded-full">
                    <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-teal-700 rounded-full"></div>
                    <div className="absolute left-[40%] top-1/2 -mt-2 h-4 w-4 rounded-full bg-white border-[3px] border-teal-700 shadow-md"></div>
                 </div>
                 <div className="flex justify-between mt-1.5 text-[8px] font-medium text-slate-400 uppercase tracking-widest">
                    <span>Now</span>
                    <span>+12h</span>
                    <span>+24h</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}
