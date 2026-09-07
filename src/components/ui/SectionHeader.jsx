export default function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow ? <p className="mb-1 text-xs font-semibold uppercase tracking-[0.16em] text-teal">{eyebrow}</p> : null}
        <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">{title}</h2>
        {description ? <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}
