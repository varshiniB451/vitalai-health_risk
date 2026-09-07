import { useNavigate } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="page-grid grid min-h-screen place-items-center px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal">404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-navy">Page not found</h1>
        <p className="mt-3 text-muted">That route isn&apos;t part of the VitalAI prototype. Head back to your health overview.</p>
        <Button className="mt-8" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </Button>
      </div>
    </div>
  )
}
