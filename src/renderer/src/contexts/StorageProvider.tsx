import React from 'react'
import { StorageContext, StorageContextType } from './StorageContext'

export function StorageProvider({ children }: { children: React.ReactNode }) {
  const storageAPI: StorageContextType = {
    get: async <T = unknown,>(key: string): Promise<T | null> => {
      try {
        return await window.api.storage.get<T>(key)
      } catch (error) {
        console.error('Failed to get storage value:', error)
        return null
      }
    },

    set: async <T = unknown,>(key: string, value: T): Promise<void> => {
      try {
        await window.api.storage.set(key, value)
      } catch (error) {
        console.error('Failed to set storage value:', error)
        throw error
      }
    },

    remove: async (key: string): Promise<void> => {
      try {
        await window.api.storage.remove(key)
      } catch (error) {
        console.error('Failed to remove storage value:', error)
        throw error
      }
    },

    clear: async (): Promise<void> => {
      try {
        await window.api.storage.clear()
      } catch (error) {
        console.error('Failed to clear storage:', error)
        throw error
      }
    },

    has: async (key: string): Promise<boolean> => {
      try {
        return await window.api.storage.has(key)
      } catch (error) {
        console.error('Failed to check storage key:', error)
        return false
      }
    },

    getAll: async (): Promise<Record<string, unknown>> => {
      try {
        return await window.api.storage.getAll()
      } catch (error) {
        console.error('Failed to get all storage values:', error)
        return {}
      }
    },

    setMultiple: async (data: Record<string, unknown>): Promise<void> => {
      try {
        await window.api.storage.setMultiple(data)
      } catch (error) {
        console.error('Failed to set multiple storage values:', error)
        throw error
      }
    },

    removeMultiple: async (keys: string[]): Promise<void> => {
      try {
        await window.api.storage.removeMultiple(keys)
      } catch (error) {
        console.error('Failed to remove multiple storage values:', error)
        throw error
      }
    }
  }

  return <StorageContext.Provider value={storageAPI}>{children}</StorageContext.Provider>
}
