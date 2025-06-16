import { BrowserWindow, globalShortcut } from 'electron'

export type Theme = 'light' | 'dark' | 'system'

export interface ShortcutConfig {
  accelerator: string
  callback: () => void
  description?: string
}

export class GlobalShortcutService {
  private shortcuts: Map<string, ShortcutConfig> = new Map()
  private currentTheme: Theme = 'system'
  private mainWindow: BrowserWindow | null = null

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow
    this.setupDefaultShortcuts()
  }

  private setupDefaultShortcuts(): void {
    // Theme switcher shortcut
    this.registerShortcut('theme-switcher', {
      accelerator: 'CommandOrControl+Shift+S',
      callback: () => this.toggleTheme(),
      description: 'Toggle theme between light, dark, and system'
    })
  }

  registerShortcut(id: string, config: ShortcutConfig): boolean {
    try {
      // Unregister existing shortcut if it exists
      if (this.shortcuts.has(id)) {
        this.unregisterShortcut(id)
      }

      // Register the new shortcut
      const success = globalShortcut.register(config.accelerator, config.callback)

      if (success) {
        this.shortcuts.set(id, config)
        console.log(`Global shortcut registered: ${config.accelerator} (${id})`)
        return true
      } else {
        console.warn(`Failed to register global shortcut: ${config.accelerator} (${id})`)
        return false
      }
    } catch (error) {
      console.error(`Error registering shortcut ${id}:`, error)
      return false
    }
  }

  unregisterShortcut(id: string): boolean {
    const config = this.shortcuts.get(id)
    if (config) {
      globalShortcut.unregister(config.accelerator)
      this.shortcuts.delete(id)
      console.log(`Global shortcut unregistered: ${config.accelerator} (${id})`)
      return true
    }
    return false
  }

  unregisterAll(): void {
    globalShortcut.unregisterAll()
    this.shortcuts.clear()
    console.log('All global shortcuts unregistered')
  }

  private toggleTheme(): void {
    // Cycle through themes: system -> light -> dark -> system
    const themes: Theme[] = ['system', 'light', 'dark']
    const currentIndex = themes.indexOf(this.currentTheme)
    const nextIndex = (currentIndex + 1) % themes.length
    this.currentTheme = themes[nextIndex]

    console.log(`Theme switched to: ${this.currentTheme}`)

    // Notify renderer process about theme change
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      this.mainWindow.webContents.send('theme-changed', this.currentTheme)
    }
  }

  getCurrentTheme(): Theme {
    return this.currentTheme
  }

  setTheme(theme: Theme): void {
    if (theme !== this.currentTheme) {
      this.currentTheme = theme
      console.log(`Theme set to: ${this.currentTheme}`)

      // Notify renderer process about theme change
      if (this.mainWindow && !this.mainWindow.isDestroyed()) {
        this.mainWindow.webContents.send('theme-changed', this.currentTheme)
      }
    }
  }

  getRegisteredShortcuts(): Array<{ id: string; config: ShortcutConfig }> {
    return Array.from(this.shortcuts.entries()).map(([id, config]) => ({
      id,
      config
    }))
  }

  isShortcutRegistered(accelerator: string): boolean {
    return globalShortcut.isRegistered(accelerator)
  }
}
