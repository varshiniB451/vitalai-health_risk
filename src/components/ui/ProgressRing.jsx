import { useEffect, useState } from 'react'

export default function ProgressRing({
  value = 0,
  max = 100,
  size = 180,
  stroke = 12,
  label,
  sublabel,
  color = 'var(--color-teal)',
}) {
  const [display, setDisplay] = useState(0)
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.min(100, Math.max(0, (display / max) * 100))
  const offset = circumference - (pct / 100) * circumference

  useEffect(() => {
    const start = performance.now()
    const from = 0
    const duration = 900
    let frame
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(from + (value - from) * eased)
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-line)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.2s ease' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <p className="text-4xl font-extrabold tracking-tight text-navy">{Math.round(display)}</p>
        {label ? <p className="mt-0.5 text-sm text-muted">{label}</p> : null}
        {sublabel ? <p className="text-xs font-semibold text-teal">{sublabel}</p> : null}
      </div>
    </div>
  )
}
