import { useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

const titles = {
  '/dashboard': 'Dashboard',
  '/health-profile': 'Health Profile',
  '/predict': 'Risk Prediction',
  '/explain': 'Explain My Risk',
  '/simulate': 'What-if Simulator',
  '/prevent': 'Prevention Plan',
  '/track': 'Track Progress',
}

export default function AppLayout() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()
  const [open, setOpen] = useState(false)

  if (loading) {
    return <div className="grid min-h-screen place-items-center bg-canvas text-sm text-muted">Checking your session...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-canvas">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="lg:pl-[272px]">
        <TopBar title={titles[location.pathname] || 'VitalAI'} onMenu={() => setOpen(true)} />
        <main className="page-grid px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
