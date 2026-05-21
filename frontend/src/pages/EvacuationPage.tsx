import { MapScene } from '@/components/map/MapScene'

export const EvacuationPage = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden text-slate-900 bg-[#f0f4f8]">
      {/* Background Map */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 map-overlay-gradient z-10"></div>
        <MapScene />
      </div>

      {/* SVG Dashed Lines (Decorative for prototype) */}
      <svg className="absolute inset-0 z-10 pointer-events-none w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path d="M 200 600 Q 400 500 500 700 T 800 600 T 1100 400 T 1400 300" 
              fill="transparent" 
              stroke="#0f766e" 
              strokeWidth="4" 
              strokeDasharray="12 12" 
              opacity="0.7" />
      </svg>

      {/* Overlays */}
      <div className="absolute inset-0 pointer-events-none z-20">
        
        {/* Top Left Headers */}
        <div className="absolute left-8 top-28 pointer-events-auto">
          <h1 className="text-3xl font-light text-slate-800 tracking-tight">Evacuation Status</h1>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-widest mt-1">Active Operations Grid</p>
        </div>

        {/* Left Panel - Sectors */}
        <div className="absolute left-8 top-48 flex flex-col gap-4 pointer-events-auto w-80">
          
          {/* Sector 1 */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm border border-white/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Satapada Sector</h3>
              <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-widest">Evacuating</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-red-500 w-[65%] rounded-full"></div>
            </div>
            <p className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">65% Cleared</p>
          </div>

          {/* Sector 2 */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm border border-white/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Krushnaprasad</h3>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold uppercase tracking-widest">At Risk</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-orange-500 w-[15%] rounded-full"></div>
            </div>
            <p className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">15% Cleared</p>
          </div>

          {/* Sector 3 */}
          <div className="glass-panel rounded-2xl p-5 shadow-sm border border-white/40">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-semibold text-slate-800">Brahmagiri</h3>
              <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 text-[10px] font-bold uppercase tracking-widest">Cleared</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-teal-500 w-[100%] rounded-full"></div>
            </div>
            <p className="text-right text-[10px] font-bold text-slate-500 uppercase tracking-widest">100% Cleared</p>
          </div>

        </div>

        {/* Right Top - Circular Progress */}
        <div className="absolute right-12 top-28 pointer-events-auto flex flex-col items-center">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Network Relocation</h3>
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-slate-200/50">
            {/* SVG Circle for progress */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="transparent" stroke="#0f766e" strokeWidth="8" strokeDasharray="289" strokeDashoffset="40" strokeLinecap="round" />
            </svg>
            <div className="text-center">
              <span className="block text-3xl font-light text-slate-800">124k</span>
              <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest">Relocated</span>
            </div>
          </div>
        </div>

        {/* Right Bottom - Shelter Capacity */}
        <div className="absolute right-12 top-72 flex flex-col gap-4 pointer-events-auto w-80">
          <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest pl-2">Shelter Capacity</h3>
          
          <div className="glass-panel rounded-2xl p-5 shadow-sm border border-white/40">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Puri High School</h3>
              <span className="text-sm font-bold text-red-600">88%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-[88%] rounded-full"></div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 shadow-sm border border-white/40">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Chilika College</h3>
              <span className="text-sm font-bold text-teal-700">45%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-teal-600 w-[45%] rounded-full"></div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-5 shadow-sm border border-white/40">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-semibold text-slate-800">Community Hall A</h3>
              <span className="text-sm font-bold text-red-600">98%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 w-[98%] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Bottom Nav Pill */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-auto">
          <div className="flex items-center gap-6 text-[11px] font-bold tracking-widest uppercase text-slate-500">
            <button className="hover:text-teal-700 transition-colors flex items-center gap-2">
              <span>▶</span> Live Flow
            </button>
            <div className="h-4 w-px bg-slate-300"></div>
            <button className="hover:text-slate-800 transition-colors flex items-center gap-2">
              <span>▷▷</span> +2 Hrs
            </button>
            <div className="h-4 w-px bg-slate-300"></div>
            <button className="hover:text-slate-800 transition-colors flex items-center gap-2">
              <span>⚏</span> Overlays
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
