import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'

import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'
import SectionHeader from '../components/ui/SectionHeader'
import Disclaimer from '../components/common/Disclaimer'
import SimulationSlider from '../components/simulation/SimulationSlider'
import RiskGauge from '../components/simulation/RiskGauge'
import ScenarioCard from '../components/simulation/ScenarioCard'

import { medicalDisclaimer } from '../data/mockRiskData'
import { scenarios, sugarLabel } from '../data/mockSimulationData'
import { useHealth } from '../context/HealthContext'
import { calculateDomainRisks, clamp } from '../utils/healthCalculations'
import { api } from '../services/api'

export default function Simulate() {
  const { profile, risks } = useHealth()

  const safeProfile = useMemo(
    () => ({
      steps: Number(profile?.steps ?? 6000),
      sleep: Number(profile?.sleep ?? 7),
      exerciseMinutes: Number(profile?.exerciseMinutes ?? 30),
      weight: Number(profile?.weight ?? 70),
      water: Number(profile?.water ?? 2),
      sugar: profile?.sugar ?? 'Moderate',
      ...profile,
    }),
    [profile],
  )

  const [remote, setRemote] = useState(null)

  const [draft, setDraft] = useState({
    steps: Number(safeProfile.steps),
    sleep: Number(safeProfile.sleep),
    exerciseMinutes: Number(safeProfile.exerciseMinutes),
    weight: Number(safeProfile.weight),
    water: Number(safeProfile.water),
    sugarScore:
      safeProfile.sugar === 'High'
        ? 80
        : safeProfile.sugar === 'Moderate'
          ? 50
          : 20,
  })

  useEffect(() => {
    setDraft({
      steps: Number(safeProfile.steps ?? 6000),
      sleep: Number(safeProfile.sleep ?? 7),
      exerciseMinutes: Number(safeProfile.exerciseMinutes ?? 30),
      weight: Number(safeProfile.weight ?? 70),
      water: Number(safeProfile.water ?? 2),
      sugarScore:
        safeProfile.sugar === 'High'
          ? 80
          : safeProfile.sugar === 'Moderate'
            ? 50
            : 20,
    })
  }, [safeProfile])

  const simulatedProfile = useMemo(
    () => ({
      ...safeProfile,
      steps: Number(draft.steps),
      sleep: Number(draft.sleep),
      exerciseMinutes: Number(draft.exerciseMinutes),
      weight: Number(draft.weight),
      water: Number(draft.water),
      sugar: sugarLabel(draft.sugarScore),
    }),
    [safeProfile, draft],
  )

  const current = useMemo(() => {
    if (risks?.overall !== undefined && risks?.overall !== null) {
      return Number(risks.overall)
    }

    try {
      return Number(calculateDomainRisks(safeProfile)?.overall ?? 0)
    } catch {
      return 0
    }
  }, [risks, safeProfile])

  const simulated = useMemo(() => {
    try {
      return Number(
        calculateDomainRisks(simulatedProfile)?.overall ?? 0,
      )
    } catch {
      return current
    }
  }, [simulatedProfile, current])

  const delta = Number((simulated - current).toFixed(1))

  useEffect(() => {
    let active = true

    const sendSimulation = async () => {
      try {
        const data = await api.simulate({
          daily_steps: Number(draft.steps),
          sleep_hours: Number(draft.sleep),
          exercise_minutes: Number(draft.exerciseMinutes),
          weight_kg: Number(draft.weight),
          water_intake_liters: Number(draft.water),
          sugar_intake: sugarLabel(draft.sugarScore).toLowerCase(),
        })

        if (active) {
          setRemote(data)
        }
      } catch {
        if (active) {
          setRemote(null)
        }
      }
    }

    sendSimulation()

    return () => {
      active = false
    }
  }, [draft])

  const shownCurrent = Number(
    remote?.current_risk ?? current ?? 0,
  )

  const shownSimulated = Number(
    remote?.simulated_risk ?? simulated ?? 0,
  )

  const shownDelta = Number(
    remote?.improvement ?? delta ?? 0,
  )

  const applyScenario = (scenario) => {
    setDraft((prev) => {
      const next = { ...prev }

      if (scenario.patch?.stepsDelta) {
        next.steps = clamp(
          Number(prev.steps) + Number(scenario.patch.stepsDelta),
          1000,
          16000,
        )
      }

      if (scenario.patch?.sleepDelta) {
        next.sleep = clamp(
          Number(prev.sleep) + Number(scenario.patch.sleepDelta),
          4,
          10,
        )
      }

      if (scenario.patch?.sugar) {
        next.sugarScore = 18
      }

      if (scenario.patch?.exerciseMinutes !== undefined) {
        next.exerciseMinutes = Number(
          scenario.patch.exerciseMinutes,
        )
      }

      return next
    })
  }

  const scenarioImpacts = useMemo(() => {
    return scenarios.map((scenario) => {
      const next = {
        ...simulatedProfile,
      }

      if (scenario.patch?.stepsDelta) {
        next.steps = clamp(
          Number(safeProfile.steps) +
            Number(scenario.patch.stepsDelta),
          1000,
          16000,
        )
      }

      if (scenario.patch?.sleepDelta) {
        next.sleep = clamp(
          Number(safeProfile.sleep) +
            Number(scenario.patch.sleepDelta),
          4,
          10,
        )
      }

      if (scenario.patch?.sugar) {
        next.sugar = scenario.patch.sugar
      }

      if (scenario.patch?.exerciseMinutes !== undefined) {
        next.exerciseMinutes = Number(
          scenario.patch.exerciseMinutes,
        )
      }

      let after = current

      try {
        after = Number(
          calculateDomainRisks(next)?.overall ?? current,
        )
      } catch {
        after = current
      }

      return {
        ...scenario,
        impact: Number((after - current).toFixed(1)),
      }
    })
  }, [simulatedProfile, safeProfile, current])

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <SectionHeader
        title="What if you changed your lifestyle?"
        description="Illustrative simulation. Drag the sliders to see how estimated risk could move. Not a medical forecast."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <Card className="space-y-4 p-6">

          <SimulationSlider
            id="sim-steps"
            label="Daily steps"
            min={1000}
            max={16000}
            step={100}
            value={draft.steps}
            onChange={(v) =>
              setDraft((p) => ({
                ...p,
                steps: Number(v),
              }))
            }
            format={(v) => Number(v).toLocaleString()}
          />

          <SimulationSlider
            id="sim-sleep"
            label="Sleep hours"
            min={4}
            max={10}
            step={0.5}
            value={draft.sleep}
            unit="hrs"
            onChange={(v) =>
              setDraft((p) => ({
                ...p,
                sleep: Number(v),
              }))
            }
          />

          <SimulationSlider
            id="sim-ex"
            label="Exercise minutes"
            min={0}
            max={90}
            value={draft.exerciseMinutes}
            unit="min"
            onChange={(v) =>
              setDraft((p) => ({
                ...p,
                exerciseMinutes: Number(v),
              }))
            }
          />

          <SimulationSlider
            id="sim-wt"
            label="Weight"
            min={40}
            max={140}
            value={draft.weight}
            unit="kg"
            onChange={(v) =>
              setDraft((p) => ({
                ...p,
                weight: Number(v),
              }))
            }
          />

          <SimulationSlider
            id="sim-water"
            label="Water intake"
            min={0.5}
            max={4}
            step={0.1}
            value={draft.water}
            unit="L"
            onChange={(v) =>
              setDraft((p) => ({
                ...p,
                water: Number(v),
              }))
            }
          />

          <SimulationSlider
            id="sim-sugar"
            label="Sugar intake"
            min={0}
            max={100}
            value={draft.sugarScore}
            onChange={(v) =>
              setDraft((p) => ({
                ...p,
                sugarScore: Number(v),
              }))
            }
            format={(v) => sugarLabel(v)}
          />

        </Card>

        <Card className="flex flex-col items-center justify-center p-6">

          <div className="grid w-full grid-cols-2 gap-3">

            <div className="rounded-2xl bg-canvas p-4 text-center">
              <p className="text-xs text-muted">
                Current risk
              </p>

              <p className="text-3xl font-extrabold text-navy">
                {shownCurrent}%
              </p>
            </div>

            <motion.div
              key={shownSimulated}
              initial={{
                opacity: 0.5,
                y: 6,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="rounded-2xl bg-teal/10 p-4 text-center"
            >
              <p className="text-xs text-muted">
                Simulated risk
              </p>

              <p className="text-3xl font-extrabold text-navy">
                {shownSimulated}%
              </p>
            </motion.div>

          </div>

          <div className="mt-6">
            <RiskGauge
              value={clamp(shownSimulated, 0, 100)}
              label="Simulated estimated risk"
            />
          </div>

          <Badge
            tone={shownDelta <= 0 ? 'good' : 'warn'}
            className="mt-2"
          >
            Risk improvement:{' '}
            {shownDelta <= 0 ? '↓' : '↑'}{' '}
            {Math.abs(shownDelta)}%
          </Badge>

          <p className="mt-3 text-center text-xs text-muted">
            Simulated / illustrative values. This is not a medical
            forecast.
          </p>

        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {scenarioImpacts.map((item) => (
          <ScenarioCard
            key={item.id}
            title={item.title}
            description={item.description}
            impact={item.impact}
            onApply={() => applyScenario(item)}
          />
        ))}
      </div>

      <Disclaimer text={medicalDisclaimer} />
    </div>
  )
}