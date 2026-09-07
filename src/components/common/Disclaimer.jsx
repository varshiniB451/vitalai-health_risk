import { AlertTriangle } from 'lucide-react'

export default function Disclaimer({ text }) {
  return (
    <aside className="mt-6 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <AlertTriangle className="mt-0.5 shrink-0" size={16} aria-hidden="true" />
      <p>{text}</p>
    </aside>
  )
}
