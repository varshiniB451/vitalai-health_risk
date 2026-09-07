import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import Disclaimer from '../components/common/Disclaimer'
import RiskGauge from '../components/simulation/RiskGauge'
import { medicalDisclaimer } from '../data/mockRiskData'
import { useHealth } from '../context/HealthContext'
import { riskStatus } from '../utils/healthCalculations'
import { api, mapPrediction, toApiProfile } from '../services/api'

const domains = [
  { key: 'heart', title: 'Heart Disease' },
  { key: 'diabetes', title: 'Diabetes' },
  { key: 'hypertension', title: 'Hypertension' },
  { key: 'lifestyle', title: 'Lifestyle Risk' },
]

export default function Predict() {
  const { profile } = useHealth()
  const navigate = useNavigate()
  const [pulse, setPulse] = useState(0)
  const [liveRisks, setLiveRisks] = useState(null)
  const [statusNote, setStatusNote] = useState('')
  const display = liveRisks || {
    overall: 0,
    heart: 0,
    diabetes: 0,
    hypertension: 0,
    lifestyle: 0,
  }
  const overall = display.overall
  const status = riskStatus(overall)

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-navy">Your Health Risk Assessment</h2>
          <p className="mt-1 text-muted">Estimated risk across key domains, generated from your saved profile.</p>
        </div>
        <Button
          onClick={async () => {
            setPulse((n) => n + 1)
            try {
              const data = await api.predict(toApiProfile(profile))
              setLiveRisks(mapPrediction(data))
              setStatusNote('Estimated from /api/predict')
            } catch (error) {
              setLiveRisks(null)
              setStatusNote(error?.detail || 'Unable to reach the backend for a risk assessment.')
            }
          }}
        >
          Analyze My Health
        </Button>
      </div>

      <Card className="mb-6 flex flex-col items-center p-8 text-center">
        <p className="text-sm font-semibold text-muted">Overall estimated risk</p>
        <motion.div key={pulse} initial={{ scale: 0.96, opacity: 0.6 }} animate={{ scale: 1, opacity: 1 }}>
          <RiskGauge value={overall} label={`${status.label} · illustrative`} />
        </motion.div>
        <p className="mt-2 text-lg font-bold text-navy">{liveRisks ? `${overall}% Overall Risk` : 'No assessment available'}</p>
        {statusNote ? <p className="mt-1 text-xs text-muted">{statusNote}</p> : null}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        {domains.map((domain, i) => {
          const value = display[domain.key]
          const meta = riskStatus(value)
          return (
            <Card key={domain.key} delay={i * 0.05} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-navy">{domain.title}</h3>
                  <p className="mt-2 text-3xl font-extrabold tabular-nums text-navy">{value}%</p>
                </div>
                <Badge tone={meta.tone}>{meta.label}</Badge>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-teal"
                  style={{ width: `${Math.min(100, value * 1.4)}%` }}
                />
              </div>
              <Button variant="ghost" size="sm" className="mt-4 w-full" onClick={() => navigate('/explain')}>
                View explanation
              </Button>
            </Card>
          )
        })}
      </div>

      <Disclaimer text={medicalDisclaimer} />
    </div>
  )
}
