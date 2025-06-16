import { createContext, useContext } from 'react'

export interface StorageContextType {
  get: <T = unknown>(key: string) => Promise<T | null>
  set: <T = unknown>(key: string, value: T) => Promise<void>
  remove: (key: string) => Promise<void>
  clear: () => Promise<void>
  has: (key: string) => Promise<boolean>
  getAll: () => Promise<Record<string, unknown>>
  setMultiple: (data: Record<string, unknown>) => Promise<void>
  removeMultiple: (keys: string[]) => Promise<void>
}

export const StorageContext = createContext<StorageContextType | undefined>(undefined)

export function useStorage() {
  const context = useContext(StorageContext)
  if (context === undefined) {
    throw new Error('useStorage must be used within a StorageProvider')
  }
  return context
}
