import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@': resolve('src/renderer/src'),
        '@/components': resolve('src/renderer/src/components'),
        '@/lib': resolve('src/renderer/src/lib'),
        '@/hooks': resolve('src/renderer/src/hooks'),
        '@/ui': resolve('src/renderer/src/components/ui')
      }
    },
    plugins: [react()],
    css: {
      postcss: './postcss.config.js'
    }
  }
})
