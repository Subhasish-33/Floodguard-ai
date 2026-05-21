import { AnimatePresence, motion } from 'framer-motion'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { CommandCenterLayout } from '@/components/layout/CommandCenterLayout'
import { GlobalNavigation } from '@/components/layout/GlobalNavigation'
import { LoadingScreen } from '@/components/panels/LoadingScreen'
import { useDatasetLoader } from '@/hooks/useDatasetLoader'
import { useDisasterStore } from '@/store/useDisasterStore'
import { LandingPage } from '@/pages/LandingPage'
import { ArchivePage } from '@/pages/ArchivePage'
import { DistrictIntelligence } from '@/pages/DistrictIntelligence'

const AppRoutes = () => {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <LandingPage />
            </motion.div>
          } 
        />
        <Route 
          path="/command-center" 
          element={
            <motion.div
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <CommandCenterLayout />
            </motion.div>
          } 
        />
        <Route 
          path="/archive" 
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <ArchivePage />
            </motion.div>
          } 
        />
        <Route 
          path="/district/:id" 
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <DistrictIntelligence />
            </motion.div>
          } 
        />
        <Route 
          path="/simulations" 
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <div className="flex h-screen items-center justify-center">Simulations Page (WIP)</div>
            </motion.div>
          } 
        />
        <Route 
          path="/network" 
          element={
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <div className="flex h-screen items-center justify-center">Network Page (WIP)</div>
            </motion.div>
          } 
        />
      </Routes>
    </AnimatePresence>
  )
}

export const App = () => {
  useDatasetLoader()
  const isLoadingData = useDisasterStore((state) => state.isLoadingData)

  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-[var(--color-fg-base)] text-slate-900 font-sans overflow-hidden">
        <GlobalNavigation />
        
        <AnimatePresence>
          {isLoadingData && (
            <motion.div
              key="loading"
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6 } }}
              className="fixed inset-0 z-[100]"
            >
              <LoadingScreen />
            </motion.div>
          )}
        </AnimatePresence>

        <AppRoutes />
      </div>
    </BrowserRouter>
  )
}
