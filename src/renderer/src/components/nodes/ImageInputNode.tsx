import { FileImage, Upload } from 'lucide-react'
import { Handle, NodeProps, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { ImageInputNodeData } from '../../types'

export default function ImageInputNode({ data, selected }: NodeProps<ImageInputNodeData>) {
  return (
    <div
      className={cn(
        'min-w-[200px] rounded-lg border bg-card p-4 shadow-sm transition-all',
        selected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-muted-foreground'
      )}
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
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded border-2 border-dashed border-border bg-muted/20">
            <div className="text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Upload image in properties</p>
            </div>
          </div>
        )}
      </div>

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
