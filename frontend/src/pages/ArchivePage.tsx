import { MapScene } from '@/components/map/MapScene'

export const ArchivePage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden text-slate-900 bg-slate-900">
      {/* Background map - dramatic style */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/80 via-slate-800/40 to-slate-900/80 z-10 pointer-events-none"></div>
        <MapScene />
      </div>

      <div className="absolute inset-0 pointer-events-none z-20">
        
        {/* Left Panel: Archive Selection */}
        <div className="pointer-events-auto absolute left-6 top-24 bottom-32 w-[340px] flex flex-col glass-panel-heavy rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-teal-700">↺</span>
            <h2 className="text-base font-bold text-slate-900">Archive Selection</h2>
          </div>

          <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
            {/* Active Card */}
            <div className="rounded-2xl border border-teal-200 bg-white p-4 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-teal-600"></div>
              <div className="flex justify-between items-start mb-4 pl-2">
                <div>
                  <h3 className="font-bold text-teal-900 text-[13px]">Cyclone Fani</h3>
                  <p className="text-[10px] text-slate-500 font-medium">May 2019 • Cat 4</p>
                </div>
                <div className="h-6 w-6 rounded-full bg-teal-50 flex items-center justify-center text-teal-600">
                  ▶
                </div>
              </div>
              <div className="flex items-end gap-1 h-8 pl-2">
                 <div className="w-full bg-teal-500/40 rounded-t-sm" style={{height: '20%'}}></div>
                 <div className="w-full bg-teal-500/60 rounded-t-sm" style={{height: '35%'}}></div>
                 <div className="w-full bg-teal-500/80 rounded-t-sm" style={{height: '70%'}}></div>
                 <div className="w-full bg-teal-600 rounded-t-sm" style={{height: '100%'}}></div>
                 <div className="w-full bg-teal-500/80 rounded-t-sm" style={{height: '80%'}}></div>
                 <div className="w-full bg-teal-500/60 rounded-t-sm" style={{height: '50%'}}></div>
                 <div className="w-full bg-teal-500/40 rounded-t-sm" style={{height: '30%'}}></div>
              </div>
            </div>

            {/* Inactive Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-white cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-700 text-[13px]">Cyclone Yaas</h3>
                  <p className="text-[10px] text-slate-500 font-medium">May 2021 • Cat 3</p>
                </div>
              </div>
              <div className="flex items-end gap-1 h-8 opacity-40 grayscale">
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '10%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '20%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '40%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '60%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '40%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '20%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '10%'}}></div>
              </div>
            </div>

             {/* Inactive Card */}
             <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition-colors hover:bg-white cursor-pointer">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-slate-700 text-[13px]">August Floods</h3>
                  <p className="text-[10px] text-slate-500 font-medium">Aug 2022 • Monsoonal</p>
                </div>
              </div>
              <div className="flex items-end gap-1 h-8 opacity-40 grayscale">
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '40%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '50%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '60%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '55%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '40%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '35%'}}></div>
                 <div className="w-full bg-slate-400 rounded-t-sm" style={{height: '30%'}}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel: Event Intelligence */}
        <div className="pointer-events-auto absolute right-6 top-24 bottom-32 w-[340px] flex flex-col glass-panel-heavy rounded-3xl p-5">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-ocean-700">📈</span>
            <h2 className="text-base font-bold text-slate-900">Event Intelligence</h2>
          </div>

          <div className="rounded-2xl bg-teal-50/80 border border-teal-100 p-5 mb-6">
            <p className="text-[10px] font-bold text-teal-800 tracking-widest uppercase mb-1">Evacuation Pulse (Historical)</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-light tracking-tighter text-teal-700">1.2M</span>
              <span className="text-[11px] font-medium text-teal-800">relocated</span>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex-1 relative pl-4 mt-2">
             <div className="absolute top-0 bottom-0 left-[21px] w-0.5 bg-slate-200"></div>
             
             <div className="relative mb-8">
               <div className="absolute -left-[5px] top-1.5 h-3 w-3 rounded-full bg-slate-300 border-2 border-white"></div>
               <div className="pl-6">
                 <p className="text-[10px] font-bold text-slate-400">T-Minus 24h</p>
                 <p className="text-xs text-slate-500 mt-1">Yellow Warning Issued for Coastal Districts.</p>
               </div>
             </div>

             <div className="relative mb-8">
               <div className="absolute -left-[9px] top-1 h-5 w-5 rounded-full bg-red-100 border-2 border-white flex items-center justify-center shadow-sm">
                  <div className="h-2.5 w-2.5 rounded-full bg-red-500"></div>
               </div>
               <div className="pl-6">
                 <div className="rounded-xl bg-white border border-red-100 shadow-sm p-3 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <p className="text-[10px] font-bold text-red-600">T-Minus 12h</p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">Landfall Projected near Puri. Red Alert active.</p>
                 </div>
               </div>
             </div>

             <div className="relative mb-8">
               <div className="absolute -left-[5px] top-1.5 h-3 w-3 rounded-full bg-teal-400 border-2 border-white shadow-[0_0_8px_rgba(45,212,191,0.5)]"></div>
               <div className="pl-6">
                 <p className="text-[10px] font-bold text-slate-500">T-Plus 4h</p>
                 <p className="text-xs text-slate-600 mt-1">Expected Embankment Breach in Jagatsinghpur.</p>
               </div>
             </div>
          </div>
        </div>

        {/* Bottom Playback Pill */}
        <div className="pointer-events-auto absolute bottom-8 left-1/2 -translate-x-1/2 w-[700px]">
          <div className="glass-panel-heavy rounded-2xl p-5 shadow-2xl flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-teal-800 text-white shadow-md hover:bg-teal-700">
                  ⏸
                </button>
                <div className="rounded-full bg-white px-3 py-1.5 border border-slate-200 text-[10px] font-bold text-slate-600">
                  2x Speed
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold tracking-tight text-slate-900">May 02, 14:00</h3>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">T-Minus 12 Hours</p>
              </div>
            </div>

            {/* Scrubber */}
            <div className="relative mt-2 h-10 w-full flex items-center">
               <div className="absolute left-0 right-0 h-1.5 bg-slate-200 rounded-full"></div>
               <div className="absolute left-0 h-1.5 w-[45%] bg-teal-700 rounded-full"></div>
               
               {/* Nodes */}
               <div className="absolute left-[20%] h-3 w-3 -mt-[3px] rounded-full bg-white border-2 border-teal-700"></div>
               <div className="absolute left-[45%] h-4 w-4 -mt-[4px] rounded-full bg-white border-[3px] border-orange-500 shadow-md flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500"></div>
               </div>
               <div className="absolute left-[70%] h-3 w-3 -mt-[3px] rounded-full bg-white border-2 border-orange-500"></div>
               
               {/* Labels */}
               <div className="absolute left-[65%] top-6 text-[8px] font-bold text-orange-600 tracking-widest uppercase">Landfall</div>
               <div className="absolute left-[85%] top-6 text-[8px] font-bold text-slate-400 tracking-widest uppercase">Recovery</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
