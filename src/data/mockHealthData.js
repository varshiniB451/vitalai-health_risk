export const defaultProfile = {
  fullName: 'Alex Rivera',
  age: 32,
  gender: 'Female',
  height: 168,
  weight: 72,
  steps: 7200,
  exerciseFrequency: 3,
  exerciseMinutes: 25,
  sleep: 6.5,
  water: 1.6,
  smoking: 'Never',
  alcohol: 'Occasional',
  systolic: 122,
  diastolic: 78,
  heartRate: 72,
  familyHistory: ['Type 2 Diabetes'],
  conditions: [],
  fruitsVeg: 3,
  processedFood: 'Often',
  sugar: 'High',
}

export const healthMetrics = [
  { key: 'bmi', label: 'BMI', unit: '', icon: 'activity' },
  { key: 'sleep', label: 'Sleep', unit: 'hrs', icon: 'moon' },
  { key: 'steps', label: 'Steps', unit: '', icon: 'footprints' },
  { key: 'heartRate', label: 'Heart rate', unit: 'bpm', icon: 'heart' },
  { key: 'water', label: 'Water', unit: 'L', icon: 'droplets' },
  { key: 'exerciseMinutes', label: 'Exercise', unit: 'min', icon: 'dumbbell' },
]

export const weekHealthScores = [
  { day: 'Mon', score: 72, steps: 6100, sleep: 6.2 },
  { day: 'Tue', score: 74, steps: 7400, sleep: 6.8 },
  { day: 'Wed', score: 71, steps: 5200, sleep: 5.9 },
  { day: 'Thu', score: 76, steps: 8300, sleep: 7.1 },
  { day: 'Fri', score: 75, steps: 7900, sleep: 6.4 },
  { day: 'Sat', score: 80, steps: 10200, sleep: 7.6 },
  { day: 'Sun', score: 78, steps: 7200, sleep: 6.5 },
]

export const previousWeek = {
  healthScore: 74,
  weight: 73.2,
  steps: 6800,
  sleep: 6.3,
  exercise: 90,
  water: 1.4,
}

export const todayRecommendations = [
  { id: 1, title: 'Walk 30 minutes', detail: 'A brisk walk after lunch supports heart health.' },
  { id: 2, title: 'Drink 2L water', detail: 'You are about 0.4L below your hydration target.' },
  { id: 3, title: 'Sleep before 11 PM', detail: 'Protect a 7–8 hour window tonight.' },
  { id: 4, title: 'Reduce processed sugar', detail: 'Swap one sweet drink for sparkling water.' },
]

export const achievements = [
  { id: 'streak', title: '7-day streak', detail: 'Logged health check-ins every day this week.', tone: 'teal' },
  { id: 'steps', title: '50K steps', detail: 'Crossed 50,000 steps over the last 7 days.', tone: 'good' },
  { id: 'workouts', title: '5 workouts completed', detail: 'Strength and walking sessions this week.', tone: 'navy' },
]
