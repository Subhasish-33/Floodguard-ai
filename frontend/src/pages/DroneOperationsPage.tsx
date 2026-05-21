import { MapScene } from '@/components/map/MapScene'

export const DroneOperationsPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden text-slate-900 bg-[#f0f4f8]">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 map-overlay-gradient z-10"></div>
        <MapScene />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20 flex gap-6 p-8 pt-24">
        
        {/* Left Sidebar */}
        <div className="w-64 glass-panel-heavy rounded-3xl flex flex-col justify-between p-6 pointer-events-auto h-full border border-white/40">
          <div>
            <h1 className="text-xl font-bold text-teal-900">FloodGuard AI</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1 mb-10">Operational Hub</p>
            
            <nav className="flex flex-col gap-2">
              <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
                <span className="text-slate-400 text-lg">🗺</span>
                <span className="text-[11px] font-bold tracking-widest">Map View</span>
              </button>
              <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
                <span className="text-slate-400 text-lg">⚏</span>
                <span className="text-[11px] font-bold tracking-widest">Risk Layers</span>
              </button>
              <button className="flex items-center gap-4 w-full rounded-xl bg-teal-800/10 px-4 py-3 text-teal-800 text-left transition-colors">
                <span className="text-teal-600 text-lg">⌖</span>
                <span className="text-[11px] font-bold tracking-widest">Asset Tracker</span>
              </button>
              <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
                <span className="text-slate-400 text-lg">((•))</span>
                <span className="text-[11px] font-bold tracking-widest">Sensor Grid</span>
              </button>
              <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-600 hover:bg-slate-100/50 text-left transition-colors">
                <span className="text-slate-400 text-lg">⚠</span>
                <span className="text-[11px] font-bold tracking-widest">Alert Logic</span>
              </button>
            </nav>
          </div>
          
          <div className="flex flex-col gap-6">
            <button className="w-full rounded-xl bg-teal-700 px-4 py-3 text-white text-[12px] font-bold tracking-widest hover:bg-teal-800 transition-colors shadow-lg">
              Deploy Response
            </button>
            <div className="flex flex-col gap-3 px-4">
              <button className="flex items-center gap-3 text-slate-500 hover:text-slate-800 text-left transition-colors">
                <span className="text-sm">?</span>
                <span className="text-[10px] font-bold tracking-widest uppercase">Support</span>
              </button>
              <button className="flex items-center gap-3 text-slate-500 hover:text-slate-800 text-left transition-colors">
                <span className="text-sm">→</span>
                <span className="text-[10px] font-bold tracking-widest uppercase">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Center Panel - UAV Fleet */}
        <div className="w-[22rem] glass-panel rounded-3xl p-6 pointer-events-auto border border-white/40 h-[calc(100vh-140px)] overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-bold text-slate-800">Live UAV Fleet</h2>
            <span className="px-2 py-1 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold uppercase tracking-widest">3 Active</span>
          </div>

          <div className="flex flex-col gap-4">
            
            {/* UAV 1 */}
            <div className="glass-panel-heavy rounded-2xl p-5 shadow-sm border-t border-white flex flex-col gap-4 relative">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-teal-500"></div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>✈</span> Alpha-1
              </h3>
              <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1"><span>🔋</span> 82%</div>
                <div className="flex items-center gap-1"><span>📶</span> Strong</div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">
                Task: <span className="text-slate-700">Thermal Scanning</span>
              </p>
            </div>

            {/* UAV 2 - Active */}
            <div className="bg-teal-50/90 rounded-2xl p-5 shadow-sm border border-teal-200 flex flex-col gap-4 relative">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-teal-500"></div>
              <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
                <span>✈</span> Bravo-2
              </h3>
              <div className="flex items-center gap-6 text-xs font-semibold text-teal-800">
                <div className="flex items-center gap-1"><span>🔋</span> 34%</div>
                <div className="flex items-center gap-1"><span>📶</span> Strong</div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-700 mt-2">
                Task: <span className="text-teal-900">Route Patrol</span>
              </p>
            </div>

            {/* UAV 3 - Weak */}
            <div className="glass-panel-heavy rounded-2xl p-5 shadow-sm border-t border-white flex flex-col gap-4 relative">
              <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-orange-400"></div>
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span>✈</span> Charlie-4
              </h3>
              <div className="flex items-center gap-6 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-1"><span>🔋</span> 98%</div>
                <div className="flex items-center gap-1"><span>📶</span> Weak</div>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-2">
                Task: <span className="text-slate-700">Returning to Base</span>
              </p>
            </div>

          </div>
        </div>

        {/* Right Panels - Camera Feeds */}
        <div className="flex-1 flex flex-col gap-6 pointer-events-auto h-[calc(100vh-140px)]">
          
          {/* Feed 1 */}
          <div className="flex-1 rounded-3xl border-2 border-white/50 overflow-hidden relative shadow-lg bg-slate-900">
            {/* Image Placeholder representing FPV */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-slate-900 opacity-80 mix-blend-overlay"></div>
            <img src="/data/drone_fpv_mockup.jpg" alt="FPV Feed" className="w-full h-full object-cover opacity-60" onError={(e) => { e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='%231e293b'/%3E%3C/svg%3E"; }} />
            
            {/* Feed Overlays */}
            <div className="absolute top-4 left-4 glass-pill px-3 py-1 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[9px] font-bold tracking-widest text-white uppercase">Live FPV</span>
            </div>
            
            <div className="absolute top-4 right-4 text-right">
              <div className="text-[10px] font-mono text-white/90">ALT: 124m</div>
              <div className="text-[10px] font-mono text-white/90">TARGET TRACKING</div>
            </div>

            <div className="absolute bottom-4 left-4 text-white font-mono text-xs shadow-sm">
              Bravo-2
            </div>
            
            <div className="absolute bottom-4 right-4 bg-teal-600/80 backdrop-blur-sm px-2 py-1 rounded text-white font-mono text-xs">
              Sector 7G
            </div>

            {/* FPV Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-32 h-32 border border-white/50 relative">
                <div className="absolute top-1/2 left-1/2 w-2 h-2 border border-green-400 -translate-x-1/2 -translate-y-1/2"></div>
              </div>
            </div>
          </div>

          {/* Feed 2 */}
          <div className="flex-1 rounded-3xl border-2 border-teal-500/30 overflow-hidden relative shadow-lg bg-slate-900">
            {/* Image Placeholder representing Thermal */}
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900 via-red-900 to-orange-500 opacity-60 mix-blend-color-burn"></div>
            <img src="/data/drone_thermal_mockup.jpg" alt="Thermal Feed" className="w-full h-full object-cover opacity-80 grayscale contrast-150" style={{ filter: 'sepia(1) hue-rotate(250deg) saturate(4)' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />

            {/* Feed Overlays */}
            <div className="absolute top-4 left-4 glass-pill border border-red-500/50 bg-black/40 px-3 py-1 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
              <span className="text-[9px] font-bold tracking-widest text-white uppercase">Thermal</span>
            </div>
            
            <div className="absolute top-4 right-4 text-right">
              <div className="text-[10px] font-mono text-white/90">ALT: 85m</div>
              <div className="text-[10px] font-mono text-white/90">TEMP MAX: 38°C</div>
            </div>

            <div className="absolute bottom-4 left-4 text-white font-mono text-xs shadow-sm">
              Alpha-1
            </div>

            <div className="absolute bottom-4 right-4 bg-red-900/80 backdrop-blur-sm px-2 py-1 rounded text-white font-mono text-xs">
              Breach Zone
            </div>
            
            {/* Thermal Reticle */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-50">
              <div className="w-16 h-16 border-t-2 border-l-2 border-white/70 absolute top-1/3 left-1/3"></div>
              <div className="w-16 h-16 border-b-2 border-r-2 border-white/70 absolute bottom-1/3 right-1/3"></div>
              <div className="w-4 h-4 border border-white/50 flex items-center justify-center">
                 <div className="w-1 h-1 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
