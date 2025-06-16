import { useEffect, useRef } from 'react'

export function useGlobalShortcuts() {
  const handlersRef = useRef<Map<string, () => void>>(new Map())

  // Register a shortcut handler
  const registerHandler = (id: string, handler: () => void) => {
    handlersRef.current.set(id, handler)
  }

  // Unregister a shortcut handler
  const unregisterHandler = (id: string) => {
    handlersRef.current.delete(id)
  }

  // Register a new global shortcut
  const registerShortcut = async (
    id: string,
    accelerator: string,
    handler: () => void,
    description?: string
  ): Promise<boolean> => {
    try {
      const success = await window.api.shortcuts.register(id, accelerator, description)
      if (success) {
        registerHandler(id, handler)
      }
      return success
    } catch (error) {
      console.error(`Failed to register shortcut ${id}:`, error)
      return false
    }
  }

  // Unregister a global shortcut
  const unregisterShortcut = async (id: string): Promise<boolean> => {
    try {
      const success = await window.api.shortcuts.unregister(id)
      if (success) {
        unregisterHandler(id)
      }
      return success
    } catch (error) {
      console.error(`Failed to unregister shortcut ${id}:`, error)
      return false
    }
  }

  // Get all registered shortcuts
  const getRegisteredShortcuts = async () => {
    try {
      return await window.api.shortcuts.getRegistered()
    } catch (error) {
      console.error('Failed to get registered shortcuts:', error)
      return []
    }
  }

  // Listen for shortcut triggers from main process
  useEffect(() => {
    const removeListener = window.api.shortcuts.onTriggered((shortcutId: string) => {
      const handler = handlersRef.current.get(shortcutId)
      if (handler) {
        handler()
      } else {
        console.warn(`No handler found for shortcut: ${shortcutId}`)
      }
    })

    return removeListener
  }, [])

  return {
    registerShortcut,
    unregisterShortcut,
    getRegisteredShortcuts,
    registerHandler,
    unregisterHandler
  }
}
