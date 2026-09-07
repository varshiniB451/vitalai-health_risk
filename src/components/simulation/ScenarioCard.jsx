import { motion } from 'framer-motion'
import Card from '../ui/Card'
import Badge from '../ui/Badge'

export default function ScenarioCard({ title, description, impact, onApply }) {
  const improved = impact < 0
  return (
    <Card hover className="flex h-full flex-col p-5">
      <h3 className="font-bold text-navy">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted">{description}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <Badge tone={improved ? 'good' : 'warn'}>
          {improved ? `↓ ${Math.abs(impact)}% est.` : `+${impact}% est.`}
        </Badge>
        <motion.button
          type="button"
          whileTap={{ scale: 0.97 }}
          onClick={onApply}
          className="text-sm font-semibold text-teal hover:underline"
        >
          Apply
        </motion.button>
      </div>
    </Card>
  )
}
