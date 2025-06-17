import { AlertCircle, FileImage, Upload } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Handle, NodeProps, Position, useReactFlow } from 'reactflow'
import { useFileHandler } from '../../hooks/useFileHandler'
import { cn } from '../../lib/utils'
import { ImageInputNodeData } from '../../types'

export default function ImageInputNode({ data, selected, id }: NodeProps<ImageInputNodeData>) {
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { handleDrop } = useFileHandler()
  const { getNodes, setNodes } = useReactFlow()

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Check if the dragged items contain files
    const hasFiles = Array.from(e.dataTransfer.types).includes('Files')
    if (hasFiles) {
      setIsDragOver(true)
      setError(null)
    }
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Only hide drag overlay if we're leaving the entire node area
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY

    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setIsDragOver(false)
    }
  }, [])

  const handleDropEvent = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      setError(null)

      const files = e.dataTransfer.files
      if (files.length === 0) return

      if (files.length > 1) {
        setError('Please drop only one file at a time')
        return
      }

      setIsUploading(true)

      try {
        const result = await handleDrop(files)
        if (result?.success && result.data) {
          const nodes = getNodes()
          setNodes(
            nodes.map((node) =>
              node.id === id
                ? {
                    ...node,
                    data: {
                      ...node.data,
                      imageData: result.data,
                      imagePath: result.path
                    }
                  }
                : node
            )
          )
        } else if (result?.error) {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to upload file')
      } finally {
        setIsUploading(false)
      }
    },
    [handleDrop, getNodes, setNodes, id]
  )

  return (
    <div
      className={cn(
        'min-w-[200px] rounded-lg border bg-card p-4 shadow-sm transition-all',
        selected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-muted-foreground',
        isDragOver && 'border-primary bg-primary/5'
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDropEvent}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-blue-500/10">
          <FileImage className="h-4 w-4 text-blue-500" />
        </div>
        <h3 className="text-sm font-semibold">{data.label || 'Image Input'}</h3>
      </div>

      {/* Image Preview */}
      <div className="mb-3">
        {data.imageData ? (
          <div className="relative aspect-video overflow-hidden rounded border border-border">
            <img src={data.imageData} alt="Input" className="h-full w-full object-cover" />
            {isUploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <div className="text-white text-sm">Uploading...</div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              'flex aspect-video items-center justify-center rounded border-2 border-dashed bg-muted/20 transition-all duration-200',
              isDragOver ? 'border-primary bg-primary/10 scale-105' : 'border-border',
              isUploading && 'border-blue-500 bg-blue-50'
            )}
          >
            <div className="text-center">
              {isUploading ? (
                <>
                  <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                  <p className="text-xs text-blue-600">Processing...</p>
                </>
              ) : (
                <>
                  <Upload
                    className={cn(
                      'mx-auto mb-2 h-8 w-8 transition-colors',
                      isDragOver ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                  <p
                    className={cn(
                      'text-xs transition-colors',
                      isDragOver ? 'text-primary' : 'text-muted-foreground'
                    )}
                  >
                    {isDragOver ? 'Drop image here' : 'Drag & drop image or upload in properties'}
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-3 flex items-center gap-2 rounded border border-red-200 bg-red-50 p-2">
          <AlertCircle className="h-4 w-4 text-red-500" />
          <p className="text-xs text-red-600">{error}</p>
        </div>
      )}

      {/* File info */}
      {data.imagePath && (
        <div className="rounded bg-muted/50 p-2">
          <p className="truncate text-xs text-muted-foreground" title={data.imagePath}>
            {data.imagePath.split('/').pop() || data.imagePath}
          </p>
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="image"
        className="!h-3 !w-3 !border-2 !border-background !bg-blue-500"
      />
    </div>
  )
}
