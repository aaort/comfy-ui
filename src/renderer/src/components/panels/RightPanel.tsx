import { Download, Save, Upload } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Node } from 'reactflow'
import {
  CharacterNodeData,
  DialogueNodeData,
  ImageInputNodeData,
  ImageOutputNodeData,
  PanelLayoutNodeData,
  SceneNodeData,
  SequenceNodeData,
  StoryboardNodeData,
  StyleReferenceNodeData,
  TextPromptNodeData,
  VideoInputNodeData,
  VideoOutputNodeData,
  WorkflowNode
} from '../../types'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { ScrollArea } from '../ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Separator } from '../ui/separator'
import { Slider } from '../ui/slider'
import { Switch } from '../ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Textarea } from '../ui/textarea'

interface RightPanelProps {
  activeTab: 'properties' | 'styles' | 'export'
  onTabChange: (tab: string) => void
  selectedNodes: string[]
  nodes: Node[]
  onNodesChange: (nodes: Node[]) => void
}

export function RightPanel({
  activeTab,
  onTabChange,
  selectedNodes,
  nodes,
  onNodesChange
}: RightPanelProps) {
  const [exportSettings, setExportSettings] = useState({
    format: 'png',
    quality: 90,
    scale: 2,
    includeMetadata: true
  })

  const selectedNode = nodes.find((node) => selectedNodes.includes(node.id)) as
    | WorkflowNode
    | undefined

  const updateNodeData = useCallback(
    (nodeId: string, data: Partial<any>) => {
      onNodesChange(
        nodes.map((node) =>
          node.id === nodeId ? { ...node, data: { ...node.data, ...data } } : node
        )
      )
    },
    [nodes, onNodesChange]
  )

  const renderNodeProperties = () => {
    if (!selectedNode) {
      return (
        <div className="flex h-full items-center justify-center p-4 text-center">
          <div className="text-sm text-muted-foreground">Select a node to view its properties</div>
        </div>
      )
    }

    switch (selectedNode.type) {
      case 'text-prompt':
        return <TextPromptProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'image-input':
        return <ImageInputProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'video-input':
        return <VideoInputProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'image-output':
        return <ImageOutputProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'video-output':
        return <VideoOutputProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'style-reference':
        return <StyleReferenceProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'character-reference':
        return <CharacterProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'scene-composer':
        return <SceneProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'dialogue-box':
        return <DialogueProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'panel-layout':
        return <PanelLayoutProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'sequence-builder':
        return <SequenceProperties node={selectedNode} onUpdate={updateNodeData} />
      case 'storyboard':
        return <StoryboardProperties node={selectedNode} onUpdate={updateNodeData} />
      default:
        return (
          <div className="p-4">
            <p className="text-sm text-muted-foreground">
              No properties available for this node type
            </p>
          </div>
        )
    }
  }

  return (
    <div className="flex h-full w-80 flex-col border-l border-border bg-card">
      <div className="flex h-12 items-center justify-between border-b border-border px-4">
        <h2 className="text-sm font-semibold">Properties</h2>
      </div>

      <Tabs value={activeTab} onValueChange={onTabChange} className="flex-1">
        <TabsList className="w-full rounded-none border-b">
          <TabsTrigger value="properties" className="flex-1">
            Properties
          </TabsTrigger>
          <TabsTrigger value="styles" className="flex-1">
            Styles
          </TabsTrigger>
          <TabsTrigger value="export" className="flex-1">
            Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="properties" className="flex-1 p-0">
          <ScrollArea className="h-full">{renderNodeProperties()}</ScrollArea>
        </TabsContent>

        <TabsContent value="styles" className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-4">
              <div>
                <h3 className="mb-4 text-sm font-semibold">Global Styles</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="theme">Theme</Label>
                    <Select defaultValue="dark">
                      <SelectTrigger id="theme">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="comic">Comic Book</SelectItem>
                        <SelectItem value="manga">Manga</SelectItem>
                        <SelectItem value="storyboard">Storyboard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="color-palette">Color Palette</Label>
                    <div className="mt-2 grid grid-cols-6 gap-1">
                      {['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'].map(
                        (color) => (
                          <button
                            key={color}
                            className="h-8 w-full rounded border border-border"
                            style={{ backgroundColor: color }}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="font">Font Family</Label>
                    <Select defaultValue="comic-sans">
                      <SelectTrigger id="font">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="comic-sans">Comic Sans MS</SelectItem>
                        <SelectItem value="arial">Arial</SelectItem>
                        <SelectItem value="helvetica">Helvetica</SelectItem>
                        <SelectItem value="manga">Manga Temple</SelectItem>
                        <SelectItem value="custom">Custom Font...</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-sm font-semibold">Panel Styles</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="border-style">Border Style</Label>
                    <Select defaultValue="solid">
                      <SelectTrigger id="border-style">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="rounded">Rounded</SelectItem>
                        <SelectItem value="jagged">Jagged</SelectItem>
                        <SelectItem value="cloud">Cloud</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="border-width">Border Width</Label>
                    <Slider
                      id="border-width"
                      min={0}
                      max={10}
                      step={1}
                      defaultValue={[2]}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="gutter-size">Gutter Size</Label>
                    <Slider
                      id="gutter-size"
                      min={0}
                      max={20}
                      step={1}
                      defaultValue={[10]}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="export" className="flex-1 p-0">
          <ScrollArea className="h-full">
            <div className="space-y-6 p-4">
              <div>
                <h3 className="mb-4 text-sm font-semibold">Export Settings</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="export-format">Format</Label>
                    <Select
                      value={exportSettings.format}
                      onValueChange={(value) =>
                        setExportSettings({ ...exportSettings, format: value })
                      }
                    >
                      <SelectTrigger id="export-format">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                        <SelectItem value="webp">WebP</SelectItem>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="svg">SVG</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="export-quality">Quality</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="export-quality"
                        min={1}
                        max={100}
                        step={1}
                        value={[exportSettings.quality]}
                        onValueChange={([value]) =>
                          setExportSettings({ ...exportSettings, quality: value })
                        }
                        className="flex-1"
                      />
                      <span className="w-12 text-sm">{exportSettings.quality}%</span>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="export-scale">Scale</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="export-scale"
                        min={0.5}
                        max={4}
                        step={0.5}
                        value={[exportSettings.scale]}
                        onValueChange={([value]) =>
                          setExportSettings({ ...exportSettings, scale: value })
                        }
                        className="flex-1"
                      />
                      <span className="w-12 text-sm">{exportSettings.scale}x</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="include-metadata">Include metadata</Label>
                    <Switch
                      id="include-metadata"
                      checked={exportSettings.includeMetadata}
                      onCheckedChange={(checked) =>
                        setExportSettings({ ...exportSettings, includeMetadata: checked })
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Button className="w-full" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export Current View
                </Button>
                <Button className="w-full" size="sm" variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Export All Pages
                </Button>
              </div>
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Node-specific property panels
function TextPromptProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<TextPromptNodeData>) => void
}) {
  const data = node.data as TextPromptNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label htmlFor="prompt">Prompt</Label>
        <Textarea
          id="prompt"
          value={data.prompt || ''}
          onChange={(e) => onUpdate(node.id, { prompt: e.target.value })}
          rows={4}
          placeholder="Enter your prompt..."
        />
      </div>

      <div>
        <Label htmlFor="negative-prompt">Negative Prompt</Label>
        <Textarea
          id="negative-prompt"
          value={data.negativePrompt || ''}
          onChange={(e) => onUpdate(node.id, { negativePrompt: e.target.value })}
          rows={2}
          placeholder="What to avoid..."
        />
      </div>

      <div>
        <Label htmlFor="seed">Seed</Label>
        <Input
          id="seed"
          type="number"
          value={data.seed || -1}
          onChange={(e) => onUpdate(node.id, { seed: parseInt(e.target.value) })}
          placeholder="-1 for random"
        />
      </div>

      <div>
        <Label htmlFor="temperature">Temperature</Label>
        <div className="flex items-center gap-2">
          <Slider
            id="temperature"
            min={0}
            max={2}
            step={0.1}
            value={[data.temperature || 1]}
            onValueChange={([value]) => onUpdate(node.id, { temperature: value })}
            className="flex-1"
          />
          <span className="w-12 text-sm">{data.temperature || 1}</span>
        </div>
      </div>
    </div>
  )
}

function ImageInputProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<ImageInputNodeData>) => void
}) {
  const data = node.data as ImageInputNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Image Source</Label>
        <div className="mt-2 space-y-2">
          <Button className="w-full" size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Image
          </Button>
          {data.imagePath && (
            <div className="rounded border border-border p-2 text-sm">{data.imagePath}</div>
          )}
        </div>
      </div>

      {data.imageData && (
        <div>
          <Label>Preview</Label>
          <div className="mt-2 overflow-hidden rounded border border-border">
            <img src={data.imageData} alt="Input" className="h-auto w-full" />
          </div>
        </div>
      )}
    </div>
  )
}

function VideoInputProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<VideoInputNodeData>) => void
}) {
  const data = node.data as VideoInputNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label>Video Source</Label>
        <div className="mt-2 space-y-2">
          <Button className="w-full" size="sm" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload Video
          </Button>
          {data.videoPath && (
            <div className="rounded border border-border p-2 text-sm">{data.videoPath}</div>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="start-frame">Start Frame</Label>
        <Input
          id="start-frame"
          type="number"
          value={data.startFrame || 0}
          onChange={(e) => onUpdate(node.id, { startFrame: parseInt(e.target.value) })}
          min={0}
        />
      </div>

      <div>
        <Label htmlFor="end-frame">End Frame</Label>
        <Input
          id="end-frame"
          type="number"
          value={data.endFrame || 0}
          onChange={(e) => onUpdate(node.id, { endFrame: parseInt(e.target.value) })}
          min={0}
        />
      </div>
    </div>
  )
}

function ImageOutputProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<ImageOutputNodeData>) => void
}) {
  const data = node.data as ImageOutputNodeData

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={data.width || 1024}
            onChange={(e) => onUpdate(node.id, { width: parseInt(e.target.value) })}
            min={1}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={data.height || 1024}
            onChange={(e) => onUpdate(node.id, { height: parseInt(e.target.value) })}
            min={1}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="format">Format</Label>
        <Select
          value={data.format || 'png'}
          onValueChange={(value) => onUpdate(node.id, { format: value as any })}
        >
          <SelectTrigger id="format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="png">PNG</SelectItem>
            <SelectItem value="jpg">JPG</SelectItem>
            <SelectItem value="webp">WebP</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quality">Quality</Label>
        <div className="flex items-center gap-2">
          <Slider
            id="quality"
            min={1}
            max={100}
            step={1}
            value={[data.quality || 90]}
            onValueChange={([value]) => onUpdate(node.id, { quality: value })}
            className="flex-1"
          />
          <span className="w-12 text-sm">{data.quality || 90}%</span>
        </div>
      </div>
    </div>
  )
}

function VideoOutputProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<VideoOutputNodeData>) => void
}) {
  const data = node.data as VideoOutputNodeData

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="width">Width</Label>
          <Input
            id="width"
            type="number"
            value={data.width || 1920}
            onChange={(e) => onUpdate(node.id, { width: parseInt(e.target.value) })}
            min={1}
          />
        </div>
        <div>
          <Label htmlFor="height">Height</Label>
          <Input
            id="height"
            type="number"
            value={data.height || 1080}
            onChange={(e) => onUpdate(node.id, { height: parseInt(e.target.value) })}
            min={1}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="fps">Frame Rate (FPS)</Label>
        <Input
          id="fps"
          type="number"
          value={data.fps || 30}
          onChange={(e) => onUpdate(node.id, { fps: parseInt(e.target.value) })}
          min={1}
          max={120}
        />
      </div>

      <div>
        <Label htmlFor="format">Format</Label>
        <Select
          value={data.format || 'mp4'}
          onValueChange={(value) => onUpdate(node.id, { format: value as any })}
        >
          <SelectTrigger id="format">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mp4">MP4</SelectItem>
            <SelectItem value="webm">WebM</SelectItem>
            <SelectItem value="gif">GIF</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="quality">Quality</Label>
        <div className="flex items-center gap-2">
          <Slider
            id="quality"
            min={1}
            max={100}
            step={1}
            value={[data.quality || 85]}
            onValueChange={([value]) => onUpdate(node.id, { quality: value })}
            className="flex-1"
          />
          <span className="w-12 text-sm">{data.quality || 85}%</span>
        </div>
      </div>
    </div>
  )
}

function StyleReferenceProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<StyleReferenceNodeData>) => void
}) {
  const data = node.data as StyleReferenceNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label htmlFor="style-preset">Style Preset</Label>
        <Select
          value={data.stylePreset || 'custom'}
          onValueChange={(value) => onUpdate(node.id, { stylePreset: value })}
        >
          <SelectTrigger id="style-preset">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="anime">Anime</SelectItem>
            <SelectItem value="comic">Comic Book</SelectItem>
            <SelectItem value="manga">Manga</SelectItem>
            <SelectItem value="realistic">Realistic</SelectItem>
            <SelectItem value="cartoon">Cartoon</SelectItem>
            <SelectItem value="watercolor">Watercolor</SelectItem>
            <SelectItem value="oil-painting">Oil Painting</SelectItem>
            <SelectItem value="digital-art">Digital Art</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {data.stylePreset === 'custom' && (
        <>
          <div>
            <Label htmlFor="custom-name">Custom Style Name</Label>
            <Input
              id="custom-name"
              value={data.customStyle?.name || ''}
              onChange={(e) =>
                onUpdate(node.id, {
                  customStyle: {
                    ...data.customStyle,
                    name: e.target.value,
                    description: data.customStyle?.description || '',
                    parameters: data.customStyle?.parameters || {}
                  }
                })
              }
              placeholder="My Custom Style"
            />
          </div>

          <div>
            <Label htmlFor="custom-description">Description</Label>
            <Textarea
              id="custom-description"
              value={data.customStyle?.description || ''}
              onChange={(e) =>
                onUpdate(node.id, {
                  customStyle: {
                    ...data.customStyle,
                    name: data.customStyle?.name || '',
                    description: e.target.value,
                    parameters: data.customStyle?.parameters || {}
                  }
                })
              }
              rows={3}
              placeholder="Describe your custom style..."
            />
          </div>
        </>
      )}
    </div>
  )
}

function CharacterProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<CharacterNodeData>) => void
}) {
  const data = node.data as CharacterNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label htmlFor="name">Character Name</Label>
        <Input
          id="name"
          value={data.name || ''}
          onChange={(e) => onUpdate(node.id, { name: e.target.value })}
          placeholder="Character name..."
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => onUpdate(node.id, { description: e.target.value })}
          rows={3}
          placeholder="Describe the character..."
        />
      </div>

      <div>
        <Label htmlFor="traits">Traits</Label>
        <Input
          id="traits"
          value={data.traits?.join(', ') || ''}
          onChange={(e) =>
            onUpdate(node.id, {
              traits: e.target.value
                .split(',')
                .map((t) => t.trim())
                .filter(Boolean)
            })
          }
          placeholder="Brave, Kind, Mysterious..."
        />
      </div>

      <div>
        <Label htmlFor="pose">Pose</Label>
        <Select
          value={data.pose || 'standing'}
          onValueChange={(value) => onUpdate(node.id, { pose: value })}
        >
          <SelectTrigger id="pose">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="standing">Standing</SelectItem>
            <SelectItem value="sitting">Sitting</SelectItem>
            <SelectItem value="running">Running</SelectItem>
            <SelectItem value="walking">Walking</SelectItem>
            <SelectItem value="jumping">Jumping</SelectItem>
            <SelectItem value="flying">Flying</SelectItem>
            <SelectItem value="fighting">Fighting</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="expression">Expression</Label>
        <Select
          value={data.expression || 'neutral'}
          onValueChange={(value) => onUpdate(node.id, { expression: value })}
        >
          <SelectTrigger id="expression">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="happy">Happy</SelectItem>
            <SelectItem value="sad">Sad</SelectItem>
            <SelectItem value="angry">Angry</SelectItem>
            <SelectItem value="surprised">Surprised</SelectItem>
            <SelectItem value="confused">Confused</SelectItem>
            <SelectItem value="determined">Determined</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function SceneProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<SceneNodeData>) => void
}) {
  const data = node.data as SceneNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={data.location || ''}
          onChange={(e) => onUpdate(node.id, { location: e.target.value })}
          placeholder="Forest, City, Space Station..."
        />
      </div>

      <div>
        <Label htmlFor="time">Time of Day</Label>
        <Select
          value={data.timeOfDay || 'noon'}
          onValueChange={(value) => onUpdate(node.id, { timeOfDay: value as any })}
        >
          <SelectTrigger id="time">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="morning">Morning</SelectItem>
            <SelectItem value="noon">Noon</SelectItem>
            <SelectItem value="afternoon">Afternoon</SelectItem>
            <SelectItem value="evening">Evening</SelectItem>
            <SelectItem value="night">Night</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="weather">Weather</Label>
        <Input
          id="weather"
          value={data.weather || ''}
          onChange={(e) => onUpdate(node.id, { weather: e.target.value })}
          placeholder="Sunny, Rainy, Foggy..."
        />
      </div>

      <div>
        <Label htmlFor="mood">Mood</Label>
        <Input
          id="mood"
          value={data.mood || ''}
          onChange={(e) => onUpdate(node.id, { mood: e.target.value })}
          placeholder="Mysterious, Peaceful, Tense..."
        />
      </div>

      <div>
        <Label htmlFor="elements">Scene Elements</Label>
        <Textarea
          id="elements"
          value={data.elements?.join('\n') || ''}
          onChange={(e) =>
            onUpdate(node.id, {
              elements: e.target.value.split('\n').filter(Boolean)
            })
          }
          rows={4}
          placeholder="Trees&#10;Mountains&#10;River..."
        />
      </div>
    </div>
  )
}

function DialogueProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<DialogueNodeData>) => void
}) {
  const data = node.data as DialogueNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label htmlFor="character">Character</Label>
        <Input
          id="character"
          value={data.character || ''}
          onChange={(e) => onUpdate(node.id, { character: e.target.value })}
          placeholder="Character name..."
        />
      </div>

      <div>
        <Label htmlFor="text">Dialogue Text</Label>
        <Textarea
          id="text"
          value={data.text || ''}
          onChange={(e) => onUpdate(node.id, { text: e.target.value })}
          rows={3}
          placeholder="Enter dialogue..."
        />
      </div>

      <div>
        <Label htmlFor="emotion">Emotion</Label>
        <Select
          value={data.emotion || 'neutral'}
          onValueChange={(value) => onUpdate(node.id, { emotion: value })}
        >
          <SelectTrigger id="emotion">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="happy">Happy</SelectItem>
            <SelectItem value="sad">Sad</SelectItem>
            <SelectItem value="angry">Angry</SelectItem>
            <SelectItem value="excited">Excited</SelectItem>
            <SelectItem value="scared">Scared</SelectItem>
            <SelectItem value="confused">Confused</SelectItem>
            <SelectItem value="surprised">Surprised</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="style">Style</Label>
        <Select
          value={data.style || 'speech'}
          onValueChange={(value) => onUpdate(node.id, { style: value as any })}
        >
          <SelectTrigger id="style">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="speech">Speech Bubble</SelectItem>
            <SelectItem value="thought">Thought Bubble</SelectItem>
            <SelectItem value="narration">Narration Box</SelectItem>
            <SelectItem value="sound-effect">Sound Effect</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

function PanelLayoutProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<PanelLayoutNodeData>) => void
}) {
  const data = node.data as PanelLayoutNodeData

  return (
    <div className="space-y-4 p-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rows">Rows</Label>
          <Input
            id="rows"
            type="number"
            value={data.rows || 2}
            onChange={(e) => onUpdate(node.id, { rows: parseInt(e.target.value) })}
            min={1}
            max={6}
          />
        </div>
        <div>
          <Label htmlFor="columns">Columns</Label>
          <Input
            id="columns"
            type="number"
            value={data.columns || 2}
            onChange={(e) => onUpdate(node.id, { columns: parseInt(e.target.value) })}
            min={1}
            max={6}
          />
        </div>
      </div>

      <div>
        <Label htmlFor="gutter">Gutter Size</Label>
        <div className="flex items-center gap-2">
          <Slider
            id="gutter"
            min={0}
            max={20}
            step={1}
            value={[data.gutterSize || 10]}
            onValueChange={([value]) => onUpdate(node.id, { gutterSize: value })}
            className="flex-1"
          />
          <span className="w-12 text-sm">{data.gutterSize || 10}px</span>
        </div>
      </div>

      <div>
        <Label>Panel Layout Preview</Label>
        <div className="mt-2 grid gap-1 rounded border border-border p-2">
          {Array.from({ length: data.rows || 2 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex gap-1">
              {Array.from({ length: data.columns || 2 }).map((_, colIndex) => {
                const panelIndex = rowIndex * (data.columns || 2) + colIndex
                return (
                  <div
                    key={colIndex}
                    className="flex h-12 flex-1 items-center justify-center rounded bg-muted text-xs font-medium"
                  >
                    {panelIndex + 1}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SequenceProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<SequenceNodeData>) => void
}) {
  const data = node.data as SequenceNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label htmlFor="duration">Total Duration (seconds)</Label>
        <Input
          id="duration"
          type="number"
          value={data.duration || 10}
          onChange={(e) => onUpdate(node.id, { duration: parseFloat(e.target.value) })}
          min={0.1}
          step={0.1}
        />
      </div>

      <div>
        <Label htmlFor="transition">Transition Type</Label>
        <Select
          value={data.transition || 'cut'}
          onValueChange={(value) => onUpdate(node.id, { transition: value as any })}
        >
          <SelectTrigger id="transition">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cut">Cut</SelectItem>
            <SelectItem value="fade">Fade</SelectItem>
            <SelectItem value="dissolve">Dissolve</SelectItem>
            <SelectItem value="wipe">Wipe</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Frames</Label>
        <div className="mt-2 space-y-2">
          {(data.frames || []).map((frame, index) => (
            <div key={frame.id} className="rounded border border-border p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Frame {index + 1}</span>
                <span className="text-xs text-muted-foreground">{frame.duration}s</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">{frame.content}</p>
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" className="mt-2 w-full">
          Add Frame
        </Button>
      </div>
    </div>
  )
}

function StoryboardProperties({
  node,
  onUpdate
}: {
  node: WorkflowNode
  onUpdate: (id: string, data: Partial<StoryboardNodeData>) => void
}) {
  const data = node.data as StoryboardNodeData

  return (
    <div className="space-y-4 p-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={data.title || ''}
          onChange={(e) => onUpdate(node.id, { title: e.target.value })}
          placeholder="Scene title..."
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={data.description || ''}
          onChange={(e) => onUpdate(node.id, { description: e.target.value })}
          rows={2}
          placeholder="Scene description..."
        />
      </div>

      <div>
        <Label htmlFor="duration">Duration (seconds)</Label>
        <Input
          id="duration"
          type="number"
          value={data.duration || 30}
          onChange={(e) => onUpdate(node.id, { duration: parseFloat(e.target.value) })}
          min={0.1}
          step={0.1}
        />
      </div>

      <div>
        <Label>Shots</Label>
        <div className="mt-2 space-y-2">
          {(data.shots || []).map((shot) => (
            <div key={shot.id} className="rounded border border-border p-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Shot {shot.number}</span>
                <span className="text-xs text-muted-foreground">{shot.duration}s</span>
              </div>
              <p className="mt-1 text-xs">{shot.description}</p>
              {shot.dialogue && (
                <p className="mt-1 text-xs italic text-muted-foreground">"{shot.dialogue}"</p>
              )}
            </div>
          ))}
        </div>
        <Button size="sm" variant="outline" className="mt-2 w-full">
          Add Shot
        </Button>
      </div>
    </div>
  )
}

// Missing imports
