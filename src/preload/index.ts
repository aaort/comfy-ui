import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'

// Custom APIs for renderer
const api = {
  // Theme API
  theme: {
    getCurrent: () => ipcRenderer.invoke('get-current-theme'),
    set: (theme: 'light' | 'dark' | 'system') => ipcRenderer.invoke('set-theme', theme),
    onChanged: (callback: (theme: string) => void) => {
      const handler = (_, theme) => callback(theme)
      ipcRenderer.on('theme-changed', handler)
      return () => ipcRenderer.removeListener('theme-changed', handler)
    }
  },

  // Global shortcuts API
  shortcuts: {
    getRegistered: () => ipcRenderer.invoke('get-registered-shortcuts'),
    register: (id: string, accelerator: string, description?: string) =>
      ipcRenderer.invoke('register-shortcut', id, accelerator, description),
    unregister: (id: string) => ipcRenderer.invoke('unregister-shortcut', id),
    onTriggered: (callback: (shortcutId: string) => void) => {
      const handler = (_, shortcutId) => callback(shortcutId)
      ipcRenderer.on('shortcut-triggered', handler)
      return () => ipcRenderer.removeListener('shortcut-triggered', handler)
    }
  },

  // Storage API
  storage: {
    get: <T = unknown>(key: string): Promise<T | null> => ipcRenderer.invoke('storage-get', key),
    set: <T = unknown>(key: string, value: T): Promise<void> =>
      ipcRenderer.invoke('storage-set', key, value),
    remove: (key: string): Promise<void> => ipcRenderer.invoke('storage-remove', key),
    clear: (): Promise<void> => ipcRenderer.invoke('storage-clear'),
    has: (key: string): Promise<boolean> => ipcRenderer.invoke('storage-has', key),
    getAll: (): Promise<Record<string, unknown>> => ipcRenderer.invoke('storage-get-all'),
    setMultiple: (data: Record<string, unknown>): Promise<void> =>
      ipcRenderer.invoke('storage-set-multiple', data),
    removeMultiple: (keys: string[]): Promise<void> =>
      ipcRenderer.invoke('storage-remove-multiple', keys)
  }
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
