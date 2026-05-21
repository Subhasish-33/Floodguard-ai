import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Navigation } from 'lucide-react'

export const LandingPage = () => {
  const navigate = useNavigate()

  return (
    <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden bg-white custom-scrollbar">
      {/* Hero Section */}
      <section className="relative flex h-[90vh] w-full flex-col items-center justify-center overflow-hidden">
        {/* Background Image & Gradient Overlay */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542263158-958852e96030?q=80&w=2560&auto=format&fit=crop")' }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#e0e7ff]/30 via-transparent to-white"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center px-4 text-center mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900 md:text-7xl lg:text-8xl"
            style={{ lineHeight: 1.1 }}
          >
            AI Disaster Intelligence for a Resilient Odisha
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mt-6 max-w-2xl text-lg font-medium text-slate-700 md:text-xl"
          >
            Predictive hydro-analytics and real-time situational awareness. Empowering command centers with the clarity needed before the storm arrives.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="mt-10"
          >
            <button 
              onClick={() => navigate('/command-center')}
              className="group relative flex items-center gap-3 rounded-xl bg-teal-700 px-8 py-4 font-semibold text-white shadow-lg transition-all hover:bg-teal-800 hover:shadow-xl hover:shadow-teal-900/20 active:scale-95"
            >
              <Navigation size={20} className="transition-transform group-hover:translate-x-1" />
              Initialize Command
            </button>
          </motion.div>
        </div>
      </section>

      {/* Lifecycle Section */}
      <section className="relative z-20 flex w-full flex-col items-center bg-white px-6 py-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">The Lifecycle of Resilience</h2>
          <p className="mt-4 text-slate-500 max-w-lg mx-auto">
            From early atmospheric signals to coordinated on-ground response, intelligence flows seamlessly.
          </p>
        </div>

        <div className="mt-16 grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
          {/* Card 1 */}
          <div className="flex flex-col rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Detection</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Atmospheric modeling showing pressure differentials over the Bay of Bengal, predicting cyclonic formation 72 hours in advance.
            </p>
            <div className="mt-8 h-32 w-full rounded-xl bg-gradient-to-br from-blue-200 to-teal-200 opacity-60"></div>
          </div>

          {/* Card 2 */}
          <div className="flex flex-col rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Escalation</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Dynamic inundation mapping with glowing flow rate indicators projecting flood paths across vulnerable districts.
            </p>
            <div className="mt-8 h-32 w-full rounded-xl bg-gradient-to-br from-slate-300 to-slate-400 opacity-60"></div>
          </div>

          {/* Card 3 */}
          <div className="flex flex-col rounded-3xl border border-slate-100 bg-slate-50 p-8 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-100 text-teal-600">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900">Coordination</h3>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              AI-optimized evacuation routing and drone dispatch pulses ensuring safe passage before infrastructure compromise.
            </p>
            <div className="mt-8 h-32 w-full rounded-xl bg-gradient-to-br from-teal-50 to-slate-100 opacity-60 flex items-center justify-center">
               <div className="h-10 w-10 rounded-full bg-white shadow-sm border flex items-center justify-center text-teal-700">
                  <Navigation size={16} />
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Preview Section */}
      <section className="relative z-20 flex w-full items-center justify-center bg-[#f8fafc] px-6 py-24">
        <div className="flex w-full max-w-6xl flex-col items-center justify-between gap-12 md:flex-row">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Command Center Intelligence</h2>
            <p className="mt-4 text-slate-600 leading-relaxed">
              Step into the operational hub. Experience the map-first interface designed for clarity under pressure.
            </p>
            <button 
              onClick={() => navigate('/command-center')}
              className="mt-8 group flex items-center gap-2 rounded-lg bg-slate-100 px-6 py-3 font-semibold text-slate-900 transition-colors hover:bg-slate-200"
            >
              Enter Operational Mode
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </button>
          </div>
          <div className="w-full max-w-xl rounded-2xl bg-slate-800 p-2 shadow-2xl">
            {/* Mock Monitor placeholder */}
            <div className="aspect-video w-full rounded-xl bg-slate-900 border border-slate-700 overflow-hidden relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 to-slate-800 opacity-50"></div>
               <div className="absolute inset-0 flex items-center justify-center text-slate-500 font-mono text-xs">System Preview</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
