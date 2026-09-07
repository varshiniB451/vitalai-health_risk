import Button from '../ui/Button'

export default function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-dashed border-line bg-white px-6 py-12 text-center">
      <h3 className="text-lg font-bold text-navy">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{description}</p>
      {actionLabel ? (
        <Button className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
