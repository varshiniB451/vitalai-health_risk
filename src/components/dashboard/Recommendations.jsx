import { Check } from 'lucide-react'
import Card from '../ui/Card'
import { todayRecommendations } from '../../data/mockHealthData'

export default function Recommendations() {
  return (
    <Card className="p-6">
      <h3 className="text-base font-bold text-navy">Today&apos;s recommendations</h3>
      <ul className="mt-4 space-y-3">
        {todayRecommendations.map((item) => (
          <li key={item.id} className="flex gap-3 rounded-2xl border border-line bg-canvas/60 p-3">
            <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-teal/10 text-teal">
              <Check size={14} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold text-navy">{item.title}</p>
              <p className="text-xs text-muted">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
