import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'
import { useAuth } from '../context/AuthContext'
import { AuthShell } from './Login'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirm: '',
    agree: false,
  })
  const [error, setError] = useState('')

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.fullName || !form.email || !form.password) {
      setError('Please complete all fields.')
      return
    }
    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (!form.agree) {
      setError('Please agree to the Terms & Privacy Policy.')
      return
    }
    try {
      await register({ fullName: form.fullName, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      setError(err.detail || err.message || 'Unable to create account.')
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start with a personal health twin in under a minute."
      footer={
        <p>
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal">
            Sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <Labeled id="fullName" label="Full name">
          <input id="fullName" className="input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} required />
        </Labeled>
        <Labeled id="reg-email" label="Email">
          <input id="reg-email" type="email" className="input" value={form.email} onChange={(e) => update('email', e.target.value)} required />
        </Labeled>
        <Labeled id="reg-pass" label="Password">
          <input id="reg-pass" type="password" className="input" value={form.password} onChange={(e) => update('password', e.target.value)} required />
        </Labeled>
        <Labeled id="confirm" label="Confirm password">
          <input id="confirm" type="password" className="input" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} required />
        </Labeled>
        <label className="flex items-start gap-2 text-sm text-muted">
          <input type="checkbox" className="mt-1" checked={form.agree} onChange={(e) => update('agree', e.target.checked)} />
          I agree to the Terms & Privacy Policy
        </label>
        {error ? <p className="text-sm text-alert">{error}</p> : null}
        <Button type="submit" className="w-full" size="lg">
          Create Account
        </Button>
      </form>
    </AuthShell>
  )
}

function Labeled({ id, label, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
      </label>
      {children}
    </div>
  )
}
