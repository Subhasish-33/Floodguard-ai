import { AnimatePresence, motion } from 'framer-motion'
import { CommandCenterLayout } from '@/components/layout/CommandCenterLayout'
import { LoadingScreen } from '@/components/panels/LoadingScreen'
import { useDatasetLoader } from '@/hooks/useDatasetLoader'
import { useDisasterStore } from '@/store/useDisasterStore'
import { LandingPage } from '@/pages/LandingPage'
import { useState } from 'react'

export const App = () => {
  useDatasetLoader()
  const isLoadingData = useDisasterStore((state) => state.isLoadingData)
  const [route, setRoute] = useState<'landing' | 'app'>('landing')

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] text-slate-900 font-sans">
      <AnimatePresence>
        {isLoadingData && (
          <motion.div
            key="loading"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.6 } }}
            className="fixed inset-0 z-50"
          >
            <LoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {route === 'landing' ? (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <LandingPage onLaunch={() => setRoute('app')} />
          </motion.div>
        ) : (
          <motion.div
            key="app"
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <CommandCenterLayout />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
