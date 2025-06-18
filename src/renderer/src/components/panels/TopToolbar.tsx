import { ShortcutsInfo } from '@/components/ui/shortcut-info'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import {
  Download,
  FolderOpen,
  HelpCircle,
  Keyboard,
  Menu,
  PanelBottom,
  PanelLeft,
  PanelRight,
  Pause,
  Play,
  RotateCcw,
  Save,
  Settings,
  Upload
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { cn } from '../../lib/utils'
import { PanelState, Project, ProjectType } from '../../types'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'

interface TopToolbarProps {
  project: Project | null
  onProjectChange: (project: Project | null) => void
  onTogglePanel: (panel: keyof PanelState) => void
  panelState: PanelState
}

export function TopToolbar({
  project,
  onProjectChange,
  onTogglePanel,
  panelState
}: TopToolbarProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showShortcuts, setShowShortcuts] = useState(false)

  const handleNewProject = useCallback(() => {
    const newProject: Project = {
      id: `project-${Date.now()}`,
      name: 'Untitled Project',
      type: 'comic',
      createdAt: new Date(),
      updatedAt: new Date(),
      settings: {},
      assets: [],
      workflow: { nodes: [], edges: [] }
    }
    onProjectChange(newProject)
  }, [onProjectChange])

  const handleSaveProject = useCallback(() => {
    if (!project) return
    // In a real app, this would save to file system or cloud
    console.log('Saving project:', project)
    // Show success toast
  }, [project])

  const handleLoadProject = useCallback(() => {
    // In a real app, this would open a file dialog
    console.log('Loading project...')
  }, [])

  const handleExport = useCallback(() => {
    if (!project) return
    // In a real app, this would export the project
    console.log('Exporting project:', project)
  }, [project])

  const handleGenerate = useCallback(() => {
    setIsGenerating(!isGenerating)
    // In a real app, this would trigger generation
    console.log('Generating...', isGenerating)
  }, [isGenerating])

  const handleShowShortcuts = useCallback(() => {
    setShowShortcuts(true)
  }, [])

  const handleHideShortcuts = useCallback(() => {
    setShowShortcuts(false)
  }, [])

  return (
    <div className="flex h-14 items-center justify-between border-b border-border bg-card px-4">
      {/* Left section - Project actions */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Project</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleNewProject}>
              New Project
              <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLoadProject}>
              <FolderOpen className="mr-2 h-4 w-4" />
              Open Project
              <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSaveProject} disabled={!project}>
              <Save className="mr-2 h-4 w-4" />
              Save Project
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Upload className="mr-2 h-4 w-4" />
              Import Assets
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleExport} disabled={!project}>
              <Download className="mr-2 h-4 w-4" />
              Export
              <DropdownMenuShortcut>⌘E</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Recent Projects</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Quit
              <DropdownMenuShortcut>⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="mx-2 h-8 w-px bg-border" />

        <Button variant="ghost" size="sm" onClick={handleSaveProject} disabled={!project}>
          <Save className="mr-2 h-4 w-4" />
          Save
        </Button>

        <div className="mx-2 h-8 w-px bg-border" />

        {/* Project name and type */}
        {project && (
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">{project.name}</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                  {project.type}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Project Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup
                  value={project.type}
                  onValueChange={(value) =>
                    onProjectChange({ ...project, type: value as ProjectType })
                  }
                >
                  <DropdownMenuRadioItem value="comic">Comic</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="storyboard">Storyboard</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="animation">Animation</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="illustration">Illustration</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Center section - Generation controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={isGenerating ? 'destructive' : 'default'}
          size="sm"
          onClick={handleGenerate}
          className="min-w-[100px]"
        >
          {isGenerating ? (
            <>
              <Pause className="mr-2 h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Generate
            </>
          )}
        </Button>
        <Button variant="ghost" size="icon" title="Reset">
          <RotateCcw className="h-4 w-4" />
        </Button>
      </div>

      {/* Right section - UI controls */}
      <div className="flex items-center gap-2">
        {/* Panel toggles */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePanel('leftPanel')}
            className={cn(panelState.leftPanel.isOpen && 'bg-accent')}
            title="Toggle left panel"
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePanel('bottomPanel')}
            className={cn(panelState.bottomPanel.isOpen && 'bg-accent')}
            title="Toggle bottom panel"
          >
            <PanelBottom className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onTogglePanel('rightPanel')}
            className={cn(panelState.rightPanel.isOpen && 'bg-accent')}
            title="Toggle right panel"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="mx-2 h-8 w-px bg-border" />

        {/* Theme toggle */}
        <ThemeToggle />

        {/* Settings */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" title="Settings">
              <Settings className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Settings</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Preferences
              <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleShowShortcuts}>
              <Keyboard className="mr-2 h-4 w-4" />
              Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked>Auto-save</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked>Show grid</DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem>Snap to grid</DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>About</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Help */}
        <Button variant="ghost" size="icon" title="Help">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </div>

      {/* Shortcuts Info Modal */}
      <ShortcutsInfo isOpen={showShortcuts} onClose={handleHideShortcuts} />
    </div>
  )
}
