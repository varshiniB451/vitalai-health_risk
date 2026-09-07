export const simulationDefaults = {
  steps: 7200,
  sleep: 6.5,
  exerciseMinutes: 25,
  weight: 72,
  water: 1.6,
  sugarScore: 80,
}

export const sugarLabel = (score) => {
  if (score >= 70) return 'High'
  if (score >= 40) return 'Moderate'
  return 'Low'
}

export const scenarios = [
  {
    id: 'walk',
    title: 'Walk +2,000 steps/day',
    description: 'Add a 20-minute walk to your current routine.',
    patch: { stepsDelta: 2000 },
  },
  {
    id: 'sleep',
    title: 'Sleep +1 hour',
    description: 'Protect an extra hour of overnight recovery.',
    patch: { sleepDelta: 1 },
  },
  {
    id: 'sugar',
    title: 'Reduce sugar intake',
    description: 'Move from high to low added-sugar days.',
    patch: { sugar: 'Low' },
  },
  {
    id: 'exercise',
    title: 'Exercise 30 min/day',
    description: 'Hold a consistent daily movement block.',
    patch: { exerciseMinutes: 30 },
  },
]
