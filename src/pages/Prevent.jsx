import { Brain, Droplets, Footprints, Moon, Salad, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SectionHeader from '../components/ui/SectionHeader'
import { useHealth } from '../context/HealthContext'
import { api } from '../services/api'

const plan = [
  {
    id: 'walk',
    category: 'Movement',
    icon: Footprints,
    title: 'Walk 30 minutes',
    description: 'A daily brisk walk to support cardiovascular recovery.',
    target: '30 min',
    progress: 60,
  },
  {
    id: 'steps',
    category: 'Movement',
    icon: Footprints,
    title: '8,000 steps/day',
    description: 'Build volume gradually from your current baseline.',
    target: '8,000 steps',
    progress: 72,
  },
  {
    id: 'veg',
    category: 'Nutrition',
    icon: Salad,
    title: 'Increase vegetables',
    description: 'Add one extra produce serving at lunch and dinner.',
    target: '5 servings',
    progress: 40,
  },
  {
    id: 'sugar',
    category: 'Nutrition',
    icon: Salad,
    title: 'Reduce processed sugar',
    description: 'Replace one sweetened drink with unsweetened tea or water.',
    target: 'Low sugar days',
    progress: 35,
  },
  {
    id: 'sleep',
    category: 'Sleep',
    icon: Moon,
    title: 'Target 7–8 hours',
    description: 'Protect a consistent wind-down before 11 PM.',
    target: '7–8 hrs',
    progress: 55,
  },
  {
    id: 'water',
    category: 'Hydration',
    icon: Droplets,
    title: '2L / day',
    description: 'Keep a bottle visible during work blocks.',
    target: '2 liters',
    progress: 70,
  },
  {
    id: 'mind',
    category: 'Mental Wellness',
    icon: Brain,
    title: '10 minute mindfulness',
    description: 'A short breathing reset to close the day.',
    target: '10 min',
    progress: 20,
  },
]

const icons = { Movement: Footprints, Nutrition: Salad, Sleep: Moon, Hydration: Droplets, 'Mental Wellness': Brain }

export default function Prevent() {
  const { completedActions, toggleAction } = useHealth()
  const [backendPlan, setBackendPlan] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    api.prevention()
      .then(setBackendPlan)
      .catch((requestError) => setError(requestError?.detail || 'Unable to load your prevention plan.'))
  }, [])

  const items = backendPlan
  const priority = items[0]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SectionHeader
        title="Your Personalized Prevention Plan"
        description="A focused, illustrative plan based on your current profile. Complete items as you go — progress is stored locally."
      />

      <Card className="relative overflow-hidden border-teal/20 bg-gradient-to-br from-white to-teal/5 p-6">
        <Badge tone="teal" className="gap-1">
          <Sparkles size={12} /> Today&apos;s Priority
        </Badge>
        <h3 className="mt-3 text-2xl font-extrabold text-navy">{priority?.title || 'No recommendation available'}</h3>
        <p className="mt-2 max-w-xl text-sm text-muted">{priority?.description || 'Complete a health profile to receive personalized recommendations.'}</p>
      </Card>

      <div className="grid gap-4">
        {error ? <p className="text-sm text-alert">{error}</p> : null}
        {items.map((item, i) => {
          const Icon = item.icon || icons[item.category] || Sparkles
          const done = item.completed || completedActions.includes(item.id)
          return (
            <Card key={item.id} delay={i * 0.03} className="p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-navy/5 text-navy">
                  <Icon size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-teal">{item.category}</p>
                  <h3 className="font-bold text-navy">{item.title}</h3>
                  <p className="text-sm text-muted">{item.description}</p>
                  <p className="mt-2 text-xs font-semibold text-navy">Target: {item.target}</p>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-teal" style={{ width: `${done ? 100 : item.progress}%` }} />
                  </div>
                </div>
                <Button variant={done ? 'soft' : 'primary'} onClick={() => toggleAction(item.id)}>
                  {done ? 'Completed' : 'Complete'}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
