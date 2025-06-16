import React, { useCallback, useEffect, useState } from 'react'
import { Theme, ThemeContext } from './ThemeContext'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('system')
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('light')

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }

  // Resolve actual theme based on current theme setting
  const resolveTheme = useCallback((currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme()
    }
    return currentTheme
  }, [])

  // Update theme in main process and local state
  const setTheme = async (newTheme: Theme) => {
    try {
      await window.api.theme.set(newTheme)
      setThemeState(newTheme)
    } catch (error) {
      console.error('Failed to set theme:', error)
    }
  }

  // Apply theme to document
  const applyTheme = (resolvedTheme: 'light' | 'dark') => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(resolvedTheme)
    setActualTheme(resolvedTheme)
  }

  // Initialize theme from main process
  useEffect(() => {
    const initTheme = async () => {
      try {
        const currentTheme = await window.api.theme.getCurrent()
        setThemeState(currentTheme)
        const resolved = resolveTheme(currentTheme)
        applyTheme(resolved)
      } catch (error) {
        console.error('Failed to get current theme:', error)
        // Fallback to system theme
        const systemTheme = getSystemTheme()
        applyTheme(systemTheme)
      }
    }

    initTheme()
  }, [resolveTheme])

  // Listen for theme changes from main process (e.g., from global shortcut)
  useEffect(() => {
    const removeListener = window.api.theme.onChanged((newTheme: string) => {
      const themeValue = newTheme as Theme
      setThemeState(themeValue)
      const resolved = resolveTheme(themeValue)
      applyTheme(resolved)
    })

    return removeListener
  }, [resolveTheme])

  // Listen for system theme changes when theme is set to 'system'
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const handleSystemThemeChange = () => {
      if (theme === 'system') {
        const systemTheme = getSystemTheme()
        applyTheme(systemTheme)
      }
    }

    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
    }
  }, [theme])

  // Update actual theme when theme setting changes
  useEffect(() => {
    const resolved = resolveTheme(theme)
    applyTheme(resolved)
  }, [resolveTheme, theme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, actualTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
