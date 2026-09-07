import { Award, Flame, Footprints } from 'lucide-react'
import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SectionHeader from '../components/ui/SectionHeader'
import HealthTrendChart from '../components/charts/HealthTrendChart'
import StepsChart from '../components/charts/StepsChart'
import SleepChart from '../components/charts/SleepChart'
import { achievements } from '../data/mockHealthData'
import { useHealth } from '../context/HealthContext'
import { api } from '../services/api'
import { percentChange } from '../utils/healthCalculations'

export default function Track() {
  const { healthScore, profile } = useHealth()
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.listTracking(), api.trackingSummary()])
      .then(([history, currentSummary]) => {
        setRecords(history)
        setSummary(currentSummary)
      })
      .catch((requestError) => setError(requestError?.detail || 'Unable to load health history.'))
  }, [])

  const chartData = records.map((record) => ({
    day: record.record_date.slice(5),
    score: record.health_score,
    steps: record.steps,
    sleep: record.sleep_hours,
  }))
  const last = records[records.length - 1]
  const previous = records[records.length - 2]
  const current = {
    healthScore: summary?.current_health_score ?? healthScore,
    weight: summary?.current_weight ?? profile.weight,
    steps: summary?.average_steps ?? 0,
    sleep: summary?.average_sleep ?? 0,
    exercise: summary?.average_exercise ?? 0,
    water: last?.water_intake_liters ?? 0,
  }

  const metrics = [
    { label: 'Health Score', current: current.healthScore, previous: previous?.health_score ?? summary?.previous_health_score ?? 0, betterUp: true },
    { label: 'Weight', current: current.weight, previous: previous?.weight_kg ?? current.weight, unit: 'kg', betterUp: false },
    { label: 'Steps', current: current.steps, previous: previous?.steps ?? 0, betterUp: true },
    { label: 'Sleep', current: current.sleep, previous: previous?.sleep_hours ?? 0, unit: 'hrs', betterUp: true },
    { label: 'Exercise', current: current.exercise, previous: previous?.exercise_minutes ?? 0, unit: 'min/wk', betterUp: true },
    { label: 'Water', current: current.water, previous: previous?.water_intake_liters ?? 0, unit: 'L', betterUp: true },
  ]

  const icons = [Flame, Footprints, Award]

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader
        title="Track your progress"
        description="Your saved health records and backend tracking summary."
      />
      {error ? <p className="text-sm text-alert">{error}</p> : null}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map((m) => {
          const change = percentChange(m.current, m.previous)
          const improved = m.betterUp ? change >= 0 : change <= 0
          return (
            <Card key={m.label} className="p-5">
              <p className="text-sm text-muted">{m.label}</p>
              <p className="mt-1 text-2xl font-bold text-navy">
                {typeof m.current === 'number' && m.current > 999 ? m.current.toLocaleString() : m.current}
                {m.unit ? <span className="ml-1 text-sm font-medium text-muted">{m.unit}</span> : null}
              </p>
              <p className="mt-2 text-xs text-muted">Previous: {m.previous.toLocaleString()}</p>
              <Badge tone={improved ? 'good' : 'warn'} className="mt-3">
                {change > 0 ? '+' : ''}
                {change}% vs last week
              </Badge>
            </Card>
          )
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <h3 className="mb-2 font-bold text-navy">Health score · 7 days</h3>
          <HealthTrendChart data={chartData} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-2 font-bold text-navy">Steps · 7 days</h3>
          <StepsChart data={chartData} />
        </Card>
        <Card className="p-5">
          <h3 className="mb-2 font-bold text-navy">Sleep · 7 days</h3>
          <SleepChart data={chartData} />
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {achievements.map((item, i) => {
          const Icon = icons[i]
          return (
            <Card key={item.id} className="p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">
                <Icon size={18} />
              </span>
              <h3 className="mt-3 font-bold text-navy">{item.title}</h3>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
