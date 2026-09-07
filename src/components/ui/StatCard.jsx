import Card from './Card'
import Badge from './Badge'

export default function StatCard({ label, value, unit, hint, tone = 'navy', icon: Icon, delay = 0 }) {
  return (
    <Card delay={delay} className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight text-navy">
            {value}
            {unit ? <span className="ml-1 text-sm font-semibold text-muted">{unit}</span> : null}
          </p>
          {hint ? (
            <p className="mt-2">
              <Badge tone={tone}>{hint}</Badge>
            </p>
          ) : null}
        </div>
        {Icon ? (
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal/10 text-teal">
            <Icon size={18} aria-hidden="true" />
          </span>
        ) : null}
      </div>
    </Card>
  )
}
