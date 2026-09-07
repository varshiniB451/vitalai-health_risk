import { useEffect, useState } from 'react'
import { riskStatus } from '../../utils/healthCalculations'

export default function RiskGauge({ value, label = 'Estimated risk' }) {
  const [display, setDisplay] = useState(0)
  const status = riskStatus(value)
  const pct = Math.min(100, Math.max(0, display))
  const color = status.tone === 'good' ? 'var(--color-good)' : status.tone === 'warn' ? 'var(--color-warn)' : 'var(--color-alert)'

  useEffect(() => {
    let frame
    const start = performance.now()
    const duration = 700
    setDisplay((from) => {
      const origin = from
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - t, 3)
        setDisplay(origin + (value - origin) * eased)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
      return from
    })
    return () => cancelAnimationFrame(frame)
  }, [value])

  const r = 88
  const c = Math.PI * r
  const dash = (pct / 100) * c

  return (
    <div className="flex flex-col items-center">
      <svg width="220" height="130" viewBox="0 0 220 130" role="img" aria-label={`${label} ${Math.round(display)} percent`}>
        <path d="M22 118 A88 88 0 0 1 198 118" fill="none" stroke="var(--color-line)" strokeWidth="14" strokeLinecap="round" />
        <path
          d="M22 118 A88 88 0 0 1 198 118"
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c}`}
        />
      </svg>
      <p className="mt-[-1.5rem] text-4xl font-extrabold tabular-nums text-navy">{Math.round(display)}%</p>
      <p className="mt-1 text-sm font-semibold" style={{ color }}>
        {status.label}
      </p>
      <p className="text-xs text-muted">{label}</p>
    </div>
  )
}
