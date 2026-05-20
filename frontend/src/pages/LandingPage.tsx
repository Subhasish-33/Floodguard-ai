import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Activity, Map, Navigation, Radio, Wind } from 'lucide-react'

const features = [
  { icon: Map, title: 'Terrain Intelligence', desc: 'Millimeter-accurate 3D digital twin of Odisha\'s topology.' },
  { icon: Activity, title: 'Flood Prediction', desc: 'Real-time cellular automata simulating hydraulic propagation.' },
  { icon: Navigation, title: 'AI Routing', desc: 'Dynamic A* pathfinding for safe evacuation corridors.' },
  { icon: Radio, title: 'Drone Operations', desc: 'Live UAV telemetry and automated search grids.' },
  { icon: Wind, title: 'Live Telemetry', desc: 'Ingesting IMD radar and local weather station data.' }
]

export const LandingPage = ({ onLaunch }: { onLaunch: () => void }) => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const y = useTransform(scrollY, [0, 300], [0, -50])

  return (
    <div className="relative min-h-[200vh] w-full bg-[#f8fafc] text-slate-900 overflow-x-hidden">
      
      {/* Immersive Hero */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center px-4">
        {/* Subtle radial gradient background to simulate atmospheric fog */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.8)_0%,#f8fafc_60%)] z-10" />
        
        <motion.div 
          style={{ opacity, y }}
          className="relative z-20 flex flex-col items-center text-center max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-block rounded-full bg-slate-900/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-500 mb-6 border border-slate-200">
              FloodGuard AI • Phase 4
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-[1.1]"
          >
            AI Disaster Intelligence <br className="hidden md:block"/> for a Resilient Odisha
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-xl text-slate-500 max-w-2xl font-light"
          >
            Minimal, elegant, human-centered. A predictive geospatial operating system designed to safeguard millions through actionable climatic insights.
          </motion.p>

          <motion.button
            onClick={onLaunch}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-12 flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-sm font-medium text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-colors hover:bg-slate-800"
          >
            Launch Command Center
            <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-12 z-20 text-slate-400"
        >
          <div className="w-[1px] h-12 bg-gradient-to-b from-slate-300 to-transparent mx-auto" />
        </motion.div>
      </section>

      {/* Capabilities Storytelling */}
      <section className="relative z-20 bg-white py-32 px-4 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-slate-900">
              Operational Clarity. <br /> Computational Precision.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="group p-8 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="h-12 w-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-900 shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-medium text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-500 leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Transition */}
      <section className="relative z-20 bg-slate-900 py-32 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-semibold tracking-tight text-white mb-8">
            Experience the Engine
          </h2>
          <button
            onClick={onLaunch}
            className="flex items-center gap-2 mx-auto rounded-full bg-white px-8 py-4 text-sm font-medium text-slate-900 shadow-lg transition-colors hover:bg-slate-100"
          >
            Enter Command Center
            <ArrowRight size={18} />
          </button>
        </motion.div>
      </section>

    </div>
  )
}
