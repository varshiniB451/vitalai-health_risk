import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { api, getToken, setToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage('vitalai.user', null)
  const [loading, setLoading] = useState(Boolean(getToken()))

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return undefined
    }

    let active = true
    api.me()
      .then((me) => {
        if (active) setUser({ fullName: me.full_name, email: me.email, id: me.id })
      })
      .catch((error) => {
        if (active) {
          console.error('Session validation failed:', error)
          setToken(null)
          setUser(null)
        }
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [setUser])

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user && getToken()),
      login: async ({ email, password, fullName }) => {
        const result = await api.login({ email, password })
        setToken(result.access_token)
        const me = await api.me()
        setUser({
          fullName: me.full_name || fullName || 'Alex Rivera',
          email: me.email,
          id: me.id,
        })
        return me
      },
      register: async ({ fullName, email, password }) => {
        await api.register({ full_name: fullName, email, password })
        const result = await api.login({ email, password })
        setToken(result.access_token)
        const me = await api.me()
        setUser({ fullName: me.full_name, email: me.email, id: me.id })
        return me
      },
      enterLocalSession: () => {
        setUser(null)
        throw new Error('Google sign-in is not connected. Use email and password to access the API.')
      },
      logout: () => {
        setToken(null)
        setUser(null)
      },
    }),
    [loading, user, setUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
