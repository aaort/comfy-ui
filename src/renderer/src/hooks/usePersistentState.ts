import { useCallback, useEffect, useState } from 'react'
import { useStorage } from '../contexts/StorageContext'

/**
 * Hook for managing persistent state that automatically saves to storage
 * @param key - Storage key to use
 * @param defaultValue - Default value if no stored value exists
 * @returns [value, setValue] tuple similar to useState
 */
export function usePersistentState<T = unknown>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void] {
  const storage = useStorage()
  const [state, setState] = useState<T>(defaultValue)
  const [, setIsLoaded] = useState(false)

  // Load initial value from storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await storage.get<T>(key)
        if (storedValue !== null) {
          setState(storedValue)
        }
      } catch (error) {
        console.error(`Failed to load persistent state for key "${key}":`, error)
      } finally {
        setIsLoaded(true)
      }
    }

    loadValue()
  }, [key, storage])

  // Set value and save to storage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value

        // Save to storage (don't await to avoid blocking UI)
        storage.set(key, newValue).catch((error) => {
          console.error(`Failed to save persistent state for key "${key}":`, error)
        })

        return newValue
      })
    },
    [key, storage]
  )

  return [state, setValue]
}

/**
 * Hook for managing persistent state with immediate loading
 * Returns loading state to prevent rendering with default value
 */
export function usePersistentStateWithLoading<T = unknown>(
  key: string,
  defaultValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const storage = useStorage()
  const [state, setState] = useState<T>(defaultValue)
  const [isLoading, setIsLoading] = useState(true)

  // Load initial value from storage
  useEffect(() => {
    const loadValue = async () => {
      try {
        const storedValue = await storage.get<T>(key)
        if (storedValue !== null) {
          setState(storedValue)
        }
      } catch (error) {
        console.error(`Failed to load persistent state for key "${key}":`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadValue()
  }, [key, storage])

  // Set value and save to storage
  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newValue = typeof value === 'function' ? (value as (prev: T) => T)(prev) : value

        // Save to storage (don't await to avoid blocking UI)
        storage.set(key, newValue).catch((error) => {
          console.error(`Failed to save persistent state for key "${key}":`, error)
        })

        return newValue
      })
    },
    [key, storage]
  )

  return [state, setValue, isLoading]
}
