import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { screen } from 'electron/main'
import { join } from 'path'
import icon from '../../resources/icon.png?asset'
import { GlobalShortcutService, Theme } from './services/globalShortcuts'

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

  ipcMain.handle('set-theme', (_, theme: Theme) => {
    globalShortcutService?.setTheme(theme)
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

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
