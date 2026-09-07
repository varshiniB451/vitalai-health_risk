const TOKEN_KEY = 'vitalai.token'

export function getToken() {
  try {
    return window.localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setToken(token) {
  try {
    if (token) {
      window.localStorage.setItem(TOKEN_KEY, token)
    } else {
      window.localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    /* ignore */
  }
}

export function clearToken() {
  try {
    window.localStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

export class ApiError extends Error {
  constructor(status, detail) {
    super(detail)
    this.name = 'ApiError'
    this.status = status
    this.detail = detail
  }
}

async function request(
  path,
  {
    method = 'GET',
    body,
    auth = true,
  } = {},
) {
  const headers = {
    Accept: 'application/json',
  }

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response

  try {
    response = await fetch(path, {
      method,
      headers,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    })
  } catch (error) {
    console.error(`VitalAI API network error for ${method} ${path}:`, error)
    throw new ApiError(0, 'The VitalAI backend is unavailable. Start the backend and try again.')
  }

  if (response.status === 204) {
    return null
  }

  const text = await response.text()

  let data = null

  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = {
      detail: text,
    }
  }

  if (!response.ok) {
    const detail =
      typeof data?.detail === 'string'
        ? data.detail
        : `Request failed (${response.status})`

    throw new ApiError(
      response.status,
      detail,
    )
  }

  return data
}


/* =========================================================
   API
========================================================= */

export const api = {

  /* -------------------------------------------------------
     HEALTH CHECK
  ------------------------------------------------------- */

  health: () =>
    request('/api/health', {
      auth: false,
    }),


  /* -------------------------------------------------------
     AUTHENTICATION
  ------------------------------------------------------- */

  register: (payload) =>
    request('/api/auth/register', {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  login: (payload) =>
    request('/api/auth/login', {
      method: 'POST',
      body: payload,
      auth: false,
    }),

  me: () =>
    request('/api/auth/me'),


  /* -------------------------------------------------------
     USER ACCOUNT
     Backend:
     GET  /api/users/me
     PUT  /api/users/me
  ------------------------------------------------------- */

  getUser: () =>
    request('/api/users/me'),

  updateUser: (payload) =>
    request('/api/users/me', {
      method: 'PUT',
      body: payload,
    }),

  getSettings: () =>
    request('/api/users/settings'),

  updateSettings: (payload) =>
    request('/api/users/settings', {
      method: 'PUT',
      body: payload,
    }),


  /* -------------------------------------------------------
     HEALTH PROFILE
  ------------------------------------------------------- */

  getProfile: () =>
    request('/api/health/profile'),

  createProfile: (payload) =>
    request('/api/health/profile', {
      method: 'POST',
      body: payload,
    }),

  updateProfile: (payload) =>
    request('/api/health/profile', {
      method: 'PUT',
      body: payload,
    }),


  /* -------------------------------------------------------
     PREDICTION
  ------------------------------------------------------- */

  predict: (payload = {}) =>
    request('/api/predict', {
      method: 'POST',
      body: payload,
    }),

  /* -------------------------------------------------------
     EXPLAINABLE AI
  ------------------------------------------------------- */

  explainLatest: () =>
    request('/api/explain/latest'),


  /* -------------------------------------------------------
     SIMULATION
  ------------------------------------------------------- */

  simulate: (payload) =>
    request('/api/simulate', {
      method: 'POST',
      body: payload,
    }),


  /* -------------------------------------------------------
     PREVENTION
  ------------------------------------------------------- */

  prevention: () =>
    request('/api/prevention'),


  /* -------------------------------------------------------
     TRACKING
  ------------------------------------------------------- */

  createTracking: (payload) =>
    request('/api/tracking', {
      method: 'POST',
      body: payload,
    }),

  listTracking: (params = {}) => {
    const query = new URLSearchParams()

    if (params.start_date) {
      query.set(
        'start_date',
        params.start_date,
      )
    }

    if (params.end_date) {
      query.set(
        'end_date',
        params.end_date,
      )
    }

    const queryString = query.toString()

    const suffix = queryString
      ? `?${queryString}`
      : ''

    return request(
      `/api/tracking${suffix}`,
    )
  },

  trackingSummary: () =>
    request('/api/tracking/summary'),

  trackingStreak: () =>
    request('/api/tracking/streak'),


}


/* =========================================================
   HEALTH PROFILE → API FORMAT
========================================================= */

export function toApiProfile(profile) {
  return {
    age: Number(profile.age),

    gender: profile.gender,

    height_cm: Number(
      profile.height,
    ),

    weight_kg: Number(
      profile.weight,
    ),

    daily_steps: Number(
      profile.steps,
    ),

    exercise_frequency: Number(
      profile.exerciseFrequency,
    ),

    exercise_minutes: Number(
      profile.exerciseMinutes,
    ),

    sleep_hours: Number(
      profile.sleep,
    ),

    water_intake_liters: Number(
      profile.water,
    ),

    smoking: profile.smoking,

    alcohol_consumption:
      profile.alcohol,

    systolic_bp: Number(
      profile.systolic,
    ),

    diastolic_bp: Number(
      profile.diastolic,
    ),

    resting_heart_rate: Number(
      profile.heartRate,
    ),

    family_history:
      profile.familyHistory || [],

    existing_conditions:
      profile.conditions || [],

    fruit_vegetable_intake:
      Number(profile.fruitsVeg),

    processed_food_frequency:
      profile.processedFood,

    sugar_intake:
      profile.sugar,
  }
}


/* =========================================================
   API → FRONTEND HEALTH PROFILE
========================================================= */

export function fromApiProfile(
  row,
  fallback,
) {
  if (!row) {
    return fallback
  }

  return {
    ...fallback,

    fullName:
      fallback.fullName,

    age: row.age,

    gender: row.gender,

    height:
      row.height_cm,

    weight:
      row.weight_kg,

    steps:
      row.daily_steps,

    exerciseFrequency:
      row.exercise_frequency,

    exerciseMinutes:
      row.exercise_minutes,

    sleep:
      row.sleep_hours,

    water:
      row.water_intake_liters,

    smoking:
      row.smoking,

    alcohol:
      row.alcohol_consumption,

    systolic:
      row.systolic_bp,

    diastolic:
      row.diastolic_bp,

    heartRate:
      row.resting_heart_rate,

    familyHistory:
      row.family_history || [],

    conditions:
      row.existing_conditions || [],

    fruitsVeg:
      row.fruit_vegetable_intake,

    processedFood:
      row.processed_food_frequency,

    sugar:
      row.sugar_intake,
  }
}


/* =========================================================
   PREDICTION → FRONTEND FORMAT
========================================================= */

export function mapPrediction(data) {
  if (!data) {
    return null
  }

  return {
    overall:
      data.overall_risk,

    heart:
      data.cardiovascular_risk,

    diabetes:
      data.diabetes_risk,

    hypertension:
      data.hypertension_risk,

    lifestyle:
      data.lifestyle_risk,

    healthScore:
      data.health_score,

    riskLevel:
      data.risk_level,
  }
}