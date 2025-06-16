import { Palette } from 'lucide-react'
import { Handle, NodeProps, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { StyleReferenceNodeData } from '../../types'

const stylePresets = {
  anime: { label: 'Anime', color: 'pink' },
  comic: { label: 'Comic Book', color: 'orange' },
  manga: { label: 'Manga', color: 'purple' },
  realistic: { label: 'Realistic', color: 'blue' },
  cartoon: { label: 'Cartoon', color: 'yellow' },
  watercolor: { label: 'Watercolor', color: 'cyan' },
  'oil-painting': { label: 'Oil Painting', color: 'amber' },
  'digital-art': { label: 'Digital Art', color: 'indigo' },
  'fantasy-art': { label: 'Fantasy Art', color: 'violet' },
  custom: { label: 'Custom', color: 'gray' }
}

export default function StyleReferenceNode({ data, selected }: NodeProps<StyleReferenceNodeData>) {
  const preset = stylePresets[data.stylePreset as keyof typeof stylePresets] || stylePresets.custom

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
        <div className="flex h-8 w-8 items-center justify-center rounded bg-orange-500/10">
          <Palette className="h-4 w-4 text-orange-500" />
        </div>
        <h3 className="text-sm font-semibold">{data.label || 'Style Reference'}</h3>
      </div>

      {/* Style Preview */}
      <div className="mb-3">
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border-2 p-4',
            `border-${preset.color}-500/50 bg-${preset.color}-500/10`
          )}
        >
          <div className="text-center">
            <Palette className={cn('mx-auto mb-2 h-16 w-16', `text-${preset.color}-500`)} />
            <p className="text-sm font-medium">{preset.label}</p>
          </div>
        </div>
      </div>

      {/* Style Details */}
      <div className="space-y-2">
        {data.customStyle && data.stylePreset === 'custom' ? (
          <div className="rounded bg-muted/50 p-2">
            <p className="text-xs font-medium">{data.customStyle.name}</p>
            {data.customStyle.description && (
              <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                {data.customStyle.description}
              </p>
            )}
          </div>
        ) : (
          <div className="rounded bg-muted/50 p-2">
            <p className="text-xs text-muted-foreground">Style Preset</p>
            <p className="text-sm font-medium">{preset.label}</p>
          </div>
        )}

        {/* Parameters preview */}
        {data.customStyle?.parameters && Object.keys(data.customStyle.parameters).length > 0 && (
          <div className="rounded bg-muted/50 p-2">
            <p className="mb-1 text-xs text-muted-foreground">Parameters:</p>
            <div className="space-y-0.5">
              {Object.entries(data.customStyle.parameters)
                .slice(0, 3)
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{key}:</span>
                    <span className="font-mono">{String(value)}</span>
                  </div>
                ))}
              {Object.keys(data.customStyle.parameters).length > 3 && (
                <p className="text-xs text-muted-foreground">
                  +{Object.keys(data.customStyle.parameters).length - 3} more...
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Output Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="style"
        className="!h-3 !w-3 !border-2 !border-background !bg-orange-500"
      />
    </div>
  )
}
