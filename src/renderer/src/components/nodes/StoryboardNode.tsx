import { Clapperboard, Plus } from 'lucide-react'
import { Handle, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { StoryboardNodeData } from '../../types'

interface StoryboardNodeProps {
  data: StoryboardNodeData
  selected: boolean
}

export default function StoryboardNode({ data, selected }: StoryboardNodeProps) {
  const totalDuration = data.scenes?.reduce((sum, scene) => sum + (scene.duration || 0), 0) || 0

  return (
    <div
      className={cn(
        'bg-card border-2 rounded-lg shadow-md min-w-[340px] transition-all',
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-border',
        data.isProcessing && 'opacity-70'
      )}
    >
      {/* Header */}
      <div className="bg-orange-500/10 px-4 py-2 rounded-t-md border-b">
        <div className="flex items-center gap-2">
          <Clapperboard className="h-4 w-4 text-orange-500" />
          <span className="text-sm font-medium">{data.label || 'Storyboard'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Storyboard Info */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-muted-foreground">Scenes: </span>
            <span className="font-medium">{data.scenes?.length || 0}</span>
          </div>
          {totalDuration > 0 && (
            <div>
              <span className="text-muted-foreground">Total: </span>
              <span className="font-medium">{totalDuration}s</span>
            </div>
          )}
        </div>

        {/* Scenes List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {data.scenes && data.scenes.length > 0 ? (
            data.scenes.map((scene, index) => (
              <div
                key={scene.id}
                className="border border-border rounded-md p-3 space-y-2 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Scene Thumbnail */}
                  <div className="flex-shrink-0 w-16 h-12 bg-muted rounded overflow-hidden">
                    {scene.thumbnail ? (
                      <img
                        src={scene.thumbnail.url || scene.thumbnail.thumbnail}
                        alt={`Scene ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                        {index + 1}
                      </div>
                    )}
                  </div>

                  {/* Scene Info */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">Scene {index + 1}</h4>
                      {scene.duration && (
                        <span className="text-xs text-muted-foreground">{scene.duration}s</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {scene.description || 'No description'}
                    </p>
                    {scene.dialogue && scene.dialogue.length > 0 && (
                      <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground">Dialogue:</span>
                        <span className="px-1.5 py-0.5 bg-orange-500/20 text-orange-600 dark:text-orange-400 rounded">
                          {scene.dialogue.length} lines
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <Clapperboard className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">No scenes yet</p>
              <p className="text-xs text-muted-foreground mt-1">Add scenes to build your story</p>
            </div>
          )}
        </div>

        {/* Add Scene Button */}
        <button className="w-full px-3 py-2 text-sm bg-secondary hover:bg-secondary/80 rounded-md flex items-center justify-center gap-2 transition-colors">
          <Plus className="h-4 w-4" />
          Add Scene
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
        className="!bg-orange-500 !w-3 !h-3 !border-2 !border-background"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!bg-orange-500 !w-3 !h-3 !border-2 !border-background"
      />
    </div>
  )
}
