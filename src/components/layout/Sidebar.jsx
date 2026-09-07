import { NavLink,useNavigate} from 'react-router-dom'
import {
  Activity,
  Brain,
  FlaskConical,
  LayoutDashboard,
  LineChart,
  Settings,
  Shield,
  SlidersHorizontal,
  UserRound,
  X,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/health-profile', label: 'Health Profile', icon: UserRound },
  { to: '/predict', label: 'Risk Prediction', icon: Activity },
  { to: '/explain', label: 'Explain My Risk', icon: Brain },
  { to: '/simulate', label: 'What-if Simulator', icon: SlidersHorizontal },
  { to: '/prevent', label: 'Prevention Plan', icon: Shield },
  { to: '/track', label: 'Track Progress', icon: LineChart },
]

export default function Sidebar({ open, onClose }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-navy/40 lg:hidden"
          onClick={onClose}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-white/10 bg-navy text-white transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-teal text-sm font-extrabold">V</span>
            <div>
              <p className="text-base font-extrabold tracking-tight">VitalAI</p>
              <p className="text-[11px] text-white/50">Health digital twin</p>
            </div>
          </div>
          <button type="button" className="rounded-lg p-1 text-white/70 lg:hidden" onClick={onClose} aria-label="Close sidebar">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 scrollbar-thin" aria-label="Main">
          {links.map((link) => {
            const Icon = link.icon
            return (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                    isActive ? 'bg-white/10 text-white' : 'text-white/65 hover:bg-white/5 hover:text-white'
                  }`
                }
              >
                <Icon size={18} aria-hidden="true" />
                {link.label}
              </NavLink>
            )
          })}
        </nav>

        <div className="border-t border-white/10 p-4">
          <button
          type="button"
          onClick={() => {
            navigate('/settings')
            onClose()
          }}
          className="mb-3 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-white/60 hover:bg-white/5 hover:text-white">
            <Settings size={18} aria-hidden="true" />
            Settings
          </button>
          <div className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-teal/30 text-sm font-bold">
              {(user?.fullName || 'A').slice(0, 1)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user?.fullName || 'Alex Rivera'}</p>
              <p className="truncate text-xs text-white/50">{user?.email || 'alex@vitalai.demo'}</p>
            </div>
            <FlaskConical size={14} className="ml-auto text-teal-500" aria-hidden="true" />
          </div>
        </div>
      </aside>
    </>
  )
}
