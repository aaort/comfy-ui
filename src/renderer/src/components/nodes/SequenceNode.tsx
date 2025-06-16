import { Film, Plus } from 'lucide-react'
import { Handle, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { SequenceNodeData } from '../../types'

interface SequenceNodeProps {
  data: SequenceNodeData
  selected: boolean
}

export default function SequenceNode({ data, selected }: SequenceNodeProps) {
  const totalDuration = data.frames?.reduce((sum, frame) => sum + (frame.duration || 1), 0) || 0
  const fps = data.fps || 24

  return (
    <div
      className={cn(
        'bg-card border-2 rounded-lg shadow-md min-w-[320px] transition-all',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        data.isProcessing && 'opacity-70'
      )}
    >
      {/* Header */}
      <div className="bg-green-500/10 px-4 py-2 rounded-t-md border-b">
        <div className="flex items-center gap-2">
          <Film className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">{data.label || 'Sequence'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Sequence Info */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div>
            <label className="text-muted-foreground">Frames</label>
            <p className="font-medium">{data.frames?.length || 0}</p>
          </div>
          <div>
            <label className="text-muted-foreground">FPS</label>
            <p className="font-medium">{fps}</p>
          </div>
          <div>
            <label className="text-muted-foreground">Duration</label>
            <p className="font-medium">{(totalDuration / fps).toFixed(1)}s</p>
          </div>
        </div>

        {/* Frame Timeline */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Timeline</label>
          <div className="bg-background rounded-md p-2">
            <div className="flex gap-0.5 overflow-x-auto">
              {data.frames && data.frames.length > 0 ? (
                data.frames.slice(0, 10).map((frame, index) => (
                  <div
                    key={frame.id}
                    className={cn(
                      'flex-shrink-0 w-8 h-12 rounded-sm border relative group',
                      frame.content
                        ? 'bg-green-500/20 border-green-500/50'
                        : 'bg-muted border-border'
                    )}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    {frame.transition && (
                      <div className="absolute -right-0.5 top-1/2 -translate-y-1/2 w-1 h-1 bg-primary rounded-full" />
                    )}
                  </div>
                ))
              ) : (
                <div className="w-full h-12 border-2 border-dashed border-muted-foreground/30 rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">No frames</span>
                </div>
              )}
              {data.frames && data.frames.length > 10 && (
                <div className="flex-shrink-0 w-8 h-12 rounded-sm border border-dashed border-muted-foreground/50 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">+{data.frames.length - 10}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Frame Details */}
        {data.frames && data.frames.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Frame Details</label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {data.frames.slice(0, 5).map((frame, index) => (
                <div
                  key={frame.id}
                  className="px-2 py-1.5 bg-background rounded text-xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Frame {index + 1}</span>
                    {frame.transition && (
                      <span className="text-xs px-1.5 py-0.5 bg-green-500/20 text-green-600 dark:text-green-400 rounded">
                        {frame.transition}
                      </span>
                    )}
                  </div>
                  <span className="text-muted-foreground">{frame.duration}s</span>
                </div>
              ))}
              {data.frames.length > 5 && (
                <div className="text-center text-xs text-muted-foreground py-1">
                  ... and {data.frames.length - 5} more frames
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Frame Button */}
        <button className="w-full px-3 py-1.5 text-xs bg-secondary hover:bg-secondary/80 rounded-md flex items-center justify-center gap-1 transition-colors">
          <Plus className="h-3 w-3" />
          Add Frame
        </button>
      </div>

      {/* Error state */}
      {data.error && (
        <div className="px-4 pb-3">
          <p className="text-xs text-destructive">{data.error}</p>
        </div>
      )}

      {/* Handles */}
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  )
}
