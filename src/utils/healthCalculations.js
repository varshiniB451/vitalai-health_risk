export function calcBmi(weightKg, heightCm) {
  const h = Number(heightCm) / 100
  if (!h || !weightKg) return 0
  return Number((Number(weightKg) / (h * h)).toFixed(1))
}

export function bmiCategory(bmi) {
  if (bmi < 18.5) return { label: 'Underweight', tone: 'warn' }
  if (bmi < 25) return { label: 'Healthy', tone: 'good' }
  if (bmi < 30) return { label: 'Overweight', tone: 'warn' }
  return { label: 'High', tone: 'alert' }
}

export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

export function riskStatus(percent) {
  if (percent < 20) return { label: 'Low Risk', tone: 'good' }
  if (percent < 40) return { label: 'Moderate Risk', tone: 'warn' }
  return { label: 'High Risk', tone: 'alert' }
}

export function scoreStatus(score) {
  if (score >= 80) return { label: 'Excellent', tone: 'good' }
  if (score >= 65) return { label: 'Good', tone: 'good' }
  if (score >= 50) return { label: 'Fair', tone: 'warn' }
  return { label: 'Needs attention', tone: 'alert' }
}

/**
 * Illustrative prototype scoring — not a medical model.
 */
export function calculateHealthScore(profile) {
  const bmi = calcBmi(profile.weight, profile.height)
  let score = 78

  if (bmi >= 18.5 && bmi < 25) score += 6
  else if (bmi >= 25 && bmi < 30) score -= 6
  else if (bmi >= 30) score -= 12
  else score -= 4

  score += clamp((profile.steps - 6000) / 400, -8, 8)
  score += clamp((profile.sleep - 7) * 4, -8, 6)
  score += clamp((profile.exerciseMinutes - 20) / 8, -6, 6)
  score += clamp((profile.water - 2) * 3, -5, 4)

  if (profile.sugar === 'High') score -= 7
  else if (profile.sugar === 'Moderate') score -= 3
  else score += 2

  if (profile.smoking === 'Current') score -= 10
  else if (profile.smoking === 'Former') score -= 3

  if (profile.familyHistory?.length) score -= profile.familyHistory.length * 2

  return Math.round(clamp(score, 28, 96))
}

export function calculateOverallRisk(profile) {
  const bmi = calcBmi(profile.weight, profile.height)
  let risk = 18

  if (bmi >= 25) risk += (bmi - 25) * 1.4
  if (bmi >= 30) risk += 4
  if (profile.familyHistory?.includes('Heart disease')) risk += 7
  if (profile.familyHistory?.includes('Type 2 Diabetes')) risk += 6
  if (profile.familyHistory?.includes('Hypertension')) risk += 5
  if (profile.sugar === 'High') risk += 6
  if (profile.sugar === 'Moderate') risk += 3
  if (profile.steps < 7000) risk += (7000 - profile.steps) / 900
  if (profile.sleep < 7) risk += (7 - profile.sleep) * 2.2
  if (profile.water < 2) risk += (2 - profile.water) * 2
  if (profile.exerciseMinutes < 30) risk += (30 - profile.exerciseMinutes) / 10
  if (profile.smoking === 'Current') risk += 10
  if (profile.systolic >= 130) risk += 5

  risk -= clamp((profile.steps - 8000) / 1200, 0, 5)
  if (profile.sleep >= 7 && profile.sleep <= 8.5) risk -= 3
  if (profile.exerciseMinutes >= 30) risk -= 3

  return Number(clamp(risk, 6, 72).toFixed(0))
}

export function calculateDomainRisks(profile) {
  const overall = calculateOverallRisk(profile)
  const bmi = calcBmi(profile.weight, profile.height)

  const heart = clamp(
    overall * 0.85 + (bmi > 25 ? 4 : 0) + (profile.familyHistory?.includes('Heart disease') ? 8 : 0) - (profile.steps > 8000 ? 4 : 0),
    5,
    80,
  )
  const diabetes = clamp(
    overall * 0.9 + (bmi > 27 ? 8 : 2) + (profile.familyHistory?.includes('Type 2 Diabetes') ? 10 : 0) + (profile.sugar === 'High' ? 8 : 0),
    8,
    85,
  )
  const hypertension = clamp(
    overall * 0.8 + (profile.systolic >= 130 ? 10 : 0) + (profile.familyHistory?.includes('Hypertension') ? 7 : 0),
    6,
    80,
  )
  const lifestyle = clamp(
    12 +
      (profile.steps < 6000 ? 10 : 0) +
      (profile.sleep < 6.5 ? 8 : 0) +
      (profile.sugar === 'High' ? 9 : 0) +
      (profile.water < 1.5 ? 5 : 0) -
      (profile.exerciseMinutes >= 30 ? 6 : 0),
    5,
    70,
  )

  return {
    overall,
    heart: Math.round(heart),
    diabetes: Math.round(diabetes),
    hypertension: Math.round(hypertension),
    lifestyle: Math.round(lifestyle),
  }
}

export function getRiskContributions(profile) {
  const bmi = calcBmi(profile.weight, profile.height)
  const items = []

  const bmiImpact = bmi >= 25 ? Math.round((bmi - 24) * 3.2) : Math.round((24.5 - bmi) * -1.5)
  items.push({ key: 'bmi', label: 'BMI', value: bmiImpact, detail: `${bmi} kg/m²` })

  const family = profile.familyHistory?.length ? profile.familyHistory.length * 7 + 8 : -2
  items.push({ key: 'family', label: 'Family history', value: family, detail: profile.familyHistory?.length ? profile.familyHistory.join(', ') : 'None reported' })

  const sugar = profile.sugar === 'High' ? 11 : profile.sugar === 'Moderate' ? 5 : -4
  items.push({ key: 'sugar', label: 'Sugar intake', value: sugar, detail: profile.sugar })

  const sleep = profile.sleep >= 7 ? -8 : Math.round((7 - profile.sleep) * 4)
  items.push({ key: 'sleep', label: 'Sleep', value: sleep, detail: `${profile.sleep} hrs` })

  const activity = profile.steps >= 8000 ? -12 : Math.round((8000 - profile.steps) / 450)
  items.push({ key: 'activity', label: 'Activity', value: activity, detail: `${profile.steps.toLocaleString()} steps` })

  const water = profile.water >= 2 ? -5 : Math.round((2 - profile.water) * 4)
  items.push({ key: 'water', label: 'Hydration', value: water, detail: `${profile.water} L` })

  return items.sort((a, b) => b.value - a.value)
}

export function simulateRisk(baselineProfile, scenario) {
  const merged = { ...baselineProfile, ...scenario }
  return calculateDomainRisks(merged).overall
}

export function percentChange(current, previous) {
  if (!previous) return 0
  return Number((((current - previous) / previous) * 100).toFixed(1))
}
