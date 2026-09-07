import { createContext, useContext, useEffect, useMemo } from 'react'
import { defaultProfile, weekHealthScores } from '../data/mockHealthData'
import { useLocalStorage } from '../hooks/useLocalStorage'
import {
  calcBmi,
  calculateDomainRisks,
  calculateHealthScore,
  getRiskContributions,
} from '../utils/healthCalculations'
import { api, fromApiProfile } from '../services/api'
import { useAuth } from './AuthContext'

const HealthContext = createContext(null)

export function HealthProvider({ children }) {
  const [profile, setProfile] = useLocalStorage('vitalai.profile', defaultProfile)
  const [completedActions, setCompletedActions] = useLocalStorage('vitalai.completedActions', [])
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) return undefined
    let active = true
    api.getProfile()
      .then((data) => {
        if (active) setProfile((current) => fromApiProfile(data, current))
      })
      .catch((error) => {
        if (error?.status !== 404) console.error('Failed to load health profile:', error)
      })
    return () => { active = false }
  }, [isAuthenticated, setProfile])

  const value = useMemo(() => {
    const healthScore = calculateHealthScore(profile)
    const risks = calculateDomainRisks(profile)
    const contributions = getRiskContributions(profile)
    const bmi = calcBmi(profile.weight, profile.height)

    return {
      profile,
      setProfile,
      healthScore,
      risks,
      contributions,
      bmi,
      weekHealthScores,
      completedActions,
      toggleAction: (id) => {
        setCompletedActions((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        )
      },
    }
  }, [profile, setProfile, completedActions, setCompletedActions])

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>
}

export function useHealth() {
  const ctx = useContext(HealthContext)
  if (!ctx) throw new Error('useHealth must be used within HealthProvider')
  return ctx
}
