import { useCallback, useEffect, useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value) => {
      setStoredValue((prev) => {
        const next = typeof value === 'function' ? value(prev) : value
        try {
          window.localStorage.setItem(key, JSON.stringify(next))
        } catch {
          /* ignore quota / private mode */
        }
        return next
      })
    },
    [key],
  )

  useEffect(() => {
    const onStorage = (event) => {
      if (event.key !== key) return
      try {
        setStoredValue(event.newValue ? JSON.parse(event.newValue) : initialValue)
      } catch {
        setStoredValue(initialValue)
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [key, initialValue])

  return [storedValue, setValue]
}
