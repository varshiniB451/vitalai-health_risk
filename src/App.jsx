import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { HealthProvider } from './context/HealthContext'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import HealthProfile from './pages/HealthProfile'
import Predict from './pages/Predict'
import Explain from './pages/Explain'
import Simulate from './pages/Simulate'
import Prevent from './pages/Prevent'
import Track from './pages/Track'
import Settings from './pages/Settings'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <HealthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<AppLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/health-profile" element={<HealthProfile />} />
              <Route path="/predict" element={<Predict />} />
              <Route path="/explain" element={<Explain />} />
              <Route path="/simulate" element={<Simulate />} />
              <Route path="/prevent" element={<Prevent />} />
              <Route path="/track" element={<Track />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </HealthProvider>
    </AuthProvider>
  )
}
