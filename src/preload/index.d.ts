import { ElectronAPI } from '@electron-toolkit/preload'

export interface ThemeAPI {
  getCurrent: () => Promise<'light' | 'dark' | 'system'>
  set: (theme: 'light' | 'dark' | 'system') => Promise<'light' | 'dark' | 'system'>
  onChanged: (callback: (theme: string) => void) => () => void
}

export interface ShortcutsAPI {
  getRegistered: () => Promise<
    Array<{ id: string; config: { accelerator: string; description?: string } }>
  >
  register: (id: string, accelerator: string, description?: string) => Promise<boolean>
  unregister: (id: string) => Promise<boolean>
  onTriggered: (callback: (shortcutId: string) => void) => () => void
}

export interface API {
  theme: ThemeAPI
  shortcuts: ShortcutsAPI
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
