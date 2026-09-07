import { Activity, HeartPulse, Leaf } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { riskStatus } from '../../utils/healthCalculations'

const items = [
  { key: 'heart', label: 'Cardiovascular risk', icon: HeartPulse },
  { key: 'diabetes', label: 'Diabetes risk', icon: Activity },
  { key: 'lifestyle', label: 'Lifestyle risk', icon: Leaf },
]

export default function RiskOverview({ risks }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((item, i) => {
        const value = risks[item.key]
        const status = riskStatus(value)
        const Icon = item.icon
        return (
          <Card key={item.key} delay={i * 0.05} className="p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy/5 text-navy">
                <Icon size={18} aria-hidden="true" />
              </span>
              <Badge tone={status.tone}>{status.label.replace(' Risk', '')}</Badge>
            </div>
            <p className="text-sm text-muted">{item.label}</p>
            <p className="mt-1 text-2xl font-bold text-navy">{value}%</p>
            <p className="mt-1 text-xs text-muted">Estimated</p>
          </Card>
        )
      })}
    </div>
  )
}
