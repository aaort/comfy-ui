import { Grid3x3 } from 'lucide-react'
import { Handle, Position } from 'reactflow'
import { cn } from '../../lib/utils'
import { PanelLayoutNodeData } from '../../types'

interface PanelLayoutNodeProps {
  data: PanelLayoutNodeData
  selected: boolean
}

export default function PanelLayoutNode({ data, selected }: PanelLayoutNodeProps) {
  const renderLayoutPreview = () => {
    const baseClass = 'border border-dashed border-muted-foreground/50 bg-muted/20'

    switch (data.layout) {
      case 'single':
        return (
          <div className="w-full h-full grid grid-cols-1 gap-1">
            <div className={cn(baseClass, 'rounded')} />
          </div>
        )
      case 'split-horizontal':
        return (
          <div className="w-full h-full grid grid-cols-2 gap-1">
            <div className={cn(baseClass, 'rounded')} />
            <div className={cn(baseClass, 'rounded')} />
          </div>
        )
      case 'split-vertical':
        return (
          <div className="w-full h-full grid grid-rows-2 gap-1">
            <div className={cn(baseClass, 'rounded')} />
            <div className={cn(baseClass, 'rounded')} />
          </div>
        )
      case 'grid':
        return (
          <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1">
            <div className={cn(baseClass, 'rounded')} />
            <div className={cn(baseClass, 'rounded')} />
            <div className={cn(baseClass, 'rounded')} />
            <div className={cn(baseClass, 'rounded')} />
          </div>
        )
      default:
        return null
    }
  }

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
          <Grid3x3 className="h-4 w-4 text-green-500" />
          <span className="text-sm font-medium">{data.label || 'Panel Layout'}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Layout Type */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Layout Type</label>
          <div className="grid grid-cols-2 gap-1">
            {(['single', 'split-horizontal', 'split-vertical', 'grid'] as const).map((layout) => (
              <button
                key={layout}
                className={cn(
                  'px-2 py-1.5 text-xs rounded-md capitalize transition-colors',
                  data.layout === layout
                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                    : 'bg-secondary text-secondary-foreground'
                )}
              >
                {layout.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Layout Preview */}
        <div className="space-y-1">
          <label className="text-xs text-muted-foreground">Preview</label>
          <div className="w-full h-32 bg-background rounded-md p-2">{renderLayoutPreview()}</div>
        </div>

        {/* Panel Count */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Panels</span>
          <span className="font-medium">{data.panels?.length || 0}</span>
        </div>

        {/* Panel List */}
        {data.panels && data.panels.length > 0 && (
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">Panel Details</label>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {data.panels.map((panel, index) => (
                <div
                  key={panel.id}
                  className="px-2 py-1 bg-background rounded text-xs flex items-center justify-between"
                >
                  <span>Panel {index + 1}</span>
                  <span className="text-muted-foreground">
                    {panel.position.width}×{panel.position.height}
                  </span>
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
