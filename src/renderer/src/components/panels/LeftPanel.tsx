import {
  FileImage,
  FileVideo,
  Layers,
  MessageSquare,
  Palette,
  PanelTop,
  Play,
  Plus,
  Search,
  Sparkles,
  Square,
  Type,
  Upload,
  User,
  Video
} from 'lucide-react'
import { DragEvent, useCallback, useState } from 'react'
import { cn } from '../../lib/utils'
import { NodeType, Project } from '../../types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { ScrollArea } from '../ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface LeftPanelProps {
  activeTab: 'nodes' | 'assets' | 'layers'
  onTabChange: (tab: string) => void
  project: Project | null
}

interface NodeCategory {
  name: string
  nodes: {
    type: NodeType
    label: string
    icon: React.ReactNode
    description: string
  }[]
}

const nodeCategories: NodeCategory[] = [
  {
    name: 'Input',
    nodes: [
      {
        type: 'text-prompt',
        label: 'Text Prompt',
        icon: <Type className="h-4 w-4" />,
        description: 'Add text prompts for generation'
      },
      {
        type: 'image-input',
        label: 'Image Input',
        icon: <FileImage className="h-4 w-4" />,
        description: 'Import images as input'
      },
      {
        type: 'video-input',
        label: 'Video Input',
        icon: <FileVideo className="h-4 w-4" />,
        description: 'Import videos for processing'
      }
    ]
  },
  {
    name: 'Style & Reference',
    nodes: [
      {
        type: 'style-reference',
        label: 'Style Reference',
        icon: <Palette className="h-4 w-4" />,
        description: 'Define visual styles'
      },
      {
        type: 'character-reference',
        label: 'Character',
        icon: <User className="h-4 w-4" />,
        description: 'Create character references'
      }
    ]
  },
  {
    name: 'Composition',
    nodes: [
      {
        type: 'scene-composer',
        label: 'Scene Composer',
        icon: <Sparkles className="h-4 w-4" />,
        description: 'Compose complex scenes'
      },
      {
        type: 'dialogue-box',
        label: 'Dialogue Box',
        icon: <MessageSquare className="h-4 w-4" />,
        description: 'Add dialogue and speech bubbles'
      },
      {
        type: 'panel-layout',
        label: 'Panel Layout',
        icon: <PanelTop className="h-4 w-4" />,
        description: 'Create comic panel layouts'
      }
    ]
  },
  {
    name: 'Sequencing',
    nodes: [
      {
        type: 'sequence-builder',
        label: 'Sequence',
        icon: <Play className="h-4 w-4" />,
        description: 'Build animated sequences'
      },
      {
        type: 'storyboard',
        label: 'Storyboard',
        icon: <Square className="h-4 w-4" />,
        description: 'Create storyboards'
      }
    ]
  },
  {
    name: 'Output',
    nodes: [
      {
        type: 'image-output',
        label: 'Image Output',
        icon: <FileImage className="h-4 w-4" />,
        description: 'Export as image'
      },
      {
        type: 'video-output',
        label: 'Video Output',
        icon: <Video className="h-4 w-4" />,
        description: 'Export as video'
      }
    ]
  }
]

export function LeftPanel({ activeTab, onTabChange, project }: LeftPanelProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState<string | null>(null)

  const handleDragStart = useCallback((event: DragEvent<HTMLDivElement>, nodeType: NodeType) => {
    event.dataTransfer.setData('nodeType', nodeType)
    event.dataTransfer.effectAllowed = 'move'
  }, [])

  const filteredCategories = nodeCategories
    .map((category) => ({
      ...category,
      nodes: category.nodes.filter(
        (node) =>
          node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter((category) => category.nodes.length > 0)

  const handleAssetUpload = useCallback(() => {
    // In a real app, this would open a file dialog
    console.log('Upload asset')
  }, [])

  const handleAssetDrop = useCallback((event: DragEvent) => {
    event.preventDefault()
    const files = Array.from(event.dataTransfer.files)
    // In a real app, process and add files to project assets
    console.log('Dropped files:', files)
  }, [])

  return (
    <div className="flex h-full w-80 flex-col border-r border-border bg-card">
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold">Tools</h2>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="nodes" className="flex-1">
            Nodes
          </TabsTrigger>
          <TabsTrigger value="assets" className="flex-1">
            Assets
          </TabsTrigger>
          <TabsTrigger value="layers" className="flex-1">
            Layers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="flex-1 p-0">
          <div className="border-b border-border p-3">
            <div className="relative">
              <Search className="absolute left-2 top-[50%] -translate-y-[50%] h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                value={searchQuery}
                placeholder="Search nodes..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3">
              {filteredCategories.map((category) => (
                <div key={category.name} className="mb-6">
                  <h3 className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
                    {category.name}
                  </h3>
                  <div className="space-y-1">
                    {category.nodes.map((node) => (
                      <div
                        key={node.type}
                        draggable
                        onDragStart={(e) => handleDragStart(e, node.type)}
                        className={cn(
                          'group relative flex cursor-move items-center gap-3 rounded-md p-2',
                          'border border-transparent bg-secondary/50',
                          'transition-all hover:border-border hover:bg-secondary',
                          'active:scale-95'
                        )}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-background">
                          {node.icon}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{node.label}</div>
                          <div className="text-xs text-muted-foreground">{node.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="assets" className="flex-1 p-0">
          <div className="border-b border-border p-3">
            <Button onClick={handleAssetUpload} size="sm" className="w-full" variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Upload Assets
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3" onDrop={handleAssetDrop} onDragOver={(e) => e.preventDefault()}>
              {project?.assets.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border p-8 text-center">
                  <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Drop files here or click upload</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {project?.assets.map((asset) => (
                    <div
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset.id)}
                      className={cn(
                        'group relative aspect-square cursor-pointer overflow-hidden rounded-md border',
                        selectedAsset === asset.id
                          ? 'border-primary'
                          : 'border-border hover:border-muted-foreground'
                      )}
                    >
                      {asset.thumbnail ? (
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-muted">
                          {asset.type === 'image' ? (
                            <FileImage className="h-8 w-8 text-muted-foreground" />
                          ) : asset.type === 'video' ? (
                            <FileVideo className="h-8 w-8 text-muted-foreground" />
                          ) : (
                            <div className="text-xs text-muted-foreground">{asset.type}</div>
                          )}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="truncate text-xs text-white">{asset.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layers" className="flex-1 p-0">
          <div className="border-b border-border p-3">
            <Button size="sm" className="w-full" variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Add Layer
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-3">
              <div className="space-y-1">
                {/* Example layers */}
                <div className="flex items-center gap-2 rounded-md border border-border p-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm">Background</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-primary bg-primary/10 p-2">
                  <Layers className="h-4 w-4 text-primary" />
                  <span className="flex-1 text-sm font-medium">Main Content</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <Eye className="h-3 w-3" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 rounded-md border border-border p-2">
                  <Layers className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm">Effects</span>
                  <Button size="icon" variant="ghost" className="h-6 w-6">
                    <EyeOff className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Missing icon imports
import { Eye, EyeOff } from 'lucide-react'
