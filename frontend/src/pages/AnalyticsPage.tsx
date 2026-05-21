import { useNavigate } from 'react-router-dom'

export const AnalyticsPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative h-screen w-full flex text-slate-900 bg-[#f8fafc] overflow-hidden font-sans pt-20">
      
      {/* Left Sidebar */}
      <div className="w-72 bg-white/50 border-r border-slate-200 p-6 flex flex-col justify-between h-full">
        <div>
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Operational Hub</h3>
          <h2 className="text-xl font-bold text-teal-900 mb-8">Command Center</h2>

          <nav className="flex flex-col gap-1">
            <button onClick={() => navigate('/command-center')} className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-teal-800 bg-teal-50 hover:bg-teal-100 text-left transition-colors">
              <span className="text-teal-600 text-lg">🗺</span>
              <span className="text-[11px] font-bold tracking-widest">Map View</span>
            </button>
            <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-100/50 text-left transition-colors">
              <span className="text-slate-400 text-lg">⚏</span>
              <span className="text-[11px] font-bold tracking-widest">Risk Layers</span>
            </button>
            <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-100/50 text-left transition-colors">
              <span className="text-slate-400 text-lg">⌖</span>
              <span className="text-[11px] font-bold tracking-widest">Asset Tracker</span>
            </button>
            <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-100/50 text-left transition-colors">
              <span className="text-slate-400 text-lg">((•))</span>
              <span className="text-[11px] font-bold tracking-widest">Sensor Grid</span>
            </button>
            <button className="flex items-center gap-4 w-full rounded-xl px-4 py-3 text-slate-500 hover:bg-slate-100/50 text-left transition-colors">
              <span className="text-slate-400 text-lg">⚠</span>
              <span className="text-[11px] font-bold tracking-widest">Alert Logic</span>
            </button>
          </nav>
        </div>
        
        <div className="flex flex-col gap-6">
          <button className="w-full rounded-xl bg-teal-800 px-4 py-3 text-white text-[12px] font-bold tracking-widest hover:bg-teal-900 transition-colors shadow-md">
            Deploy Response
          </button>
          <div className="flex flex-col gap-3 px-4">
            <button className="flex items-center gap-3 text-slate-400 hover:text-slate-700 text-left transition-colors">
              <span className="text-sm">?</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Support</span>
            </button>
            <button className="flex items-center gap-3 text-slate-400 hover:text-slate-700 text-left transition-colors">
              <span className="text-sm">→</span>
              <span className="text-[10px] font-bold tracking-widest uppercase">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-10 pb-20">
        <div className="max-w-6xl mx-auto">
          
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <p className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">McKinsey-Grade Insight</p>
              <h1 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight leading-tight max-w-lg">
                Strategic Intelligence Hub
              </h1>
              <p className="text-sm text-slate-600 max-w-md leading-relaxed">
                Executive analytical overview for the Odisha basin. Proactive risk mitigation and infrastructural optimization roadmap.
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-8">
              <button className="flex items-center gap-2 border border-slate-200 bg-white rounded-full px-5 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm">
                <span>📅</span> Q3 FY24: Jul 01 - Sep 30 <span>▼</span>
              </button>
              <button className="flex items-center gap-2 bg-[#1e293b] text-white rounded-full px-6 py-2.5 text-xs font-bold shadow-md hover:bg-slate-900 transition-colors">
                <span>↓</span> Export Executive Summary
              </button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            
            {/* Risk Index */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                 <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Aggregate Risk Index</h3>
                 <span className="bg-teal-50 text-teal-700 px-2 py-0.5 rounded text-[10px] font-bold">+2.4% vs LY</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                 <span className="text-4xl font-bold text-slate-900 tracking-tighter">42.8</span>
                 <span className="text-sm text-slate-400 font-medium">/ 100</span>
              </div>
              {/* Bar Chart Mock */}
              <div className="flex items-end gap-1 h-10 mb-4">
                 <div className="w-full bg-slate-200 rounded-sm h-[30%]"></div>
                 <div className="w-full bg-slate-200 rounded-sm h-[40%]"></div>
                 <div className="w-full bg-slate-200 rounded-sm h-[35%]"></div>
                 <div className="w-full bg-teal-100 rounded-sm h-[50%]"></div>
                 <div className="w-full bg-teal-200 rounded-sm h-[45%]"></div>
                 <div className="w-full bg-teal-800 rounded-sm h-[70%]"></div>
              </div>
              <p className="text-[11px] text-slate-500 italic leading-snug">Moderately stable relative to monsoon forecast.</p>
            </div>

            {/* Evacuation Efficiency */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                 <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Evacuation Efficiency</h3>
                 <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded text-[10px] font-bold">Optimal</span>
              </div>
              <div className="flex items-center gap-3 mb-6">
                 <span className="text-4xl font-bold text-slate-900 tracking-tighter">94%</span>
                 <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
              </div>
              <div className="mb-4">
                 <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden relative mb-2">
                   <div className="absolute top-0 left-0 h-full bg-teal-700 w-[94%] rounded-full"></div>
                   {/* Target Marker */}
                   <div className="absolute top-0 bottom-0 left-[95%] w-0.5 bg-slate-800"></div>
                 </div>
                 <div className="flex justify-between text-[9px] text-slate-400 font-medium">
                   <span>Target: 95%</span>
                   <span>Confidence: High</span>
                 </div>
              </div>
              <p className="text-[11px] text-slate-500 italic leading-snug">Resource allocation finalized for Ganjam Sector.</p>
            </div>

            {/* AI Prediction Confidence */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-6">
                 <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">AI Prediction Confidence</h3>
                 <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded text-[10px] font-bold">Stable</span>
              </div>
              <div className="flex items-baseline gap-1 mb-6">
                 <span className="text-4xl font-bold text-slate-900 tracking-tighter">98.2%</span>
              </div>
              {/* Sparkline Mock */}
              <div className="h-12 w-full relative mb-4">
                 <svg className="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0 30 Q 20 30 30 20 T 60 25 T 80 10 T 100 15" fill="none" stroke="#0f766e" strokeWidth="3" strokeLinecap="round" strokeDasharray="90 10" />
                 </svg>
              </div>
              <p className="text-[11px] text-slate-500 italic leading-snug">Model refined via Q2 historical backtesting.</p>
            </div>

          </div>

          {/* Long-term Trends */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 mb-8 relative">
            <div className="flex justify-between items-start mb-8">
               <div>
                 <h2 className="text-xl font-bold text-slate-900 mb-1">Long-term Flood Vulnerability Trends</h2>
                 <p className="text-xs text-slate-500">Decadal analysis of water intensity and frequency (2014-2024)</p>
               </div>
               <div className="flex items-center gap-4 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-teal-800"></div> Intensity</div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-blue-600"></div> Frequency</div>
               </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-48 relative">
               <svg className="w-full h-full" viewBox="0 0 1000 200" preserveAspectRatio="none">
                 {/* Grid lines */}
                 <line x1="0" y1="50" x2="1000" y2="50" stroke="#f1f5f9" strokeWidth="1" />
                 <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeWidth="1" />
                 <line x1="0" y1="150" x2="1000" y2="150" stroke="#f1f5f9" strokeWidth="1" />
                 
                 {/* Intensity Line (Solid Area) */}
                 <path d="M0 120 C 150 110, 250 130, 400 90 C 500 60, 600 110, 750 90 C 850 80, 950 50, 1000 40 L 1000 200 L 0 200 Z" fill="rgba(15, 118, 110, 0.05)" />
                 <path d="M0 120 C 150 110, 250 130, 400 90 C 500 60, 600 110, 750 90 C 850 80, 950 50, 1000 40" fill="none" stroke="#0f766e" strokeWidth="3" opacity="0.4" />
                 
                 {/* Frequency Line (Dashed) */}
                 <path d="M0 160 C 200 150, 300 180, 450 140 C 550 110, 650 130, 800 110 C 900 100, 950 70, 1000 60" fill="none" stroke="#0284c7" strokeWidth="2" strokeDasharray="6 6" opacity="0.3" />
               </svg>
               
               {/* Forecast Overlay Card */}
               <div className="absolute right-8 bottom-8 bg-white rounded-xl shadow-lg border border-slate-100 p-4 w-56">
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Forecast Horizon</p>
                 <h3 className="text-lg font-bold text-teal-800 mb-1">+12.4% Intensity Peak</h3>
                 <p className="text-[10px] text-slate-500 font-medium">Aug - Sept 2024 (Projected)</p>
               </div>
            </div>
          </div>

          {/* Bottom Grid: Matrix & Insights */}
          <div className="grid grid-cols-3 gap-6">
             
             {/* Left: District Vulnerability Matrix */}
             <div className="col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col justify-between">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <h2 className="text-lg font-bold text-slate-900 mb-1">District Vulnerability Matrix</h2>
                     <p className="text-[11px] text-slate-500">Infrastructure resilience vs. Terrain elevation</p>
                   </div>
                   <div className="flex items-center gap-2">
                     <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mr-1">Risk Level:</span>
                     <div className="w-2.5 h-2.5 rounded bg-teal-100"></div>
                     <div className="w-2.5 h-2.5 rounded bg-teal-300"></div>
                     <div className="w-2.5 h-2.5 rounded bg-teal-600"></div>
                     <div className="w-2.5 h-2.5 rounded bg-teal-900"></div>
                   </div>
                </div>

                <div className="grid grid-cols-6 gap-3 mb-8">
                   {/* Row 1 */}
                   <div className="bg-[#e2e8f0]/60 rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Puri</span>
                     <span className="text-[9px] font-medium text-slate-500 mt-1">L-1</span>
                   </div>
                   <div className="bg-[#337a7b] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square text-white shadow-md transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold uppercase tracking-widest">Balasore</span>
                     <span className="text-[9px] font-medium text-teal-100 mt-1">H-4</span>
                   </div>
                   <div className="bg-[#83b0b0] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square text-white shadow-md transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold uppercase tracking-widest">Ganjam</span>
                     <span className="text-[9px] font-medium text-teal-100 mt-1">M-2</span>
                   </div>
                   <div className="bg-[#246263] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square text-white shadow-md transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold uppercase tracking-widest">Jajpur</span>
                     <span className="text-[9px] font-medium text-teal-100 mt-1">H-5</span>
                   </div>
                   <div className="bg-[#cbd5e1]/60 rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Cuttack</span>
                     <span className="text-[9px] font-medium text-slate-500 mt-1">L-2</span>
                   </div>
                   <div className="bg-[#6b999a] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square text-white shadow-md transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold uppercase tracking-widest">Bhadrak</span>
                     <span className="text-[9px] font-medium text-teal-100 mt-1">M-3</span>
                   </div>

                   {/* Row 2 */}
                   <div className="bg-[#e2e8f0]/60 rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Khordha</span>
                     <span className="text-[9px] font-medium text-slate-500 mt-1">L-1</span>
                   </div>
                   <div className="bg-[#f1f5f9] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square border border-slate-100 transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Angul</span>
                     <span className="text-[9px] font-medium text-slate-400 mt-1">L-0</span>
                   </div>
                   <div className="bg-[#0f4a4a] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square text-white shadow-lg border-2 border-teal-300 transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold uppercase tracking-widest">Kendrapara</span>
                     <span className="text-[9px] font-bold text-teal-200 mt-1">H-MAX</span>
                   </div>
                   <div className="bg-[#94a3b8]/50 rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Sambalpur</span>
                     <span className="text-[9px] font-medium text-slate-600 mt-1">L-3</span>
                   </div>
                   <div className="bg-[#e2e8f0]/60 rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold text-slate-700 uppercase tracking-widest">Nayagarh</span>
                     <span className="text-[9px] font-medium text-slate-500 mt-1">L-1</span>
                   </div>
                   <div className="bg-[#f1f5f9] rounded-xl p-3 flex flex-col items-center justify-center text-center aspect-square border border-slate-100 transition-transform hover:scale-105">
                     <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Boudh</span>
                     <span className="text-[9px] font-medium text-slate-400 mt-1">L-0</span>
                   </div>
                </div>

                <div className="flex justify-between items-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-slate-200 rounded-lg flex items-center justify-center">
                        <span className="text-slate-400">🗺</span>
                     </div>
                     <p className="text-[11px] text-slate-600 font-medium max-w-xs">Map shows calculated risk density based on ISRO 2024 topographical data.</p>
                  </div>
                  <button className="text-[11px] font-bold text-teal-700 hover:text-teal-900 transition-colors uppercase tracking-widest flex items-center gap-1">
                    Deep Dive into Districts <span>→</span>
                  </button>
                </div>
             </div>

             {/* Right: Climate Resilience Insights */}
             <div className="col-span-1 bg-white rounded-3xl p-8 shadow-sm border-2 border-teal-600/20 flex flex-col">
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-xl text-teal-800">✨</span>
                  <h2 className="text-xl font-bold text-slate-900 leading-tight">Climate Resilience Insights</h2>
                </div>

                <div className="flex flex-col gap-4 flex-1">
                  
                  {/* Insight 1 */}
                  <div className="bg-teal-50/50 rounded-2xl p-4 border border-teal-100">
                    <p className="text-[9px] font-bold text-teal-700 uppercase tracking-widest mb-2">Priority Alpha</p>
                    <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">Infrastructural reinforcement recommended for Kendrapara sector C-12.</p>
                    <p className="text-[11px] text-slate-500 leading-snug">Dike structural integrity decreased by 12% following recent tidal surge.</p>
                  </div>

                  {/* Insight 2 */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Logistics Beta</p>
                    <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">Pre-positioning of medical supplies in Balasore clusters.</p>
                    <p className="text-[11px] text-slate-500 leading-snug">Historical trends suggest 88% probability of route blockade by Aug 22.</p>
                  </div>

                  {/* Insight 3 */}
                  <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                    <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-2">Policy Gamma</p>
                    <p className="text-sm font-semibold text-slate-800 mb-2 leading-snug">Update catchment area zoning for Mahanadi delta region.</p>
                    <p className="text-[11px] text-slate-500 leading-snug">Urban expansion is encroaching on primary drainage veins.</p>
                  </div>
                </div>

                <button className="w-full mt-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-teal-800 text-[11px] font-bold tracking-widest uppercase hover:bg-teal-100 transition-colors">
                  View Detailed Strategic Plan
                </button>
             </div>

          </div>
        </div>
      </div>

    </div>
  )
}
