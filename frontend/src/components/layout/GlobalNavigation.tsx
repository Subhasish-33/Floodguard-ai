import { NavLink, useLocation } from 'react-router-dom'
import { Bell, Settings } from 'lucide-react'
import { motion } from 'framer-motion'

export const GlobalNavigation = () => {
  const location = useLocation()

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center px-4 pt-4">
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="pointer-events-auto flex w-full max-w-7xl items-center justify-between glass-pill px-6 py-3"
      >
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-teal-700">
            <path d="M10 0C10 0 0 8 0 16C0 21.5228 4.47715 26 10 26C15.5228 26 20 21.5228 20 16C20 8 10 0 10 0Z" fill="currentColor" fillOpacity="0.8"/>
            <circle cx="10" cy="16" r="4" fill="white"/>
          </svg>
          <span className="text-[17px] font-bold tracking-tight text-teal-800">
            FloodGuard AI
          </span>
        </div>

        {/* Central Links */}
        <div className="flex items-center gap-8">
          <NavLink 
            to="/command-center" 
            className={({ isActive }) => `relative text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-teal-800' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {({ isActive }) => (
              <>
                Intelligence
                {isActive && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
          <NavLink 
            to="/simulations" 
            className={({ isActive }) => `relative text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-teal-800' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {({ isActive }) => (
              <>
                Simulations
                {isActive && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
          <NavLink 
            to="/archive" 
            className={({ isActive }) => `relative text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-teal-800' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {({ isActive }) => (
              <>
                Archive
                {isActive && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
          <NavLink 
            to="/network" 
            className={({ isActive }) => `relative text-[11px] font-bold uppercase tracking-widest transition-colors ${isActive ? 'text-teal-800' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {({ isActive }) => (
              <>
                Network
                {isActive && (
                  <motion.div layoutId="nav-underline" className="absolute -bottom-1 left-0 right-0 h-0.5 bg-teal-600 rounded-full" />
                )}
              </>
            )}
          </NavLink>
        </div>

        {/* Dynamic Context (Center-Right) */}
        <div className="flex items-center gap-4">
          {location.pathname === '/' && (
             <div className="flex items-center gap-2 rounded-full bg-white/40 px-3 py-1 text-[10px] font-semibold text-slate-700 shadow-sm border border-white/50">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
               </span>
               System Operational
             </div>
          )}
          {location.pathname === '/command-center' && (
             <div className="flex items-center gap-4 rounded-full bg-white/40 px-4 py-1.5 shadow-sm border border-white/50">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase text-slate-700">Live Pulse</span>
                </div>
                <div className="h-3 w-px bg-slate-300"></div>
                <div className="text-[10px] font-bold text-slate-700">☀️ 28°C / 85% H</div>
             </div>
          )}
          {location.pathname === '/archive' && (
             <div className="flex items-center gap-2 rounded-full bg-amber-500/20 px-3 py-1.5 shadow-sm border border-amber-500/30">
               <span className="h-2 w-2 rounded-full bg-amber-500"></span>
               <span className="text-[10px] font-bold uppercase text-amber-700 tracking-widest">Historical Analysis: Cyclone Fani</span>
             </div>
          )}
        </div>

        {/* Profile / Actions */}
        <div className="flex items-center gap-4">
          {location.pathname === '/command-center' && (
            <div className="flex items-center gap-2 mr-4">
              <div className="w-8 h-4 bg-slate-300 rounded-full relative cursor-pointer">
                <div className="absolute left-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Sim Mode</span>
            </div>
          )}
          <button className="text-slate-500 hover:text-slate-900 transition-colors">
            <Bell size={18} />
          </button>
          <button className="text-slate-500 hover:text-slate-900 transition-colors">
            <Settings size={18} />
          </button>
          <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-slate-700 to-slate-900 shadow-sm border border-white flex items-center justify-center overflow-hidden">
             {/* Mock Avatar */}
             <span className="text-[10px] text-white">OP</span>
          </div>
        </div>
      </motion.nav>
    </div>
  )
}
