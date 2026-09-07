import { Sparkles } from 'lucide-react'
import Card from '../ui/Card'
import Badge from '../ui/Badge'
import { aiInsightCopy } from '../../data/mockRiskData'

export default function AIInsight({ copy = aiInsightCopy }) {
  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-teal/10" />
      <Badge tone="teal" className="gap-1">
        <Sparkles size={12} aria-hidden="true" />
        AI Insight
      </Badge>
      <p className="relative mt-4 text-[15px] leading-relaxed text-navy">{copy}</p>
      <p className="relative mt-3 text-xs text-muted">Prototype insight · illustrative only</p>
    </Card>
  )
}
