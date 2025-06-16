import { Users } from 'lucide-react'
import { Handle, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { CharacterNodeData } from '../../types'

interface CharacterNodeProps {
  selected: boolean
  data: CharacterNodeData
}

export default function CharacterNode({ data, selected }: CharacterNodeProps) {
  return (
    <div
      className={cn(
        'bg-card border-2 rounded-lg shadow-md min-w-[300px] transition-all',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        data.isProcessing && 'opacity-70'
      )}
    >
      {/* Header */}
      <div className="bg-purple-500/10 px-4 py-2 rounded-t-md border-b">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-purple-500" />
          <span className="text-sm font-medium">{data.label || 'Character'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Character Name */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Name</label>
          <div className="px-3 py-2 bg-background rounded-md">
            <p className="text-sm font-medium">
              {data.name || <span className="text-muted-foreground italic">Unnamed Character</span>}
            </p>
          </div>
        </div>

        {/* Description */}
        {data.description && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Description</label>
            <div className="px-3 py-2 bg-background rounded-md max-h-20 overflow-y-auto">
              <p className="text-xs">{data.description}</p>
            </div>
          </div>
        )}

        {/* Outfit */}
        {data.outfit && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Outfit</label>
            <div className="px-3 py-2 bg-background rounded-md">
              <p className="text-xs">{data.outfit}</p>
            </div>
          </div>
        )}

        {/* Traits */}
        {data.traits && data.traits.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Traits</label>
            <div className="flex flex-wrap gap-1">
              {data.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-full"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reference Images */}
        {data.referenceImages && data.referenceImages.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              Reference Images ({data.referenceImages.length})
            </label>
            <div className="flex gap-1 overflow-x-auto">
              {data.referenceImages.slice(0, 3).map((img, index) => (
                <div
                  key={img.id}
                  className="flex-shrink-0 w-12 h-12 bg-muted rounded overflow-hidden"
                >
                  {img.thumbnail && (
                    <img
                      src={img.thumbnail}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
              {data.referenceImages.length > 3 && (
                <div className="flex-shrink-0 w-12 h-12 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    +{data.referenceImages.length - 3}
                  </span>
                </div>
              )}
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
        type="source"
        position={Position.Right}
        className="!bg-purple-500 !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  )
}
