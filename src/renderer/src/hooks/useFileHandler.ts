import { useCallback } from 'react'

interface FileResult {
  success: boolean
  data?: string
  path?: string
  error?: string
}

interface UseFileHandlerReturn {
  openFileDialog: (options?: {
    title?: string
    filters?: Array<{ name: string; extensions: string[] }>
  }) => Promise<FileResult | null>
  handleDrop: (files: FileList) => Promise<FileResult | null>
  handleFileRead: (file: File) => Promise<FileResult>
}

export function useFileHandler(): UseFileHandlerReturn {
  const openFileDialog = useCallback(
    async (options?: {
      title?: string
      filters?: Array<{ name: string; extensions: string[] }>
    }): Promise<FileResult | null> => {
      try {
        const result = await window.api.file.showOpenDialog({
          title: options?.title || 'Select Image',
          filters: options?.filters || [
            {
              name: 'Images',
              extensions: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg']
            }
          ],
          properties: ['openFile']
        })

        if (result.canceled || result.filePaths.length === 0) {
          return null
        }

        const filePath = result.filePaths[0]
        const fileResult = await window.api.file.readFile(filePath)

        return fileResult
      } catch (error) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Failed to open file'
        }
      }
    },
    []
  )

  const handleFileRead = useCallback(async (file: File): Promise<FileResult> => {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (e) => {
        const result = e.target?.result
        if (typeof result === 'string') {
          resolve({
            success: true,
            data: result,
            path: file.name
          })
        } else {
          resolve({
            success: false,
            error: 'Failed to read file'
          })
        }
      }

      reader.onerror = () => {
        resolve({
          success: false,
          error: `Failed to read file: ${file.name}. The file may be corrupted.`
        })
      }

      reader.readAsDataURL(file)
    })
  }, [])

  const handleDrop = useCallback(
    async (files: FileList): Promise<FileResult | null> => {
      if (files.length === 0) return null

      const file = files[0]

      // Check if it's an image file
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: `File type "${file.type || 'unknown'}" is not supported. Please select an image file (JPG, PNG, GIF, WebP, BMP, SVG).`
        }
      }

      // Check file size (limit to 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        return {
          success: false,
          error: `File size (${(file.size / 1024 / 1024).toFixed(1)}MB) exceeds the 10MB limit.`
        }
      }

      return await handleFileRead(file)
    },
    [handleFileRead]
  )

  return {
    openFileDialog,
    handleDrop,
    handleFileRead
  }
}
