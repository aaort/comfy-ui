import { app } from 'electron'
import { promises as fs } from 'fs'
import { join } from 'path'

export interface StorageData {
  [key: string]: unknown
}

export class StorageService {
  private storageFilePath: string
  private cache: StorageData = {}
  private isInitialized = false

  constructor() {
    // Use userData path which resolves to ~/Library/Application Support/[app-name] on macOS
    const userDataPath = app.getPath('userData')
    this.storageFilePath = join(userDataPath, 'app-settings.json')
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return

    try {
      // Ensure the userData directory exists
      const userDataPath = app.getPath('userData')
      await fs.mkdir(userDataPath, { recursive: true })

      // Check if file exists, create if not
      try {
        await fs.access(this.storageFilePath)
      } catch {
        // File doesn't exist, create empty storage
        await this.saveToFile({})
      }

      // Load existing data
      const data = await fs.readFile(this.storageFilePath, 'utf-8')
      this.cache = JSON.parse(data) || {}
      this.isInitialized = true
      console.log('Storage initialized at:', this.storageFilePath)
    } catch (error) {
      console.error('Failed to initialize storage:', error)
      // Initialize with empty cache on error
      this.cache = {}
      this.isInitialized = true
    }
  }

  private async saveToFile(data: StorageData): Promise<void> {
    try {
      await fs.writeFile(this.storageFilePath, JSON.stringify(data, null, 2), 'utf-8')
    } catch (error) {
      console.error('Failed to save storage file:', error)
      throw error
    }
  }

  async get<T = unknown>(key: string): Promise<T | null> {
    await this.initialize()
    return (this.cache[key] as T) ?? null
  }

  async set<T = unknown>(key: string, value: T): Promise<void> {
    await this.initialize()
    this.cache[key] = value
    await this.saveToFile(this.cache)
  }

  async remove(key: string): Promise<void> {
    await this.initialize()
    delete this.cache[key]
    await this.saveToFile(this.cache)
  }

  async clear(): Promise<void> {
    await this.initialize()
    this.cache = {}
    await this.saveToFile(this.cache)
  }

  async has(key: string): Promise<boolean> {
    await this.initialize()
    return key in this.cache
  }

  async getAll(): Promise<StorageData> {
    await this.initialize()
    return { ...this.cache }
  }

  async setMultiple(data: StorageData): Promise<void> {
    await this.initialize()
    Object.assign(this.cache, data)
    await this.saveToFile(this.cache)
  }

  async removeMultiple(keys: string[]): Promise<void> {
    await this.initialize()
    keys.forEach((key) => delete this.cache[key])
    await this.saveToFile(this.cache)
  }
}

// Export singleton instance
export const storageService = new StorageService()
