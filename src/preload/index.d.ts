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

export interface StorageAPI {
  get: <T = unknown>(key: string) => Promise<T | null>
  set: <T = unknown>(key: string, value: T) => Promise<void>
  remove: (key: string) => Promise<void>
  clear: () => Promise<void>
  has: (key: string) => Promise<boolean>
  getAll: () => Promise<Record<string, unknown>>
  setMultiple: (data: Record<string, unknown>) => Promise<void>
  removeMultiple: (keys: string[]) => Promise<void>
}

export interface API {
  theme: ThemeAPI
  shortcuts: ShortcutsAPI
  storage: StorageAPI
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: API
  }
}
