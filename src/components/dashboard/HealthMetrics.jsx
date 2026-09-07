import { Activity, Droplets, Dumbbell, Footprints, Heart, Moon } from 'lucide-react'
import StatCard from '../ui/StatCard'
import { bmiCategory } from '../../utils/healthCalculations'

export default function HealthMetrics({ profile, bmi }) {
  const bmiMeta = bmiCategory(bmi)
  const cards = [
    { label: 'BMI', value: bmi, unit: '', hint: bmiMeta.label, tone: bmiMeta.tone, icon: Activity },
    { label: 'Sleep', value: profile.sleep, unit: 'hrs', hint: profile.sleep >= 7 ? 'On target' : 'Below target', tone: profile.sleep >= 7 ? 'good' : 'warn', icon: Moon },
    { label: 'Steps', value: profile.steps.toLocaleString(), unit: '', hint: profile.steps >= 8000 ? 'Active' : 'Build up', tone: profile.steps >= 8000 ? 'good' : 'teal', icon: Footprints },
    { label: 'Heart rate', value: profile.heartRate, unit: 'bpm', hint: 'Resting', tone: 'navy', icon: Heart },
    { label: 'Water', value: profile.water, unit: 'L', hint: profile.water >= 2 ? 'Hydrated' : 'Increase', tone: profile.water >= 2 ? 'good' : 'warn', icon: Droplets },
    { label: 'Exercise', value: profile.exerciseMinutes, unit: 'min', hint: `${profile.exerciseFrequency}x / week`, tone: 'teal', icon: Dumbbell },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {cards.map((card, i) => (
        <StatCard key={card.label} {...card} delay={i * 0.04} />
      ))}
    </div>
  )
}
