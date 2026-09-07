import { useEffect, useState } from 'react'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SectionHeader from '../components/ui/SectionHeader'
import Disclaimer from '../components/common/Disclaimer'
import RiskContributionChart from '../components/charts/RiskContributionChart'
import { explanationCopy, medicalDisclaimer } from '../data/mockRiskData'
import { useHealth } from '../context/HealthContext'
import { api } from '../services/api'

export default function Explain() {
  const { contributions, risks } = useHealth()
  const [summary, setSummary] = useState(explanationCopy)
  const raising = contributions.filter((c) => c.value > 0)
  const lowering = contributions.filter((c) => c.value < 0)

  useEffect(() => {
    let active = true
    api
      .explainLatest()
      .then((data) => {
        if (active && data?.summary) setSummary(data.summary)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <SectionHeader
        title="Why is your risk at this level?"
        description={`Estimated overall risk is ${risks.overall}%. The bars below are prototype contributions, not a clinical attribution model.`}
      />

      <Card className="p-6">
        <p className="text-sm font-semibold text-navy">Factor contribution</p>
        <RiskContributionChart data={contributions} />
        <ul className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
          {contributions.map((item) => (
            <li key={item.key} className="flex justify-between rounded-xl bg-canvas px-3 py-2">
              <span className="font-medium text-navy">{item.label}</span>
              <span className={item.value >= 0 ? 'font-bold text-warn' : 'font-bold text-good'}>
                {item.value > 0 ? '+' : ''}
                {item.value}
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="font-bold text-navy">Factors increasing your risk</h3>
          <div className="mt-4 space-y-3">
            {raising.map((item) => (
              <FactorRow key={item.key} item={item} tone="warn" />
            ))}
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold text-navy">Factors reducing your risk</h3>
          <div className="mt-4 space-y-3">
            {lowering.map((item) => (
              <FactorRow key={item.key} item={item} tone="good" />
            ))}
            {!lowering.length ? <p className="text-sm text-muted">No strong protective factors detected in this prototype view.</p> : null}
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <Badge tone="teal">Prototype insight</Badge>
        <p className="mt-4 text-[15px] leading-relaxed text-navy">{summary}</p>
      </Card>

      <Disclaimer text={medicalDisclaimer} />
    </div>
  )
}

function FactorRow({ item, tone }) {
  return (
    <div className="rounded-2xl border border-line p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-navy">{item.label}</p>
        <Badge tone={tone}>
          {item.value > 0 ? '+' : ''}
          {item.value}
        </Badge>
      </div>
      <p className="mt-1 text-xs text-muted">{item.detail}</p>
    </div>
  )
}
