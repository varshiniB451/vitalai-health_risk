import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login, enterLocalSession } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Enter email and password to continue.')
      return
    }
    try {
      await login({ email, password, fullName: 'Alex Rivera' })
      navigate(location.state?.from || '/dashboard', { replace: true })
    } catch (err) {
      if (err?.status === 401) {
        setError('Invalid email or password. Create an account first if you are new to VitalAI.')
      } else if (err?.status === 0) {
        setError(err.detail)
      } else {
        setError(err.detail || err.message || 'Unable to sign in.')
      }
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your VitalAI health twin."
      footer={
        <p>
          New here?{' '}
          <Link to="/register" className="font-semibold text-teal">
            Create account
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Field label="Email" id="email">
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            required
          />
        </Field>
        <Field label="Password" id="password">
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            required
          />
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <button type="button" className="font-medium text-teal">
            Forgot password
          </button>
        </div>
        {error ? <p className="text-sm text-alert">{error}</p> : null}
        <Button type="submit" className="w-full" size="lg">
          Sign In
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={() => {
            enterLocalSession({ email: 'alex@gmail.com', fullName: 'Alex Rivera' })
            navigate('/dashboard')
          }}
        >
          Continue with Google
        </Button>
        <p className="text-center text-xs text-muted">Sign in uses the VitalAI API on this same origin. Google is UI-only.</p>
      </form>
    </AuthShell>
  )
}

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="page-grid grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-2 font-extrabold text-navy">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-navy text-white">V</span>
          VitalAI
        </Link>
        <div className="rounded-[1.75rem] border border-line bg-white p-7 shadow-[var(--shadow-card)]">
          <h1 className="text-2xl font-extrabold text-navy">{title}</h1>
          <p className="mt-1 text-sm text-muted">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
        <p className="mt-5 text-center text-sm text-muted">{footer}</p>
      </div>
      <style>{`
        .input { width: 100%; height: 2.75rem; border-radius: 0.75rem; border: 1px solid var(--color-line); padding: 0 0.9rem; outline: none; }
        .input:focus { border-color: var(--color-teal); box-shadow: 0 0 0 3px rgba(13,155,138,.15); }
      `}</style>
    </div>
  )
}

function Field({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      {children}
    </div>
  )
}
