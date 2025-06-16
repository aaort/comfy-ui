import { Download, FileImage } from 'lucide-react'
import { Handle, NodeProps, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { ImageOutputNodeData } from '../../types'

export default function ImageOutputNode({ data, selected }: NodeProps<ImageOutputNodeData>) {
  return (
    <div
      className={cn(
        'min-w-[250px] rounded-lg border bg-card p-4 shadow-sm transition-all',
        selected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-muted-foreground'
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-green-500/10">
          <FileImage className="h-4 w-4 text-green-500" />
        </div>
        <h3 className="text-sm font-semibold">{data.label || 'Image Output'}</h3>
      </div>

      {/* Output Preview */}
      <div className="mb-3">
        <div className="relative aspect-video overflow-hidden rounded border border-border bg-muted/20">
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <FileImage className="mx-auto mb-2 h-12 w-12 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Generated image will appear here</p>
            </div>
          </div>
          <button className="absolute bottom-2 right-2 rounded bg-black/60 p-1.5 opacity-0 transition-opacity hover:bg-black/80 group-hover:opacity-100">
            <Download className="h-3 w-3 text-white" />
          </button>
        </div>
      </div>

      {/* Output Settings */}
      <div className="space-y-1 rounded bg-muted/50 p-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Resolution:</span>
          <span>
            {data.width || 1024} × {data.height || 1024}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Format:</span>
          <span className="uppercase">{data.format || 'PNG'}</span>
        </div>
        {data.quality !== undefined && (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Quality:</span>
            <span>{data.quality}%</span>
          </div>
        )}
      </div>

      {/* Input Handles */}
      <Handle
        type="target"
        position={Position.Left}
        id="prompt"
        style={{ top: '30%' }}
        className="!h-3 !w-3 !border-2 !border-background !bg-primary"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="style"
        style={{ top: '50%' }}
        className="!h-3 !w-3 !border-2 !border-background !bg-orange-500"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="image"
        style={{ top: '70%' }}
        className="!h-3 !w-3 !border-2 !border-background !bg-blue-500"
      />
    </div>
  )
}
