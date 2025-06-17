import { useCallback, useEffect, useState } from 'react'
import ReactFlow, {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  MiniMap,
  OnSelectionChangeFunc,
  Panel,
  ReactFlowProvider,
  useEdgesState,
  useNodesState
} from 'reactflow'
import 'reactflow/dist/style.css'

import { CanvasContextMenu } from './components/canvas/CanvasContextMenu'
import { BottomPanel } from './components/panels/BottomPanel'
import { LeftPanel } from './components/panels/LeftPanel'
import { RightPanel } from './components/panels/RightPanel'
import { TopToolbar } from './components/panels/TopToolbar'

import { StorageProvider } from './contexts/StorageProvider'
import { ThemeProvider } from './contexts/ThemeProvider'
import { useGlobalShortcuts } from './hooks/useGlobalShortcuts'
import { usePersistentState } from './hooks/usePersistentState'

// Import custom nodes
import CharacterNode from './components/nodes/CharacterNode'
import DialogueNode from './components/nodes/DialogueNode'
import ImageInputNode from './components/nodes/ImageInputNode'
import ImageOutputNode from './components/nodes/ImageOutputNode'
import PanelLayoutNode from './components/nodes/PanelLayoutNode'
import SceneNode from './components/nodes/SceneNode'
import SequenceNode from './components/nodes/SequenceNode'
import StoryboardNode from './components/nodes/StoryboardNode'
import StyleReferenceNode from './components/nodes/StyleReferenceNode'
import TextPromptNode from './components/nodes/TextPromptNode'
import VideoInputNode from './components/nodes/VideoInputNode'
import VideoOutputNode from './components/nodes/VideoOutputNode'

import { cn } from './lib/utils'
import { NodeType, PanelState, Project, WorkflowNode } from './types'

const nodeTypes = {
  'text-prompt': TextPromptNode,
  'image-input': ImageInputNode,
  'video-input': VideoInputNode,
  'image-output': ImageOutputNode,
  'video-output': VideoOutputNode,
  'style-reference': StyleReferenceNode,
  'character-reference': CharacterNode,
  'scene-composer': SceneNode,
  'dialogue-box': DialogueNode,
  'panel-layout': PanelLayoutNode,
  'sequence-builder': SequenceNode,
  storyboard: StoryboardNode
} as const

function AppContent() {
  // Global shortcuts
  const { registerHandler } = useGlobalShortcuts()

  // Project state
  const [currentProject, setCurrentProject] = useState<Project | null>(null)

  // Persistent zoom state for timeline (managed at app level for persistence)
  const [timelineZoom, setTimelineZoom] = usePersistentState('timeline-zoom', 0.5)

  // Canvas state with example nodes
  const initialNodes: WorkflowNode[] = [
    {
      id: 'prompt-1',
      type: 'text-prompt',
      position: { x: 100, y: 100 },
      data: {
        label: 'Text Prompt',
        prompt:
          'A majestic dragon flying over a medieval castle at sunset, dramatic lighting, fantasy art style'
      }
    },
    {
      id: 'style-1',
      type: 'style-reference',
      position: { x: 100, y: 250 },
      data: {
        label: 'Style Reference',
        stylePreset: 'Fantasy Art'
      }
    },
    {
      id: 'character-1',
      type: 'character-reference',
      position: { x: 100, y: 400 },
      data: {
        label: 'Character',
        name: 'Dragon King',
        description: 'Ancient red dragon with golden horns and emerald eyes',
        traits: ['Majestic', 'Powerful', 'Wise']
      }
    },
    {
      id: 'output-1',
      type: 'image-output',
      position: { x: 500, y: 200 },
      data: {
        label: 'Image Output'
      }
    }
  ]

  const initialEdges = [
    {
      id: 'e1',
      source: 'prompt-1',
      target: 'output-1',
      targetHandle: 'prompt',
      type: 'smoothstep'
    },
    {
      id: 'e2',
      source: 'style-1',
      target: 'output-1',
      targetHandle: 'style',
      type: 'smoothstep'
    }
  ]

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNodes, setSelectedNodes] = useState<string[]>([])

  // UI state
  const [panelState, setPanelState] = useState<PanelState>({
    leftPanel: {
      isOpen: true,
      activeTab: 'nodes'
    },
    rightPanel: {
      isOpen: true,
      activeTab: 'properties'
    },
    bottomPanel: {
      isOpen: false,
      height: 200
    }
  })

  // Canvas interactions
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target) {
        const edge: Edge = {
          id: `${connection.source}-${connection.target}`,
          source: connection.source,
          target: connection.target,
          sourceHandle: connection.sourceHandle,
          targetHandle: connection.targetHandle,
          type: 'smoothstep'
        }
        setEdges((eds) => addEdge(edge, eds))
      }
    },
    [setEdges]
  )

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData('nodeType') as NodeType
      if (!type) return

      const position = {
        x: event.clientX - 250,
        y: event.clientY - 50
      }

      const newNode: WorkflowNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type.replace('-', ' ').toUpperCase() }
      }

      setNodes((nds) => nds.concat(newNode))
    },
    [setNodes]
  )

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const onSelectionChange: OnSelectionChangeFunc = useCallback(
    (params: { nodes: unknown[]; edges: unknown[] }) => {
      // @ts-expect-error n is not defined
      setSelectedNodes(params.nodes.map((n) => n.id))
    },
    []
  )

  // Panel toggles
  const togglePanel = useCallback((panel: keyof PanelState) => {
    setPanelState((prev) => ({
      ...prev,
      [panel]: {
        ...prev[panel],
        isOpen: !prev[panel].isOpen
      }
    }))
  }, [])

  const setActiveTab = useCallback((panel: 'leftPanel' | 'rightPanel', tab: string) => {
    setPanelState((prev) => ({
      ...prev,
      [panel]: {
        ...prev[panel],
        activeTab: tab as 'nodes' | 'assets' | 'layers' | 'properties' | 'styles' | 'export'
      }
    }))
  }, [])

  // Initialize with a default project
  useEffect(() => {
    if (!currentProject) {
      setCurrentProject({
        id: 'default',
        name: 'Untitled Project',
        type: 'comic',
        createdAt: new Date(),
        updatedAt: new Date(),
        settings: {},
        assets: [],
        workflow: { nodes: [], edges: [] }
      })
    }
  }, [currentProject])

  // Register handlers for built-in shortcuts
  useEffect(() => {
    // The theme switcher shortcut is already registered in the main process
    // We just need to register a handler (but it's handled by the ThemeContext)
    // This is here for any additional shortcuts you might want to add
  }, [registerHandler])

  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-full flex-col overflow-hidden bg-background">
        {/* Top Toolbar */}
        <TopToolbar
          project={currentProject}
          onProjectChange={setCurrentProject}
          onTogglePanel={togglePanel}
          panelState={panelState}
        />

        {/* Main Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel */}
          {panelState.leftPanel.isOpen && (
            <LeftPanel
              activeTab={panelState.leftPanel.activeTab}
              onTabChange={(tab) => setActiveTab('leftPanel', tab)}
              project={currentProject}
            />
          )}

          {/* Canvas Area */}
          <div className="relative flex-1">
            <CanvasContextMenu>
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onDrop={onDrop}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onDragOver={onDragOver}
                className="bg-background"
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onSelectionChange={onSelectionChange}
                defaultEdgeOptions={{
                  animated: true,
                  type: 'smoothstep'
                }}
                fitView
              >
                <Background
                  variant={BackgroundVariant.Dots}
                  gap={16}
                  size={1}
                  className="bg-muted/20"
                />
                <Controls className="bg-card border-border" />
                <MiniMap
                  className="bg-card/80 border border-border"
                  maskColor="rgb(0, 0, 0, 0.1)"
                  nodeColor={(node) => {
                    if (selectedNodes.includes(node.id)) {
                      return 'hsl(var(--primary))'
                    }
                    return 'hsl(var(--muted-foreground))'
                  }}
                />

                {/* Custom panels for quick actions */}
                <Panel position="top-center" className="bg-transparent">
                  <div className="flex gap-2">
                    <button
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-md',
                        'bg-primary text-primary-foreground hover:bg-primary/90',
                        'transition-colors'
                      )}
                      onClick={() => {
                        // Trigger generation for selected nodes
                        console.log('Generate', selectedNodes)
                      }}
                      disabled={selectedNodes.length === 0}
                    >
                      Generate Selected
                    </button>
                    <button
                      className={cn(
                        'px-3 py-1.5 text-xs font-medium rounded-md',
                        'bg-secondary text-secondary-foreground hover:bg-secondary/90',
                        'transition-colors'
                      )}
                      onClick={() => {
                        // Clear canvas
                        setNodes([])
                        setEdges([])
                      }}
                    >
                      Clear Canvas
                    </button>
                  </div>
                </Panel>
              </ReactFlow>
            </CanvasContextMenu>
          </div>

          {/* Right Panel */}
          {panelState.rightPanel.isOpen && (
            <RightPanel
              activeTab={panelState.rightPanel.activeTab}
              onTabChange={(tab) => setActiveTab('rightPanel', tab)}
              selectedNodes={selectedNodes}
              nodes={nodes}
              onNodesChange={setNodes}
            />
          )}
        </div>

        {/* Bottom Panel (Timeline/Sequence Editor) */}
        {panelState.bottomPanel.isOpen && (
          <BottomPanel
            height={panelState.bottomPanel.height}
            onHeightChange={(height) =>
              setPanelState((prev) => ({
                ...prev,
                bottomPanel: { ...prev.bottomPanel, height }
              }))
            }
            project={currentProject}
            zoom={timelineZoom}
            onZoomChange={setTimelineZoom}
          />
        )}
      </div>
    </ReactFlowProvider>
  )
}

function App() {
  return (
    <StorageProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </StorageProvider>
  )
}

export default App
