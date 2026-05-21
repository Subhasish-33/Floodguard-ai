import { MapScene } from '@/components/map/MapScene'

export const IncidentManagementPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden text-slate-900 bg-[#1e293b]">
      {/* Background Map - Dramatic Lighting */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#7c2d12]/40 via-[#1e293b]/60 to-[#0f172a]/80 z-10 mix-blend-multiply"></div>
        <MapScene />
        {/* Red Glow over Map */}
        <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-red-600/20 blur-[120px] rounded-full z-15 pointer-events-none"></div>
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 flex p-8 pt-24 gap-6 justify-between">
        
        {/* Left Sidebar */}
        <div className="w-72 glass-panel-heavy rounded-3xl flex flex-col justify-between p-6 pointer-events-auto h-full shadow-2xl border border-white/20">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              </div>
              <div>
                <h2 className="text-[13px] font-bold text-slate-900">Command Center</h2>
                <p className="text-[10px] uppercase tracking-widest text-slate-500">Odisha State Hub</p>
              </div>
            </div>

            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
                <span className="text-slate-400 text-lg">📊</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">District Analytics</span>
              </button>
              <button className="flex items-center gap-4 w-full rounded-xl bg-teal-800 px-4 py-3 text-white shadow-md text-left transition-colors">
                <span className="text-teal-200 text-lg">≡</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">Active Incidents</span>
              </button>
              <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
                <span className="text-slate-400 text-lg">((•))</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">Sensor Grid</span>
              </button>
              <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
                <span className="text-slate-400 text-lg">💧</span>
                <span className="text-[11px] font-bold tracking-widest uppercase">Hydrology</span>
              </button>
            </nav>
          </div>
          
          <div>
            <button className="w-full rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 text-white text-[12px] font-bold tracking-widest uppercase hover:from-red-700 hover:to-red-800 transition-colors shadow-lg shadow-red-600/30 flex justify-center items-center gap-2">
              <span>⚠</span> Emergency Protocol
            </button>
          </div>
        </div>

        {/* Middle Vertical Panel - Operational Feed */}
        <div className="w-80 glass-panel rounded-3xl p-6 pointer-events-auto border border-white/40 h-full overflow-y-auto ml-12 relative flex flex-col">
          <div className="flex justify-between items-center mb-6 sticky top-0 bg-white/10 backdrop-blur-md pb-2 -mx-2 px-2 z-10 border-b border-white/20">
             <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Operational Feed ⏱</h2>
          </div>

          <div className="relative flex-1">
             {/* Vertical Timeline Line */}
             <div className="absolute left-2 top-2 bottom-0 w-px bg-slate-300"></div>
             
             <div className="flex flex-col gap-6 relative">
               
               {/* Event 1 */}
               <div className="pl-6 relative">
                 <div className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">14:45 • MANUAL CONFIRM</p>
                 <p className="text-xs font-semibold text-slate-800">Level 3 Alert Dispatched to Regional NDMA</p>
               </div>

               {/* Event 2 */}
               <div className="pl-6 relative">
                 <div className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-teal-500"></div>
                 <p className="text-[9px] font-bold text-teal-700 uppercase tracking-widest mb-1">14:20 • AI DETECTION</p>
                 <p className="text-xs font-semibold text-slate-800">Embankment Breach Detected in Ganjam Sector 4</p>
               </div>

               {/* Event 3 */}
               <div className="pl-6 relative">
                 <div className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">13:55 • SYSTEM</p>
                 <p className="text-xs font-semibold text-slate-800">Telemetry Sync: 144 Sensors reporting stable</p>
               </div>

               {/* Event 4 */}
               <div className="pl-6 relative">
                 <div className="absolute left-1.5 top-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]"></div>
                 <p className="text-[9px] font-bold text-red-600 uppercase tracking-widest mb-1">13:30 • AI DETECTION</p>
                 <p className="text-xs font-semibold text-slate-900">Spike in River Discharge: +1200 m³/s</p>
               </div>

             </div>
          </div>
        </div>

        {/* Right Panels Container */}
        <div className="w-[22rem] flex flex-col gap-6 pointer-events-auto h-full">
          
          {/* Active Responses */}
          <div className="glass-panel rounded-3xl p-6 shadow-xl border border-white/40 flex-shrink-0">
             <div className="flex items-center gap-2 mb-6">
                <span className="text-teal-600 text-lg">♺</span>
                <h2 className="text-sm font-bold text-slate-800">Active Responses</h2>
             </div>

             <div className="flex flex-col gap-4">
                
                {/* Response 1 */}
                <div className="bg-white/60 rounded-2xl p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-800 text-sm">Relief Team 4</h3>
                    <span className="text-[9px] font-bold text-teal-700 uppercase tracking-widest">EN ROUTE</span>
                  </div>
                  <p className="text-[10px] text-slate-600 mb-3 leading-snug">Target: Jagatsinghpur Primary Hub</p>
                  <div className="flex items-center justify-between">
                     <div className="flex -space-x-2">
                       <div className="w-6 h-6 rounded-full bg-slate-200 border-2 border-white"></div>
                       <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                     </div>
                     <span className="text-[9px] font-medium text-slate-500 italic">ETA: 14 Minutes</span>
                  </div>
                </div>

                {/* Response 2 */}
                <div className="bg-white/60 rounded-2xl p-4 border border-slate-200">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-slate-800 text-sm">Drone Fleet Sigma</h3>
                    <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest">SCANNING</span>
                  </div>
                  <p className="text-[10px] text-slate-600 leading-snug">Mapping 4km² sector of coastal inundation</p>
                </div>

             </div>
          </div>

          {/* Operator Logs */}
          <div className="glass-panel rounded-3xl p-6 shadow-xl border border-white/40 flex-1 flex flex-col overflow-hidden">
             <div className="flex justify-between items-center mb-4">
                <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Operator Logs</h2>
                <button className="text-slate-400 hover:text-slate-700 border border-slate-300 rounded-full w-5 h-5 flex items-center justify-center leading-none pb-0.5">+</button>
             </div>

             <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4">
               
               <div className="border-l-2 border-teal-500 pl-3">
                 <p className="text-[11px] text-slate-700 italic leading-relaxed">
                   "Ground verification confirmed AI alert. Water depth is 1.2m at sector C-12. Evacuation initiated."
                 </p>
                 <p className="text-[9px] font-medium text-teal-700 mt-2">Chief Officer R. Sen • 4m ago</p>
               </div>

               <div className="border-l-2 border-slate-300 pl-3">
                 <p className="text-[11px] text-slate-700 italic leading-relaxed">
                   "Mobile network failing in lower delta. Switching to satellite backup for field telemetry."
                 </p>
                 <p className="text-[9px] font-medium text-slate-500 mt-2">Admin K. Kumar • 18m ago</p>
               </div>

             </div>
          </div>

        </div>

      </div>

      {/* Bottom Scrubber Pill */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-auto z-20">
        <div className="glass-pill px-2 py-2 flex items-center gap-6 shadow-2xl border border-white/40">
          
          <div className="flex items-center gap-3 pl-4">
            <button className="text-slate-500 hover:text-slate-800">⏮</button>
            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-800 text-white shadow-md hover:bg-teal-900 transition-colors">
              ▶
            </button>
            <button className="text-slate-500 hover:text-slate-800">⏭</button>
          </div>

          <div className="flex items-center gap-2">
            <div className="bg-teal-800 rounded-full px-4 py-2 text-center text-white flex flex-col shadow-inner">
               <span className="text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5">LIVE</span>
               <span className="text-[10px] font-mono font-bold leading-none">11:34:15</span>
            </div>
            <div className="hover:bg-slate-100/50 cursor-pointer rounded-full px-4 py-2 text-center text-slate-500 flex flex-col transition-colors">
               <span className="text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5">FORECAST</span>
               <span className="text-[10px] font-mono font-bold leading-none">+1h</span>
            </div>
            <div className="hover:bg-slate-100/50 cursor-pointer rounded-full px-4 py-2 text-center text-slate-500 flex flex-col transition-colors">
               <span className="text-[9px] font-bold uppercase tracking-widest leading-none mb-0.5">SCENARIO</span>
               <span className="text-[10px] font-mono font-bold leading-none">+6h</span>
            </div>
          </div>

          <div className="pr-2">
            <button className="bg-slate-800 text-white rounded-full px-6 py-3 text-[11px] font-bold uppercase tracking-widest shadow-md hover:bg-slate-900 transition-colors flex items-center gap-2">
              <span className="text-red-400">📢</span> Declare Incident
            </button>
          </div>

        </div>
      </div>

    </div>
  )
}
