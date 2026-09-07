import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell,
  ChevronRight,
  CircleUserRound,
  LogOut,
  Mail,
  Moon,
  Palette,
  Shield,
  Sun,
  Trash2,
  Lock,
  Check,
  Loader2,
} from 'lucide-react'

import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'


/* =========================================================
   DEFAULT SETTINGS
========================================================= */

const defaultSettings = {
  notifications: true,
  emailUpdates: true,
  weeklySummary: true,
  healthReminders: true,
  theme: 'light',
  dataSharing: false,
}


/* =========================================================
   FRONTEND → BACKEND SETTINGS
========================================================= */

function toApiSettings(settings) {
  return {
    notifications: Boolean(
      settings.notifications,
    ),

    email_updates: Boolean(
      settings.emailUpdates,
    ),

    weekly_summary: Boolean(
      settings.weeklySummary,
    ),

    health_reminders: Boolean(
      settings.healthReminders,
    ),

    theme: settings.theme || 'light',

    data_sharing: Boolean(
      settings.dataSharing,
    ),
  }
}


/* =========================================================
   BACKEND → FRONTEND SETTINGS
========================================================= */

function fromApiSettings(data) {
  if (!data) {
    return defaultSettings
  }

  return {
    notifications:
      data.notifications ?? true,

    emailUpdates:
      data.email_updates ?? true,

    weeklySummary:
      data.weekly_summary ?? true,

    healthReminders:
      data.health_reminders ?? true,

    theme:
      data.theme || 'light',

    dataSharing:
      data.data_sharing ?? false,
  }
}


/* =========================================================
   SETTINGS PAGE
========================================================= */

export default function Settings() {
  const navigate = useNavigate()

  const {
    user,
    logout,
  } = useAuth()


  /* -------------------------------------------------------
     STATE
  ------------------------------------------------------- */

  const [settings, setSettings] =
    useState(defaultSettings)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [savedMessage, setSavedMessage] =
    useState(false)

  const [errorMessage, setErrorMessage] =
    useState('')


  /* =======================================================
     LOAD SETTINGS FROM BACKEND
  ======================================================= */

  useEffect(() => {
    let active = true

    async function loadSettings() {
      setLoading(true)
      setErrorMessage('')

      try {
        const data =
          await api.getSettings()

        if (!active) return

        setSettings(
          fromApiSettings(data),
        )
      } catch (error) {
        console.error(
          'Failed to load settings:',
          error,
        )

        if (!active) return

        setErrorMessage(
          'Could not load settings from the server. Showing default preferences.',
        )
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    loadSettings()

    return () => {
      active = false
    }
  }, [])


  /* =======================================================
     UPDATE SETTING
  ======================================================= */

  const updateSetting = async (
    key,
    value,
  ) => {
    if (saving) return

    const previousSettings = settings

    const nextSettings = {
      ...settings,
      [key]: value,
    }

    // Update UI immediately
    setSettings(nextSettings)

    setSaving(true)
    setSavedMessage(false)
    setErrorMessage('')

    try {
      const updated =
        await api.updateSettings(
          toApiSettings(
            nextSettings,
          ),
        )

      // Use backend response as source of truth
      if (updated) {
        setSettings(
          fromApiSettings(updated),
        )
      }

      setSavedMessage(true)

      window.setTimeout(() => {
        setSavedMessage(false)
      }, 1800)
    } catch (error) {
      console.error(
        'Failed to save settings:',
        error,
      )

      // Restore previous UI state
      setSettings(
        previousSettings,
      )

      setErrorMessage(
        error?.detail ||
          'Failed to save settings. Please check that the backend is running.',
      )
    } finally {
      setSaving(false)
    }
  }


  /* =======================================================
     LOGOUT
  ======================================================= */

  const handleLogout = () => {
    try {
      if (
        typeof logout ===
        'function'
      ) {
        logout()
      } else {
        localStorage.removeItem(
          'vitalai.token',
        )

        localStorage.removeItem(
          'access_token',
        )

        localStorage.removeItem(
          'token',
        )
      }
    } catch {
      localStorage.removeItem(
        'vitalai.token',
      )

      localStorage.removeItem(
        'access_token',
      )

      localStorage.removeItem(
        'token',
      )
    }

    navigate('/login')
  }


  /* =======================================================
     CLEAR LOCAL DATA
  ======================================================= */

  const handleDeleteLocalData = () => {
    const confirmed =
      window.confirm(
        'Are you sure you want to clear your saved VitalAI preferences from this device?',
      )

    if (!confirmed) return

    localStorage.removeItem(
      'vitalai_settings',
    )

    localStorage.removeItem(
      'vitalai_notifications',
    )

    setSavedMessage(true)

    window.setTimeout(() => {
      setSavedMessage(false)
    }, 1800)
  }


  /* =======================================================
     INITIAL
  ======================================================= */

  const initials = (
    user?.fullName ||
    'Alex Rivera'
  )
    .trim()
    .slice(0, 1)
    .toUpperCase()


  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="min-h-full bg-slate-50 p-4 md:p-6 lg:p-8">
      <div className="mx-auto max-w-5xl">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="mb-1 text-sm font-medium text-teal-600">
              Account preferences
            </p>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              Settings
            </h1>

            <p className="mt-1 max-w-xl text-sm text-slate-500">
              Manage your VitalAI preferences,
              notifications, privacy, and
              account settings.
            </p>
          </div>


          {/* STATUS */}

          <div className="flex items-center gap-2">

            {saving && (
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm">
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Saving...
              </div>
            )}

            {!saving &&
              savedMessage && (
                <div className="flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2.5 text-sm font-semibold text-teal-700">
                  <Check size={16} />

                  Settings saved
                </div>
              )}

          </div>
        </div>


        {/* =================================================
            ERROR
        ================================================= */}

        {errorMessage && (
          <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {errorMessage}
          </div>
        )}


        {/* =================================================
            PROFILE
        ================================================= */}

        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 md:px-6">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-teal-50 text-teal-600">
                <CircleUserRound
                  size={20}
                />
              </div>

              <div>
                <h2 className="font-bold text-slate-900">
                  Profile
                </h2>

                <p className="text-xs text-slate-500">
                  Your VitalAI account
                  information
                </p>
              </div>

            </div>

          </div>


          <div className="grid gap-4 p-5 md:grid-cols-2 md:p-6">

            {/* NAME */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Full name
              </p>

              <p className="font-semibold text-slate-800">
                {user?.fullName ||
                  'Alex Rivera'}
              </p>

            </div>


            {/* EMAIL */}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

              <p className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                Email address
              </p>

              <p className="truncate font-semibold text-slate-800">
                {user?.email ||
                  'alex@vitalai.demo'}
              </p>

            </div>

          </div>

        </section>


        {/* =================================================
            NOTIFICATIONS
        ================================================= */}

        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 md:px-6">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600">
                <Bell size={20} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Notifications
                </h2>

                <p className="text-xs text-slate-500">
                  Control how VitalAI keeps
                  you informed
                </p>

              </div>

            </div>

          </div>


          <div className="divide-y divide-slate-100">

            <SettingToggle
              title="Push notifications"
              description="Receive important health reminders and updates."
              checked={
                settings.notifications
              }
              disabled={
                loading || saving
              }
              onChange={(value) =>
                updateSetting(
                  'notifications',
                  value,
                )
              }
            />


            <SettingToggle
              title="Email updates"
              description="Receive useful health insights and account updates by email."
              checked={
                settings.emailUpdates
              }
              disabled={
                loading || saving
              }
              onChange={(value) =>
                updateSetting(
                  'emailUpdates',
                  value,
                )
              }
            />


            <SettingToggle
              title="Weekly health summary"
              description="Get a weekly overview of your health progress."
              checked={
                settings.weeklySummary
              }
              disabled={
                loading || saving
              }
              onChange={(value) =>
                updateSetting(
                  'weeklySummary',
                  value,
                )
              }
            />


            <SettingToggle
              title="Health reminders"
              description="Receive reminders for goals, activity, sleep, and hydration."
              checked={
                settings.healthReminders
              }
              disabled={
                loading || saving
              }
              onChange={(value) =>
                updateSetting(
                  'healthReminders',
                  value,
                )
              }
            />

          </div>

        </section>


        {/* =================================================
            APPEARANCE
        ================================================= */}

        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 md:px-6">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-50 text-purple-600">
                <Palette size={20} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Appearance
                </h2>

                <p className="text-xs text-slate-500">
                  Choose how VitalAI looks
                  on your device
                </p>

              </div>

            </div>

          </div>


          <div className="p-5 md:p-6">

            <p className="mb-3 text-sm font-semibold text-slate-800">
              Theme
            </p>


            <div className="grid gap-3 sm:grid-cols-3">

              <ThemeButton
                icon={
                  <Sun size={18} />
                }
                title="Light"
                active={
                  settings.theme ===
                  'light'
                }
                disabled={
                  loading || saving
                }
                onClick={() =>
                  updateSetting(
                    'theme',
                    'light',
                  )
                }
              />


              <ThemeButton
                icon={
                  <Moon size={18} />
                }
                title="Dark"
                active={
                  settings.theme ===
                  'dark'
                }
                disabled={
                  loading || saving
                }
                onClick={() =>
                  updateSetting(
                    'theme',
                    'dark',
                  )
                }
              />


              <ThemeButton
                icon={
                  <Palette size={18} />
                }
                title="System"
                active={
                  settings.theme ===
                  'system'
                }
                disabled={
                  loading || saving
                }
                onClick={() =>
                  updateSetting(
                    'theme',
                    'system',
                  )
                }
              />

            </div>

          </div>

        </section>


        {/* =================================================
            PRIVACY
        ================================================= */}

        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 md:px-6">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-600">
                <Shield size={20} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Privacy & Data
                </h2>

                <p className="text-xs text-slate-500">
                  Control how your information
                  is handled
                </p>

              </div>

            </div>

          </div>


          <div className="divide-y divide-slate-100">

            <SettingToggle
              title="Anonymous data sharing"
              description="Help improve VitalAI by sharing anonymized usage information."
              checked={
                settings.dataSharing
              }
              disabled={
                loading || saving
              }
              onChange={(value) =>
                updateSetting(
                  'dataSharing',
                  value,
                )
              }
            />


            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 md:px-6"
              onClick={() =>
                window.alert(
                  'VitalAI only uses your health information to provide the features shown in this prototype. This application is for educational and demonstration purposes.',
                )
              }
            >

              <div className="flex items-start gap-3">

                <div className="mt-0.5 text-slate-400">
                  <Lock size={18} />
                </div>

                <div>

                  <p className="text-sm font-semibold text-slate-800">
                    Privacy information
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Learn how your health
                    information is handled.
                  </p>

                </div>

              </div>


              <ChevronRight
                size={17}
                className="shrink-0 text-slate-400"
              />

            </button>

          </div>

        </section>


        {/* =================================================
            SECURITY
        ================================================= */}

        <section className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          <div className="border-b border-slate-100 px-5 py-4 md:px-6">

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-600">
                <Lock size={20} />
              </div>

              <div>

                <h2 className="font-bold text-slate-900">
                  Security
                </h2>

                <p className="text-xs text-slate-500">
                  Keep your account secure
                </p>

              </div>

            </div>

          </div>


          <div className="divide-y divide-slate-100">

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/health-profile',
                )
              }
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 md:px-6"
            >

              <div>

                <p className="text-sm font-semibold text-slate-800">
                  Manage personal
                  information
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Update your health
                  profile and personal
                  details.
                </p>

              </div>


              <ChevronRight
                size={17}
                className="shrink-0 text-slate-400"
              />

            </button>


            <button
              type="button"
              onClick={() =>
                navigate('/login')
              }
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-slate-50 md:px-6"
            >

              <div className="flex items-start gap-3">

                <Mail
                  size={18}
                  className="mt-0.5 text-slate-400"
                />

                <div>

                  <p className="text-sm font-semibold text-slate-800">
                    Account access
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Return to the authentication
                    screen.
                  </p>

                </div>

              </div>


              <ChevronRight
                size={17}
                className="shrink-0 text-slate-400"
              />

            </button>

          </div>

        </section>


        {/* =================================================
            ACCOUNT ACTIONS
        ================================================= */}

        <section className="mb-5 overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">

          <div className="border-b border-red-100 px-5 py-4 md:px-6">

            <h2 className="font-bold text-red-700">
              Account actions
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              These actions affect your current
              device or session.
            </p>

          </div>


          <div className="divide-y divide-red-100">

            {/* LOGOUT */}

            <button
              type="button"
              onClick={
                handleLogout
              }
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-red-50 md:px-6"
            >

              <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600">
                <LogOut size={17} />
              </div>

              <div>

                <p className="text-sm font-semibold text-red-700">
                  Log out
                </p>

                <p className="text-xs text-slate-500">
                  Sign out of your VitalAI
                  account.
                </p>

              </div>

            </button>


            {/* CLEAR LOCAL */}

            <button
              type="button"
              onClick={
                handleDeleteLocalData
              }
              className="flex w-full items-center gap-3 px-5 py-4 text-left transition hover:bg-red-50 md:px-6"
            >

              <div className="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600">
                <Trash2 size={17} />
              </div>

              <div>

                <p className="text-sm font-semibold text-red-700">
                  Clear local preferences
                </p>

                <p className="text-xs text-slate-500">
                  Remove old saved preference
                  data from this device.
                </p>

              </div>

            </button>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="pb-6 text-center">

          <p className="text-xs text-slate-400">
            VitalAI · Health Digital Twin
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            Risk estimates are illustrative
            and are not medical advice.
          </p>

        </div>

      </div>
    </div>
  )
}


/* =========================================================
   TOGGLE COMPONENT
========================================================= */

function SettingToggle({
  title,
  description,
  checked,
  disabled = false,
  onChange,
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-4 md:px-6 ${
        disabled
          ? 'opacity-70'
          : ''
      }`}
    >

      <div className="min-w-0">

        <p className="text-sm font-semibold text-slate-800">
          {title}
        </p>

        <p className="mt-0.5 text-xs leading-5 text-slate-500">
          {description}
        </p>

      </div>


      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() =>
          onChange(!checked)
        }
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${
          checked
            ? 'bg-teal-500'
            : 'bg-slate-300'
        } ${
          disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
        }`}
      >

        <span
          className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
            checked
              ? 'left-6'
              : 'left-1'
          }`}
        />

      </button>

    </div>
  )
}


/* =========================================================
   THEME BUTTON
========================================================= */

function ThemeButton({
  icon,
  title,
  active,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
        active
          ? 'border-teal-400 bg-teal-50 text-teal-700 ring-2 ring-teal-100'
          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
      } ${
        disabled
          ? 'cursor-not-allowed opacity-70'
          : ''
      }`}
    >

      {icon}

      {title}

      {active && (
        <Check size={15} />
      )}

    </button>
  )
}