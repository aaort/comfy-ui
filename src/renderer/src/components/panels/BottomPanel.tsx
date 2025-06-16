import { Pause, Play, Plus, SkipBack, SkipForward, ZoomIn, ZoomOut } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../lib/utils'
import { Project } from '../../types'
import { Button } from '../ui/button'
import { ScrollArea, ScrollBar } from '../ui/scroll-area'
import { Slider } from '../ui/slider'

interface BottomPanelProps {
  height: number
  onHeightChange: (height: number) => void
  project: Project | null
}

interface TimelineFrame {
  id: string
  duration: number
  thumbnail?: string
  label: string
  type: 'panel' | 'transition' | 'effect'
}

export function BottomPanel({ height, onHeightChange }: BottomPanelProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [selectedFrames, setSelectedFrames] = useState<string[]>([])
  const resizeHandleRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)

  // Mock timeline data - in a real app, this would come from the project
  const [frames] = useState<TimelineFrame[]>([
    { id: '1', duration: 2, label: 'Panel 1', type: 'panel' },
    { id: '2', duration: 0.5, label: 'Fade', type: 'transition' },
    { id: '3', duration: 3, label: 'Panel 2', type: 'panel' },
    { id: '4', duration: 0.5, label: 'Wipe', type: 'transition' },
    { id: '5', duration: 2.5, label: 'Panel 3', type: 'panel' },
    { id: '6', duration: 1, label: 'SFX', type: 'effect' },
    { id: '7', duration: 3, label: 'Panel 4', type: 'panel' }
  ])

  const totalDuration = frames.reduce((acc, frame) => acc + frame.duration, 0)
  const pixelsPerSecond = 100 * zoom

  // Handle resize
  useEffect(() => {
    const handleRef = resizeHandleRef.current
    if (!handleRef) return

    let startY = 0
    let startHeight = 0

    const handleMouseDown = (e: MouseEvent) => {
      startY = e.clientY
      startHeight = height
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'row-resize'
    }

    const handleMouseMove = (e: MouseEvent) => {
      const deltaY = startY - e.clientY
      const newHeight = Math.max(150, Math.min(600, startHeight + deltaY))
      onHeightChange(newHeight)
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
    }

    handleRef.addEventListener('mousedown', handleMouseDown)
    return () => {
      handleRef.removeEventListener('mousedown', handleMouseDown)
    }
  }, [height, onHeightChange])

  // Handle playback
  useEffect(() => {
    if (!isPlaying) return

    const interval = setInterval(() => {
      setCurrentTime((prev) => {
        if (prev >= totalDuration) {
          setIsPlaying(false)
          return 0
        }
        return prev + 0.1
      })
    }, 100)

    return () => clearInterval(interval)
  }, [isPlaying, totalDuration])

  const handleFrameClick = useCallback((frameId: string, event: React.MouseEvent) => {
    if (event.shiftKey) {
      setSelectedFrames((prev) =>
        prev.includes(frameId) ? prev.filter((id) => id !== frameId) : [...prev, frameId]
      )
    } else {
      setSelectedFrames([frameId])
    }
  }, [])

  const handleAddFrame = useCallback(() => {
    // In a real app, this would add a new frame to the timeline
    console.log('Add frame')
  }, [])

  const getTimePosition = (time: number) => time * pixelsPerSecond

  return (
    <div className="flex flex-col border-t border-border bg-card" style={{ height: `${height}px` }}>
      {/* Resize handle */}
      <div
        ref={resizeHandleRef}
        className="group h-1 w-full cursor-row-resize bg-border hover:bg-primary/20"
      >
        <div className="mx-auto mt-[-2px] h-1 w-12 rounded-full bg-border group-hover:bg-primary/40" />
      </div>

      {/* Timeline header */}
      <div className="flex h-10 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <SkipBack className="h-3 w-3" />
          </Button>
          <Button size="icon" variant="ghost" className="h-6 w-6">
            <SkipForward className="h-3 w-3" />
          </Button>
          <div className="mx-2 h-6 w-px bg-border" />
          <span className="text-xs font-mono">
            {Math.floor(currentTime / 60)
              .toString()
              .padStart(2, '0')}
            :
            {Math.floor(currentTime % 60)
              .toString()
              .padStart(2, '0')}
            .{Math.floor((currentTime % 1) * 10)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="h-6 w-6" onClick={handleAddFrame}>
            <Plus className="h-3 w-3" />
          </Button>
          <div className="mx-2 h-6 w-px bg-border" />
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setZoom(Math.max(0.5, zoom - 0.25))}
          >
            <ZoomOut className="h-3 w-3" />
          </Button>
          <Slider
            value={[zoom]}
            onValueChange={([value]) => setZoom(value)}
            min={0.5}
            max={3}
            step={0.25}
            className="w-20"
          />
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6"
            onClick={() => setZoom(Math.min(3, zoom + 0.25))}
          >
            <ZoomIn className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Timeline ruler */}
      <div className="relative h-6 border-b border-border bg-muted/50">
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="relative h-full"
            style={{ width: `${totalDuration * pixelsPerSecond}px` }}
          >
            {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full"
                style={{ left: `${i * pixelsPerSecond}px` }}
              >
                <div className="h-full w-px bg-border" />
                <span className="absolute left-1 top-0 text-[10px] text-muted-foreground">
                  {i}s
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Timeline content */}
      <ScrollArea className="flex-1">
        <div className="relative p-4" ref={timelineRef}>
          {/* Timeline tracks */}
          <div className="space-y-2">
            {/* Main track */}
            <div className="relative h-16">
              <div
                className="relative flex h-full gap-1"
                style={{ width: `${totalDuration * pixelsPerSecond}px` }}
              >
                {frames.map((frame, index) => {
                  const startTime = frames.slice(0, index).reduce((acc, f) => acc + f.duration, 0)
                  return (
                    <div
                      key={frame.id}
                      onClick={(e) => handleFrameClick(frame.id, e)}
                      className={cn(
                        'group relative flex cursor-pointer items-center justify-center rounded border transition-all',
                        frame.type === 'panel' &&
                          'bg-primary/10 border-primary/50 hover:bg-primary/20',
                        frame.type === 'transition' &&
                          'bg-orange-500/10 border-orange-500/50 hover:bg-orange-500/20',
                        frame.type === 'effect' &&
                          'bg-purple-500/10 border-purple-500/50 hover:bg-purple-500/20',
                        selectedFrames.includes(frame.id) && 'ring-2 ring-primary'
                      )}
                      style={{
                        width: `${frame.duration * pixelsPerSecond - 4}px`,
                        position: 'absolute',
                        left: `${startTime * pixelsPerSecond}px`
                      }}
                    >
                      {frame.thumbnail ? (
                        <img
                          src={frame.thumbnail}
                          alt={frame.label}
                          className="h-full w-full rounded object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <span className="text-xs font-medium">{frame.label}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {frame.duration}s
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Audio track */}
            <div className="relative h-12">
              <div
                className="relative h-full rounded bg-muted/50"
                style={{ width: `${totalDuration * pixelsPerSecond}px` }}
              >
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-xs text-muted-foreground">Audio Track</span>
                </div>
              </div>
            </div>

            {/* Effects track */}
            <div className="relative h-12">
              <div
                className="relative h-full rounded bg-muted/50"
                style={{ width: `${totalDuration * pixelsPerSecond}px` }}
              >
                <div className="absolute inset-0 flex items-center px-2">
                  <span className="text-xs text-muted-foreground">Effects Track</span>
                </div>
              </div>
            </div>
          </div>

          {/* Playhead */}
          <div
            className="absolute top-0 z-10 h-full w-0.5 bg-red-500"
            style={{ left: `${getTimePosition(currentTime)}px` }}
          >
            <div className="absolute -top-1 -left-2 h-3 w-3 rotate-45 bg-red-500" />
          </div>
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
