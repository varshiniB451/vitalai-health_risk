import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import SectionHeader from '../components/ui/SectionHeader'
import Slider from '../components/ui/Slider'
import { useHealth } from '../context/HealthContext'
import { calcBmi } from '../utils/healthCalculations'
import { api, fromApiProfile, toApiProfile } from '../services/api'

const familyOptions = [
  'Heart disease',
  'Type 2 Diabetes',
  'Hypertension',
]

const conditionOptions = [
  'None',
  'Asthma',
  'Thyroid disorder',
  'High cholesterol',
]

export default function HealthProfile() {
  const { profile, setProfile } = useHealth()

  const [form, setForm] = useState(profile)
  const [hasChanges, setHasChanges] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const update = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }))

    setHasChanges(true)
    setSaved(false)
    setError('')
  }

  useEffect(() => {
    if (!hasChanges) {
      setForm(profile)
    }
  }, [profile, hasChanges])

  const toggleList = (key, item) => {
    setForm((prev) => {
      const list = prev[key] || []

      const next = list.includes(item)
        ? list.filter((x) => x !== item)
        : [...list, item]

      return {
        ...prev,
        [key]: next.filter((x) => x !== 'None'),
      }
    })

    setHasChanges(true)
    setSaved(false)
    setError('')
  }

  const save = async (e) => {
    e.preventDefault()

    setError('')
    setSaved(false)
    setSaving(true)

    try {
      const payload = toApiProfile(form)

      if (import.meta.env.DEV) {
        console.debug('Saving health profile payload:', payload)
      }

      let savedProfile
      try {
        // Try updating existing profile
        savedProfile = await api.updateProfile(payload)

        console.log('Profile updated successfully')
      } catch (err) {
        console.log('Update profile failed:', err)

        // If profile does not exist, create it
        if (err?.status === 404) {
          console.log('Profile not found. Creating new profile...')

          savedProfile = await api.createProfile(payload)

          console.log('Profile created successfully')
        } else {
          throw err
        }
      }

      // Use the server response so the UI reflects what was persisted.
      const savedForm = fromApiProfile(savedProfile, form)
      setProfile(savedForm)
      setForm(savedForm)
      setHasChanges(false)

      setSaved(true)
      setError('')
    } catch (err) {
      console.error('Save profile failed:', err)

      setSaved(false)

      let message =
        'Unable to save your health profile.'

      if (err?.status === 401) {
        message =
          'Session expired. Please login again and try saving your profile.'
      } else if (err?.status === 403) {
        message =
          'You are not authorized to save this profile.'
      } else if (err?.status === 400 || err?.status === 422) {
        message =
          err?.detail ||
          'Some health profile values are invalid. Please check your information.'
      } else if (err?.status === 500) {
        message =
          'Server error. Please make sure the backend and database are running.'
      } else if (err?.detail) {
        message = err.detail
      } else if (err?.message) {
        message = err.message
      }

      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const bmi = calcBmi(form.weight, form.height)

  return (
    <form
      onSubmit={save}
      className="mx-auto max-w-4xl space-y-6"
    >
      <SectionHeader
        eyebrow="Profile"
        title="Your health data"
        description="Your health information is saved to your VitalAI profile when you are signed in."
        action={
          saved ? (
            <p className="flex items-center gap-1 text-sm font-semibold text-good">
              <Check size={16} />
              Profile saved
            </p>
          ) : null
        }
      />

      {/* PERSONAL INFORMATION */}
      <Card className="p-6">
        <h3 className="mb-4 font-bold text-navy">
          Personal information
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            id="age"
            label="Age"
            value={form.age}
            onChange={(v) => update('age', v)}
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-navy">
              Gender
            </p>

            <Segmented
              value={form.gender}
              options={[
                'Female',
                'Male',
                'Other',
              ]}
              onChange={(v) =>
                update('gender', v)
              }
            />
          </div>

          <Slider
            id="height"
            label="Height"
            min={140}
            max={210}
            value={form.height}
            unit="cm"
            onChange={(v) =>
              update('height', v)
            }
          />

          <Slider
            id="weight"
            label="Weight"
            min={40}
            max={140}
            value={form.weight}
            unit="kg"
            onChange={(v) =>
              update('weight', v)
            }
          />
        </div>

        <p className="mt-4 text-sm text-muted">
          Calculated BMI:{' '}
          <span className="font-semibold text-navy">
            {bmi}
          </span>
        </p>
      </Card>

      {/* LIFESTYLE */}
      <Card className="p-6">
        <h3 className="mb-4 font-bold text-navy">
          Lifestyle
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <Slider
            id="steps"
            label="Daily steps"
            min={1000}
            max={16000}
            step={100}
            value={form.steps}
            onChange={(v) =>
              update('steps', v)
            }
            format={(v) =>
              v.toLocaleString()
            }
          />

          <Slider
            id="exfreq"
            label="Exercise frequency"
            min={0}
            max={7}
            value={form.exerciseFrequency}
            unit="days/wk"
            onChange={(v) =>
              update(
                'exerciseFrequency',
                v,
              )
            }
          />

          <Slider
            id="exmin"
            label="Exercise duration"
            min={0}
            max={90}
            value={form.exerciseMinutes}
            unit="min"
            onChange={(v) =>
              update(
                'exerciseMinutes',
                v,
              )
            }
          />

          <Slider
            id="sleep"
            label="Sleep duration"
            min={4}
            max={10}
            step={0.5}
            value={form.sleep}
            unit="hrs"
            onChange={(v) =>
              update('sleep', v)
            }
          />

          <Slider
            id="water"
            label="Water intake"
            min={0.5}
            max={4}
            step={0.1}
            value={form.water}
            unit="L"
            onChange={(v) =>
              update('water', v)
            }
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-navy">
              Smoking
            </p>

            <Segmented
              value={form.smoking}
              options={[
                'Never',
                'Former',
                'Current',
              ]}
              onChange={(v) =>
                update('smoking', v)
              }
            />
          </div>

          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-semibold text-navy">
              Alcohol consumption
            </p>

            <Segmented
              value={form.alcohol}
              options={[
                'None',
                'Occasional',
                'Weekly',
                'Daily',
              ]}
              onChange={(v) =>
                update('alcohol', v)
              }
            />
          </div>
        </div>
      </Card>

      {/* MEDICAL */}
      <Card className="p-6">
        <h3 className="mb-4 font-bold text-navy">
          Medical
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField
            id="sys"
            label="Systolic BP"
            value={form.systolic}
            onChange={(v) =>
              update('systolic', v)
            }
          />

          <NumberField
            id="dia"
            label="Diastolic BP"
            value={form.diastolic}
            onChange={(v) =>
              update('diastolic', v)
            }
          />

          <NumberField
            id="hr"
            label="Resting heart rate"
            value={form.heartRate}
            onChange={(v) =>
              update('heartRate', v)
            }
          />
        </div>

        <p className="mb-2 mt-5 text-sm font-semibold text-navy">
          Family history
        </p>

        <div className="flex flex-wrap gap-2">
          {familyOptions.map((item) => (
            <ToggleChip
              key={item}
              active={form.familyHistory?.includes(
                item,
              )}
              onClick={() =>
                toggleList(
                  'familyHistory',
                  item,
                )
              }
            >
              {item}
            </ToggleChip>
          ))}
        </div>

        <p className="mb-2 mt-5 text-sm font-semibold text-navy">
          Existing conditions
        </p>

        <div className="flex flex-wrap gap-2">
          {conditionOptions.map((item) => (
            <ToggleChip
              key={item}
              active={
                form.conditions?.includes(
                  item,
                ) ||
                (item === 'None' &&
                  !form.conditions?.length)
              }
              onClick={() =>
                item === 'None'
                  ? update('conditions', [])
                  : toggleList(
                      'conditions',
                      item,
                    )
              }
            >
              {item}
            </ToggleChip>
          ))}
        </div>
      </Card>

      {/* NUTRITION */}
      <Card className="p-6">
        <h3 className="mb-4 font-bold text-navy">
          Nutrition
        </h3>

        <div className="grid gap-5 sm:grid-cols-2">
          <Slider
            id="fv"
            label="Fruits / vegetables"
            min={0}
            max={8}
            value={form.fruitsVeg}
            unit="servings"
            onChange={(v) =>
              update('fruitsVeg', v)
            }
          />

          <div>
            <p className="mb-2 text-sm font-semibold text-navy">
              Processed food frequency
            </p>

            <Segmented
              value={form.processedFood}
              options={[
                'Rarely',
                'Sometimes',
                'Often',
              ]}
              onChange={(v) =>
                update(
                  'processedFood',
                  v,
                )
              }
            />
          </div>

          <div className="sm:col-span-2">
            <p className="mb-2 text-sm font-semibold text-navy">
              Sugar intake
            </p>

            <Segmented
              value={form.sugar}
              options={[
                'Low',
                'Moderate',
                'High',
              ]}
              onChange={(v) =>
                update('sugar', v)
              }
            />
          </div>
        </div>
      </Card>

      {/* ERROR */}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <p className="font-semibold">
            Save failed
          </p>

          <p className="mt-1">
            {error}
          </p>
        </div>
      ) : null}

      {/* SAVE BUTTON */}
      <Button
        type="submit"
        size="lg"
        disabled={saving}
      >
        {saving
          ? 'Saving...'
          : 'Save Health Profile'}
      </Button>
    </form>
  )
}

/* =========================================================
   NUMBER FIELD
========================================================= */

function NumberField({
  id,
  label,
  value,
  onChange,
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-sm font-semibold text-navy"
      >
        {label}
      </label>

      <input
        id={id}
        type="number"
        value={value ?? ''}
        onChange={(e) =>
          onChange(
            Number(e.target.value),
          )
        }
        className="h-11 w-full rounded-xl border border-line px-3 outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
      />
    </div>
  )
}

/* =========================================================
   SEGMENTED BUTTON
========================================================= */

function Segmented({
  value,
  options,
  onChange,
}) {
  return (
    <div
      className="flex flex-wrap gap-1 rounded-xl bg-canvas p-1"
      role="group"
    >
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() =>
            onChange(option)
          }
          className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
            value === option
              ? 'bg-white text-navy shadow-sm'
              : 'text-muted hover:text-navy'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

/* =========================================================
   TOGGLE CHIP
========================================================= */

function ToggleChip({
  active,
  onClick,
  children,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm font-semibold ${
        active
          ? 'border-teal bg-teal/10 text-teal'
          : 'border-line bg-white text-muted'
      }`}
    >
      {children}
    </button>
  )
}