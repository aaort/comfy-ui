import { useCallback, useState } from 'react'
import { useReactFlow } from 'reactflow'
import { NodeType } from '../../types'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '../ui/context-menu'

export function CanvasContextMenu({ children }: { children?: React.ReactNode }) {
  const { screenToFlowPosition, addNodes, getNodes, deleteElements } = useReactFlow()
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })

  const handleContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault()
    setContextMenuPosition({ x: event.clientX, y: event.clientY })
  }, [])

  const addNode = useCallback(
    (type: NodeType) => {
      const position = screenToFlowPosition({
        x: contextMenuPosition.x,
        y: contextMenuPosition.y
      })

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: type.replace('-', ' ').toUpperCase() }
      }

      addNodes([newNode])
    },
    [contextMenuPosition, screenToFlowPosition, addNodes]
  )

  const duplicateSelectedNodes = useCallback(() => {
    const nodes = getNodes()
    const selectedNodes = nodes.filter((node) => node.selected)

    if (selectedNodes.length === 0) return

    const duplicatedNodes = selectedNodes.map((node) => ({
      ...node,
      id: `${node.id}-copy-${Date.now()}`,
      position: {
        x: node.position.x + 50,
        y: node.position.y + 50
      },
      selected: false
    }))

    addNodes(duplicatedNodes)
  }, [getNodes, addNodes])

  const deleteSelectedNodes = useCallback(() => {
    const nodes = getNodes()
    const selectedNodes = nodes.filter((node) => node.selected)
    deleteElements({ nodes: selectedNodes, edges: [] })
  }, [getNodes, deleteElements])

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild onContextMenu={handleContextMenu}>
        {children || <div className="h-full w-full" />}
      </ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuLabel>Canvas Actions</ContextMenuLabel>
        <ContextMenuSeparator />

        <ContextMenuSub>
          <ContextMenuSubTrigger>Add Node</ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            <ContextMenuLabel>Input Nodes</ContextMenuLabel>
            <ContextMenuItem onClick={() => addNode('text-prompt')}>
              Text Prompt
              <ContextMenuShortcut>⌘T</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => addNode('image-input')}>
              Image Input
              <ContextMenuShortcut>⌘I</ContextMenuShortcut>
            </ContextMenuItem>
            <ContextMenuItem onClick={() => addNode('video-input')}>
              Video Input
              <ContextMenuShortcut>⌘V</ContextMenuShortcut>
            </ContextMenuItem>

            <ContextMenuSeparator />
            <ContextMenuLabel>Style & Reference</ContextMenuLabel>
            <ContextMenuItem onClick={() => addNode('style-reference')}>
              Style Reference
            </ContextMenuItem>
            <ContextMenuItem onClick={() => addNode('character-reference')}>
              Character Reference
            </ContextMenuItem>

            <ContextMenuSeparator />
            <ContextMenuLabel>Composition</ContextMenuLabel>
            <ContextMenuItem onClick={() => addNode('scene-composer')}>
              Scene Composer
            </ContextMenuItem>
            <ContextMenuItem onClick={() => addNode('dialogue-box')}>Dialogue Box</ContextMenuItem>
            <ContextMenuItem onClick={() => addNode('panel-layout')}>Panel Layout</ContextMenuItem>

            <ContextMenuSeparator />
            <ContextMenuLabel>Sequencing</ContextMenuLabel>
            <ContextMenuItem onClick={() => addNode('sequence-builder')}>
              Sequence Builder
            </ContextMenuItem>
            <ContextMenuItem onClick={() => addNode('storyboard')}>Storyboard</ContextMenuItem>

            <ContextMenuSeparator />
            <ContextMenuLabel>Output Nodes</ContextMenuLabel>
            <ContextMenuItem onClick={() => addNode('image-output')}>Image Output</ContextMenuItem>
            <ContextMenuItem onClick={() => addNode('video-output')}>Video Output</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem onClick={duplicateSelectedNodes}>
          Duplicate
          <ContextMenuShortcut>⌘D</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem onClick={deleteSelectedNodes}>
          Delete
          <ContextMenuShortcut>⌫</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem>
          Select All
          <ContextMenuShortcut>⌘A</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem>
          Clear Selection
          <ContextMenuShortcut>⎋</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuSeparator />

        <ContextMenuItem>
          Fit View
          <ContextMenuShortcut>⌘0</ContextMenuShortcut>
        </ContextMenuItem>

        <ContextMenuItem>
          Center View
          <ContextMenuShortcut>⌘.</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
