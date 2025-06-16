import { FileVideo, Upload } from 'lucide-react'
import { Handle, NodeProps, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { VideoInputNodeData } from '../../types'

export default function VideoInputNode({ data, selected }: NodeProps<VideoInputNodeData>) {
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
        <div className="flex h-8 w-8 items-center justify-center rounded bg-purple-500/10">
          <FileVideo className="h-4 w-4 text-purple-500" />
        </div>
        <h3 className="text-sm font-semibold">{data.label || 'Video Input'}</h3>
      </div>

      {/* Video Preview */}
      <div className="mb-3">
        {data.videoPath ? (
          <div className="relative aspect-video overflow-hidden rounded border border-border bg-black">
            <div className="flex h-full w-full items-center justify-center">
              <FileVideo className="h-12 w-12 text-muted-foreground" />
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                <p className="text-center text-xs text-white">Video loaded</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex aspect-video items-center justify-center rounded border-2 border-dashed border-border bg-muted/20">
            <div className="text-center">
              <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Upload video in properties</p>
            </div>
          </div>
        )}
      </div>

      {/* Video info */}
      {data.videoPath && (
        <div className="space-y-1 rounded bg-muted/50 p-2">
          <p className="truncate text-xs text-muted-foreground" title={data.videoPath}>
            {data.videoPath.split('/').pop() || data.videoPath}
          </p>
          {(data.startFrame !== undefined || data.endFrame !== undefined) && (
            <p className="text-xs text-muted-foreground">
              Frames: {data.startFrame || 0} - {data.endFrame || 'end'}
            </p>
          )}
        </div>
      )}

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="video"
        className="!h-3 !w-3 !border-2 !border-background !bg-purple-500"
      />
    </div>
  )
}
