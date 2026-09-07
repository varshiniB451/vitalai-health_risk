export default function Slider({
  id,
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange,
  format,
}) {
  const display = format ? format(value) : `${value}${unit ? ` ${unit}` : ''}`

  return (
    <div className="space-y-2">
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="text-sm font-semibold text-navy">
          {label}
        </label>
        <span className="text-sm font-bold tabular-nums text-teal">{display}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-line"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={label}
      />
      <div className="flex justify-between text-[11px] text-muted">
        <span>
          {min}
          {unit ? ` ${unit}` : ''}
        </span>
        <span>
          {max}
          {unit ? ` ${unit}` : ''}
        </span>
      </div>
    </div>
  )
}
