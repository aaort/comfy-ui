import { MessageSquare } from 'lucide-react'
import { Handle, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { DialogueNodeData } from '../../types'

interface DialogueNodeProps {
  data: DialogueNodeData
  selected: boolean
}

export default function DialogueNode({ data, selected }: DialogueNodeProps) {
  return (
    <div
      className={cn(
        'bg-card border-2 rounded-lg shadow-md min-w-[280px] transition-all',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        data.isProcessing && 'opacity-70'
      )}
    >
      {/* Header */}
      <div className="bg-blue-500/10 px-4 py-2 rounded-t-md border-b">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-blue-500" />
          <span className="text-sm font-medium">{data.label || 'Dialogue'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Character */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Character</label>
          <div className="px-3 py-2 bg-background rounded-md">
            <p className="text-sm font-medium">
              {data.character || <span className="text-muted-foreground italic">No character</span>}
            </p>
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Text</label>
          <div className="px-3 py-2 bg-background rounded-md min-h-[60px] max-h-[120px] overflow-y-auto">
            <p className="text-sm whitespace-pre-wrap">
              {data.text || <span className="text-muted-foreground italic">Enter dialogue...</span>}
            </p>
          </div>
        </div>

        {/* Emotion */}
        {data.emotion && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Emotion</label>
            <div className="px-3 py-2 bg-background rounded-md">
              <p className="text-xs">{data.emotion}</p>
            </div>
          </div>
        )}

        {/* Position */}
        {data.position && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Position</label>
            <div className="flex gap-1">
              {(['top', 'bottom', 'left', 'right'] as const).map((pos) => (
                <div
                  key={pos}
                  className={cn(
                    'px-2 py-1 text-xs rounded-md capitalize transition-colors',
                    data.position === pos
                      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      : 'bg-background text-muted-foreground'
                  )}
                >
                  {pos}
                </div>
              ))}
            </div>
          </div>
        )}
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
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-blue-500 !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  )
}
