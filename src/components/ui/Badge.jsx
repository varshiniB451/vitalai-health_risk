const tones = {
  good: 'bg-good/10 text-good',
  warn: 'bg-warn/10 text-warn',
  alert: 'bg-alert/10 text-alert',
  teal: 'bg-teal/10 text-teal',
  navy: 'bg-navy/10 text-navy',
  muted: 'bg-slate-100 text-muted',
}

export default function Badge({ children, tone = 'teal', className = '' }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold tracking-wide ${tones[tone] || tones.teal} ${className}`}
    >
      {children}
    </span>
  )
}
