import { useNavigate } from 'react-router-dom'
import { ArrowRight, FlaskConical, Shield, SlidersHorizontal } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import HealthScore from '../components/dashboard/HealthScore'
import RiskOverview from '../components/dashboard/RiskOverview'
import HealthMetrics from '../components/dashboard/HealthMetrics'
import AIInsight from '../components/dashboard/AIInsight'
import Recommendations from '../components/dashboard/Recommendations'
import HealthTrendChart from '../components/charts/HealthTrendChart'
import { useAuth } from '../context/AuthContext'
import { useHealth } from '../context/HealthContext'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard() {
  const { user } = useAuth()
  const { healthScore, risks, profile, bmi, weekHealthScores } = useHealth()
  const navigate = useNavigate()
  const first = (user?.fullName || 'Alex').split(' ')[0]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-navy">
            {greeting()}, {first}
          </h2>
          <p className="mt-1 text-muted">Here&apos;s your health overview.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => navigate('/predict')}>
            Check My Risk <ArrowRight size={16} />
          </Button>
          <Button variant="ghost" onClick={() => navigate('/simulate')}>
            <SlidersHorizontal size={16} /> Simulate Changes
          </Button>
          <Button variant="soft" onClick={() => navigate('/prevent')}>
            <Shield size={16} /> View Prevention Plan
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <HealthScore score={healthScore} />
        <div className="space-y-4">
          <RiskOverview risks={risks} />
          <Card className="p-5">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-bold text-navy">Risk trend</h3>
              <p className="text-xs text-muted">7-day health score · mock series</p>
            </div>
            <HealthTrendChart data={weekHealthScores} />
          </Card>
        </div>
      </div>

      <HealthMetrics profile={profile} bmi={bmi} />

      <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <AIInsight />
        <Recommendations />
      </div>

      <Card className="flex items-start gap-3 p-5">
        <FlaskConical className="mt-0.5 text-teal" size={18} />
        <p className="text-sm text-muted">
          Quick actions above jump into estimated risk, illustrative simulation, and your prevention plan. Values update from the Health Profile stored on this device.
        </p>
      </Card>
    </div>
  )
}
