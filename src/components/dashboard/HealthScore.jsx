import ProgressRing from '../ui/ProgressRing'
import Card from '../ui/Card'
import { scoreStatus } from '../../utils/healthCalculations'

export default function HealthScore({ score }) {
  const status = scoreStatus(score)
  return (
    <Card className="flex h-full flex-col items-center justify-center p-6 text-center">
      <p className="mb-4 text-sm font-semibold text-muted">Overall health score</p>
      <ProgressRing value={score} max={100} label="/ 100" sublabel={status.label} />
      <p className="mt-4 max-w-[220px] text-xs leading-relaxed text-muted">
        Prototype score from your saved profile. Not a clinical rating.
      </p>
    </Card>
  )
}
