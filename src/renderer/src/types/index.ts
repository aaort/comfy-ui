import { Edge, Node } from 'reactflow'

// Node types
export type NodeType =
  | 'text-prompt'
  | 'image-input'
  | 'video-input'
  | 'image-output'
  | 'video-output'
  | 'style-reference'
  | 'character-reference'
  | 'scene-composer'
  | 'dialogue-box'
  | 'panel-layout'
  | 'sequence-builder'
  | 'storyboard'

// Extended node type for workflow
export interface WorkflowNode extends Node {
  type: NodeType
  data: Record<string, unknown>
}

// Panel state management
export interface PanelState {
  leftPanel: {
    isOpen: boolean
    activeTab: 'nodes' | 'assets' | 'layers'
  }
  rightPanel: {
    isOpen: boolean
    activeTab: 'properties' | 'styles' | 'export'
  }
  bottomPanel: {
    isOpen: boolean
    height: number
  }
}

// Project types
export type ProjectType = 'comic' | 'storyboard' | 'animation' | 'illustration'

export interface Project {
  id: string
  name: string
  type: ProjectType
  createdAt: Date
  updatedAt: Date
  settings: ProjectSettings
  assets: Asset[]
  workflow: {
    nodes: WorkflowNode[]
    edges: Edge[]
  }
}

export interface ProjectSettings {
  resolution?: {
    width: number
    height: number
  }
  frameRate?: number
  colorSpace?: 'sRGB' | 'Adobe RGB' | 'DCI-P3'
  exportFormat?: 'png' | 'jpg' | 'webp' | 'pdf' | 'mp4'
}

// Asset management
export interface Asset {
  id: string
  name: string
  type: 'image' | 'video' | 'audio' | 'font' | 'style'
  path: string
  thumbnail?: string
  metadata?: Record<string, unknown>
}

// Node data types
export interface TextPromptNodeData {
  label: string
  prompt: string
  negativePrompt?: string
  seed?: number
  temperature?: number
}

export interface ImageInputNodeData {
  label: string
  imagePath?: string
  imageData?: string
}

export interface VideoInputNodeData {
  label: string
  videoPath?: string
  startFrame?: number
  endFrame?: number
}

export interface ImageOutputNodeData {
  label: string
  width?: number
  height?: number
  format?: 'png' | 'jpg' | 'webp'
  quality?: number
}

export interface VideoOutputNodeData {
  label: string
  width?: number
  height?: number
  fps?: number
  format?: 'mp4' | 'webm' | 'gif'
  quality?: number
}

export interface StyleReferenceNodeData {
  label: string
  stylePreset?: string
  customStyle?: {
    name: string
    description: string
    parameters: Record<string, unknown>
  }
}

export interface CharacterNodeData {
  name: string
  label: string
  pose?: string
  traits: string[]
  description: string
  expression?: string
  visualReference?: string
  outfit?: string
  referenceImages?: Image[]
  isProcessing?: boolean
  error?: string
}

export interface SceneNodeData {
  label: string
  referenceImages: Image[]
  isProcessing: boolean
  location: string
  timeOfDay: 'morning' | 'noon' | 'afternoon' | 'evening' | 'night'
  weather?: string
  mood?: string
  elements: string[]
  error?: string
}

export interface DialogueNodeData {
  label: string
  character?: string
  text: string
  emotion?: string
  style?: 'speech' | 'thought' | 'narration' | 'sound-effect'
  position?: 'top' | 'right' | 'bottom' | 'left'
  isProcessing?: boolean
  error?: string
}

export interface PanelLayoutNodeData {
  label: string
  rows: number
  columns: number
  gutterSize: number
  panelOrder: number[]
  panelSizes?: number[]
  layout?: 'single' | 'split-horizontal' | 'split-vertical' | 'grid' | 'staggered' | 'freeform'
  panels?: Panel[]
  isProcessing?: boolean
  error?: string
}

export interface SequenceNodeData {
  label: string
  frames: Frame[]
  duration: number
  transition?: 'cut' | 'fade' | 'dissolve' | 'wipe'
  fps?: number
  isProcessing?: boolean
  error?: string
}

export interface StoryboardNodeData {
  label: string
  title: string
  description: string
  duration: number
  shots: Shot[]
  scenes?: Scene[]
  isProcessing?: boolean
  error?: string
}

// Supporting types
export interface Image {
  id: string
  url: string
  alt?: string
  thumbnail?: string
}

export interface Panel {
  id: string
  content?: string
  width?: number
  height?: number
  position?: {
    width: number
    height: number
  }
}

export interface Scene {
  id: string
  title: string
  description: string
  duration: number
  shots: Shot[]
  thumbnail?: Image
  dialogue?: string[]
}

export interface Frame {
  id: string
  content: string
  duration: number
  transition?: string
}

export interface Shot {
  id: string
  number: number
  angle: string
  movement?: string
  description: string
  duration: number
  dialogue?: string
  notes?: string
}

// Canvas context menu
export interface ContextMenuItem {
  id: string
  label: string
  icon?: string
  shortcut?: string
  action: () => void
  disabled?: boolean
  separator?: boolean
  submenu?: ContextMenuItem[]
}

// Export types
export interface ExportOptions {
  format: 'png' | 'jpg' | 'pdf' | 'mp4' | 'gif'
  quality: number
  scale: number
  includeMetadata: boolean
  outputPath?: string
}

// Generation settings
export interface GenerationSettings {
  model: string
  steps: number
  cfgScale: number
  seed?: number
  batchSize: number
  scheduler: string
}

// Theme types
export interface ThemeColors {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
}
