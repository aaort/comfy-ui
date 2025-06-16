import { MapPin } from 'lucide-react'
import { Handle, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { SceneNodeData } from '../../types'

interface SceneNodeProps {
  data: SceneNodeData
  selected: boolean
}

export default function SceneNode({ data, selected }: SceneNodeProps) {
  return (
    <div
      className={cn(
        'bg-card border-2 rounded-lg shadow-md min-w-[300px] transition-all',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        data.isProcessing && 'opacity-70'
      )}
    >
      {/* Header */}
      <div className="bg-green-500/10 px-4 py-2 rounded-t-md border-b">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">{data.label || 'Scene'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Location */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Location</label>
          <div className="px-3 py-2 bg-background rounded-md">
            <p className="text-sm font-medium">
              {data.location || (
                <span className="text-muted-foreground italic">No location set</span>
              )}
            </p>
          </div>
        </div>

        {/* Time of Day & Mood */}
        <div className="grid grid-cols-2 gap-2">
          {data.timeOfDay && (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Time</label>
              <div className="px-2 py-1.5 bg-background rounded-md">
                <p className="text-xs">{data.timeOfDay}</p>
              </div>
            </div>
          )}
          {data.mood && (
            <div className="space-y-1">
              <label className="text-xs text-muted-foreground">Mood</label>
              <div className="px-2 py-1.5 bg-background rounded-md">
                <p className="text-xs">{data.mood}</p>
              </div>
            </div>
          )}
        </div>

        {/* Elements */}
        {data.elements && data.elements.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Scene Elements</label>
            <div className="flex flex-wrap gap-1">
              {data.elements.map((element, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-green-500/20 text-green-600 dark:text-green-400 rounded-full"
                >
                  {element}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reference Images */}
        {data.referenceImages && data.referenceImages.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">
              References ({data.referenceImages.length})
            </label>
            <div className="grid grid-cols-3 gap-1">
              {data.referenceImages.slice(0, 6).map((img, index) => (
                <div key={img.id} className="aspect-square bg-muted rounded overflow-hidden">
                  {img.thumbnail && (
                    <img
                      src={img.thumbnail}
                      alt={`Reference ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
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
        type="source"
        position={Position.Right}
        className="!bg-green-500 !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  )
}
