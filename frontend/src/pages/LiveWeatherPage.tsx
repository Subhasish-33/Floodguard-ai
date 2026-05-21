import { MapScene } from '@/components/map/MapScene'

export const LiveWeatherPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden text-slate-900 bg-[#0f172a]">
      {/* Background Map - Dark Mode for Weather */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/40 z-10 mix-blend-multiply"></div>
        
        {/* Swirling Cyclone Overlay (CSS/SVG) */}
        <div className="absolute inset-0 z-15 pointer-events-none opacity-60 mix-blend-screen"
             style={{
               background: 'radial-gradient(circle at 50% 60%, rgba(16, 185, 129, 0.4) 0%, rgba(6, 182, 212, 0.3) 30%, rgba(15, 23, 42, 0) 70%)'
             }}>
          <svg className="w-full h-full animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
             <path d="M50 50 Q 60 20 80 40 T 20 80 T 50 50" fill="none" stroke="rgba(52, 211, 153, 0.2)" strokeWidth="0.5" />
             <path d="M50 50 Q 30 70 20 30 T 80 20 T 50 50" fill="none" stroke="rgba(34, 211, 238, 0.2)" strokeWidth="0.5" />
             <path d="M50 50 Q 70 80 90 60 T 10 40 T 50 50" fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth="0.5" />
             
             {/* Cyclone Eye */}
             <circle cx="50" cy="50" r="2" fill="transparent" stroke="rgba(255,255,255,0.4)" strokeWidth="0.2" />
          </svg>
        </div>

        <MapScene />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        
        {/* Left Panel - Cyclone Watch */}
        <div className="absolute left-8 top-28 pointer-events-auto w-[22rem]">
          <div className="glass-panel-heavy rounded-3xl p-6 shadow-2xl border border-white/20">
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Cyclone Watch</h3>
            <h1 className="text-2xl font-bold text-slate-800 mb-6">Tropical Storm 'Maya'</h1>

            {/* Intensity Card */}
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 mb-4 flex justify-between items-center">
              <div>
                <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest mb-1">Intensity</p>
                <p className="text-xl font-bold text-red-900">Category 4</p>
              </div>
              <div className="text-red-500 text-3xl">⚠</div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Wind Speed</p>
                <p className="text-xl font-bold text-slate-900">215 <span className="text-xs text-slate-500 font-medium normal-case">km/h</span></p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Rainfall 24h</p>
                <p className="text-xl font-bold text-slate-900">340 <span className="text-xs text-slate-500 font-medium normal-case">mm</span></p>
              </div>
            </div>

            {/* Pressure Dynamics */}
            <div className="mb-8">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Pressure Dynamics</p>
              <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2 relative">
                 <div className="absolute inset-0 bg-gradient-to-r from-red-500 via-orange-400 to-teal-500 w-[80%]"></div>
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>940 hPa</span>
                <span>1010 hPa</span>
              </div>
            </div>

            <button className="w-full rounded-xl bg-teal-800 px-4 py-3 text-white text-[12px] font-bold tracking-widest uppercase hover:bg-teal-900 transition-colors shadow-lg flex items-center justify-center gap-2">
              <span className="text-lg">♺</span> Deploy Response
            </button>
          </div>
        </div>

        {/* Right Panel - Districts */}
        <div className="absolute right-8 top-28 pointer-events-auto w-80">
          <div className="glass-panel rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="flex justify-between items-center mb-6">
               <h2 className="text-lg font-bold text-slate-800">Districts</h2>
               <button className="text-slate-400 hover:text-slate-700">▼</button>
            </div>

            <div className="flex flex-col gap-4">
              
              {/* Puri */}
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 flex justify-between items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Puri</h3>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-blue-500 text-lg">🌧</span>
                    <span className="text-xl font-bold text-slate-900">28°</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[9px] font-bold uppercase tracking-widest">Critical</span>
                  <div className="text-[10px] text-slate-500">Humidity <span className="font-bold text-slate-800">94%</span></div>
                </div>
              </div>

              {/* Ganjam */}
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 flex justify-between items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-400"></div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Ganjam</h3>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-blue-500 text-lg">🌧</span>
                    <span className="text-xl font-bold text-slate-900">26°</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[9px] font-bold uppercase tracking-widest">High Risk</span>
                  <div className="text-[10px] text-slate-500">Humidity <span className="font-bold text-slate-800">88%</span></div>
                </div>
              </div>

              {/* Jagatsinghpur */}
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 flex justify-between items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300"></div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Jagatsinghpur</h3>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-blue-500 text-lg">🌧</span>
                    <span className="text-xl font-bold text-slate-900">29°</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest">Monitoring</span>
                  <div className="text-[10px] text-slate-500">Humidity <span className="font-bold text-slate-800">82%</span></div>
                </div>
              </div>

              {/* Balasore */}
              <div className="rounded-2xl border border-slate-200 bg-white/60 p-4 flex justify-between items-center relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300"></div>
                <div>
                  <h3 className="font-bold text-slate-800 mb-1">Balasore</h3>
                  <div className="flex items-center gap-2 text-slate-600">
                    <span className="text-orange-400 text-lg">☀</span>
                    <span className="text-xl font-bold text-slate-900">31°</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-[9px] font-bold uppercase tracking-widest">Monitoring</span>
                  <div className="text-[10px] text-slate-500">Humidity <span className="font-bold text-slate-800">76%</span></div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Scrubber Pill */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="glass-pill px-6 py-3 flex items-center gap-8 shadow-2xl border border-white/40">
            
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-bold text-teal-700 uppercase tracking-widest flex items-center gap-1">
                 <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div> Status
              </span>
              <span className="font-bold text-slate-800 text-sm">LIVE</span>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex flex-col items-center gap-2 relative">
                <div className="w-2 h-2 rounded-full bg-teal-600 z-10 border-2 border-white shadow-sm"></div>
                <span className="text-[9px] font-bold tracking-widest text-teal-800">LIVE PULSE</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 z-10"></div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400">+12H</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 z-10"></div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400">+24H</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 z-10"></div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400">+48H</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300 z-10"></div>
                <span className="text-[9px] font-bold tracking-widest text-slate-400">+72H FORECAST</span>
              </div>
              
              {/* Connecting Line */}
              <div className="absolute left-[80px] right-24 top-4 h-0.5 bg-slate-200 -z-0"></div>
            </div>

            <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white text-teal-800 shadow-md hover:bg-slate-50 transition-colors">
              ▶
            </button>

            <div className="h-8 w-px bg-slate-300"></div>

            <div className="flex flex-col gap-0.5 text-right">
              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Local Time</span>
              <span className="text-xs font-mono font-bold text-slate-800">14:45 IST</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
