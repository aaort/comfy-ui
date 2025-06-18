import { Keyboard, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '../../lib/utils'

interface Shortcut {
  id: string
  config: {
    accelerator: string
    description?: string
  }
}

interface ShortcutsInfoProps {
  isOpen: boolean
  onClose: () => void
}

export function ShortcutsInfo({ isOpen, onClose }: ShortcutsInfoProps) {
  const [shortcuts, setShortcuts] = useState<Shortcut[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      loadShortcuts()
    }
  }, [isOpen])

  const loadShortcuts = async () => {
    setLoading(true)
    try {
      const registeredShortcuts = await window.api.shortcuts.getRegistered()
      setShortcuts(registeredShortcuts)
    } catch (error) {
      console.error('Failed to load shortcuts:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatAccelerator = (accelerator: string) => {
    return accelerator
      .replace(/CommandOrControl/g, '⌘/Ctrl')
      .replace(/Command/g, '⌘')
      .replace(/Control/g, 'Ctrl')
      .replace(/Shift/g, '⇧')
      .replace(/Alt/g, '⌥')
      .replace(/Option/g, '⌥')
      .replace(/\+/g, ' + ')
  }

  const getShortcutName = (id: string) => {
    switch (id) {
      case 'theme-switcher':
        return 'Theme Switcher'
      default:
        return id
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ')
    }
  }

  const getShortcutDescription = (shortcut: Shortcut) => {
    if (shortcut.config.description) {
      return shortcut.config.description
    }

    switch (shortcut.id) {
      case 'theme-switcher':
        return 'Toggle between light, dark, and system themes'
      default:
        return 'No description available'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md mx-4">
        <div className="bg-card border border-border rounded-lg shadow-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Global Shortcuts</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
          </div>

          {/* Content */}
          <div className="p-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : shortcuts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No global shortcuts registered
              </div>
            ) : (
              <div className="space-y-3">
                {shortcuts.map((shortcut) => (
                  <div
                    key={shortcut.id}
                    className="flex items-start justify-between p-3 rounded-md bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm">{getShortcutName(shortcut.id)}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {getShortcutDescription(shortcut)}
                      </p>
                    </div>
                    <div className="ml-3 flex-shrink-0">
                      <kbd
                        className={cn(
                          'inline-flex items-center rounded border border-border',
                          'bg-muted px-2 py-1 text-xs font-mono'
                        )}
                      >
                        {formatAccelerator(shortcut.config.accelerator)}
                      </kbd>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-border">
            <p className="text-xs text-muted-foreground">
              These shortcuts work globally, even when the app is not focused.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
