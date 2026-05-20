import { motion } from 'framer-motion'

export const LoadingScreen = () => (
  <div className="flex h-full items-center justify-center bg-slate-950">
    <div className="text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        className="mx-auto mb-5 h-14 w-14 rounded-full border-2 border-cyan-400/50 border-t-cyan-300"
      />
      <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Booting Odisha Digital Twin</p>
      <p className="mt-2 text-sm text-slate-400">Ingesting terrain grid, district boundaries, and AI risk layers...</p>
    </div>
  </div>
)
