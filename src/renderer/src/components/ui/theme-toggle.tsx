import { useTheme } from '@/contexts/ThemeContext'
import { cn } from '@/lib/utils'
import { Monitor, Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
  showLabel?: boolean
}

export function ThemeToggle({ className, showLabel = false }: ThemeToggleProps) {
  const { theme, setTheme, actualTheme } = useTheme()

  const toggleTheme = () => {
    const themes = ['system', 'light', 'dark'] as const
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    setTheme(themes[nextIndex])
  }

  const getIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      case 'system':
        return <Monitor className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  const getLabel = () => {
    switch (theme) {
      case 'light':
        return 'Light'
      case 'dark':
        return 'Dark'
      case 'system':
        return 'System'
      default:
        return 'System'
    }
  }

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md p-2',
        'bg-background text-foreground hover:bg-muted',
        'border border-border',
        'transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        className
      )}
      title={`Current theme: ${getLabel()} (${actualTheme}). Click to cycle themes.`}
    >
      {getIcon()}
      {showLabel && <span className="text-sm font-medium">{getLabel()}</span>}
    </button>
  )
}
