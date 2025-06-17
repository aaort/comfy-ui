import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron'
import { screen } from 'electron/main'
import { readFile } from 'fs/promises'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { GlobalShortcutService, Theme } from './services/globalShortcuts'
import { storageService } from './services/storageService'

let globalShortcutService: GlobalShortcutService | null = null

function createWindow(): void {
  const { workArea } = screen.getPrimaryDisplay()
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: workArea.width,
    height: workArea.height,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // Initialize global shortcut service
  globalShortcutService = new GlobalShortcutService(mainWindow)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  // Theme-related IPC handlers
  ipcMain.handle('get-current-theme', () => {
    return globalShortcutService?.getCurrentTheme() || 'system'
  })

  ipcMain.handle('set-theme', async (_, theme: Theme) => {
    await globalShortcutService?.setTheme(theme)
    return theme
  })

  // Global shortcuts IPC handlers
  ipcMain.handle('get-registered-shortcuts', () => {
    return globalShortcutService?.getRegisteredShortcuts() || []
  })

  ipcMain.handle(
    'register-shortcut',
    (_, id: string, accelerator: string, description?: string) => {
      if (!globalShortcutService) return false

      return globalShortcutService.registerShortcut(id, {
        accelerator,
        callback: () => {
          // Send shortcut event to renderer
          const windows = BrowserWindow.getAllWindows()
          windows.forEach((window) => {
            if (!window.isDestroyed()) {
              window.webContents.send('shortcut-triggered', id)
            }
          })
        },
        description
      })
    }
  )

  ipcMain.handle('unregister-shortcut', (_, id: string) => {
    return globalShortcutService?.unregisterShortcut(id) || false
  })

  // Storage service IPC handlers
  ipcMain.handle('storage-get', async (_, key: string) => {
    return await storageService.get(key)
  })

  ipcMain.handle('storage-set', async (_, key: string, value: unknown) => {
    await storageService.set(key, value)
    return true
  })

  ipcMain.handle('storage-remove', async (_, key: string) => {
    await storageService.remove(key)
    return true
  })

  ipcMain.handle('storage-clear', async () => {
    await storageService.clear()
    return true
  })

  ipcMain.handle('storage-has', async (_, key: string) => {
    return await storageService.has(key)
  })

  ipcMain.handle('storage-get-all', async () => {
    return await storageService.getAll()
  })

  ipcMain.handle('storage-set-multiple', async (_, data: Record<string, unknown>) => {
    await storageService.setMultiple(data)
    return true
  })

  ipcMain.handle('storage-remove-multiple', async (_, keys: string[]) => {
    await storageService.removeMultiple(keys)
    return true
  })

  // File dialog IPC handlers
  ipcMain.handle('show-open-dialog', async (_, options) => {
    const result = await dialog.showOpenDialog(options)
    return result
  })

  ipcMain.handle('read-file', async (_, filePath: string) => {
    try {
      const data = await readFile(filePath)
      return {
        success: true,
        data: `data:${getFileType(filePath)};base64,${data.toString('base64')}`,
        path: filePath
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Clean up global shortcuts when app is quitting
app.on('will-quit', () => {
  globalShortcutService?.unregisterAll()
})

// Helper function to get MIME type from file extension
function getFileType(filePath: string): string {
  const ext = filePath.toLowerCase().split('.').pop()
  switch (ext) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    case 'gif':
      return 'image/gif'
    case 'webp':
      return 'image/webp'
    case 'bmp':
      return 'image/bmp'
    case 'svg':
      return 'image/svg+xml'
    default:
      return 'application/octet-stream'
  }
}

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
