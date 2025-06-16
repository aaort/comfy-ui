import { Type } from 'lucide-react'
import { Handle, NodeProps, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { TextPromptNodeData } from '../../types'

export default function TextPromptNode({ data, selected }: NodeProps<TextPromptNodeData>) {
  return (
    <div
      className={cn(
        'min-w-[300px] rounded-lg border bg-card p-4 shadow-sm transition-all',
        selected
          ? 'border-primary ring-2 ring-primary/20'
          : 'border-border hover:border-muted-foreground'
      )}
    >
      {/* Header */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded bg-primary/10">
          <Type className="h-4 w-4 text-primary" />
        </div>
        <h3 className="text-sm font-semibold">{data.label || 'Text Prompt'}</h3>
      </div>

      {/* Content Preview */}
      <div className="space-y-2">
        {data.prompt && (
          <div className="rounded bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Prompt:</p>
            <p className="line-clamp-3 text-sm">{data.prompt}</p>
          </div>
        )}

        {data.negativePrompt && (
          <div className="rounded bg-destructive/10 p-2">
            <p className="text-xs text-muted-foreground">Negative:</p>
            <p className="line-clamp-2 text-sm">{data.negativePrompt}</p>
          </div>
        )}

        {!data.prompt && !data.negativePrompt && (
          <p className="text-center text-sm text-muted-foreground">
            Configure prompt in properties panel
          </p>
        )}
      </div>

      {/* Parameters */}
      {(data.seed !== undefined || data.temperature !== undefined) && (
        <div className="mt-2 flex gap-4 border-t border-border pt-2 text-xs text-muted-foreground">
          {data.seed !== undefined && <span>Seed: {data.seed === -1 ? 'Random' : data.seed}</span>}
          {data.temperature !== undefined && <span>Temp: {data.temperature}</span>}
        </div>
      )}

      {/* Handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="prompt"
        className="!h-3 !w-3 !border-2 !border-background !bg-primary"
      />
    </div>
  )
}
