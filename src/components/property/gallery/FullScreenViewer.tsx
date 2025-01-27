import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useEffect, useRef, useState } from "react"

interface FullScreenViewerProps {
  selectedImage: string | null
  selectedIndex: number
  images: string[]
  featureImageUrl: string | null
  position: { x: number; y: number }
  onClose: () => void
  onNavigate: (direction: 'prev' | 'next') => void
  onPositionChange: (position: { x: number; y: number }) => void
  onPositionSave: () => void
}

export const FullScreenViewer = ({
  selectedImage,
  selectedIndex,
  images,
  featureImageUrl,
  position,
  onClose,
  onNavigate,
  onPositionChange,
  onPositionSave
}: FullScreenViewerProps) => {
  const { isAdmin } = useIsAdmin()
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return
    
    if (e.key === 'ArrowLeft' && selectedIndex > 0) {
      onNavigate('prev')
    } else if (e.key === 'ArrowRight' && selectedIndex < images.length - 1) {
      onNavigate('next')
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, selectedIndex, images])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin || !selectedImage || selectedImage !== featureImageUrl) return
    setIsDragging(true)
    e.preventDefault()
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !isAdmin || !selectedImage || selectedImage !== featureImageUrl) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    onPositionChange({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = () => {
    if (!isDragging || !selectedImage || selectedImage !== featureImageUrl) return
    setIsDragging(false)
    onPositionSave()
  }

  return (
    <Dialog open={!!selectedImage} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
        <div className="absolute right-4 top-4 z-10 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('prev')}
            disabled={selectedIndex === 0}
            className="bg-black/20 hover:bg-black/40 text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('next')}
            disabled={selectedIndex === images.length - 1}
            className="bg-black/20 hover:bg-black/40 text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="bg-black/20 hover:bg-black/40 text-white"
            onClick={() => onClose()}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div 
          ref={containerRef}
          className="relative w-full h-full"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <img
            src={selectedImage || ''}
            alt="Expanded view"
            className={`w-full h-full object-contain transition-all duration-200 ${isAdmin && selectedImage === featureImageUrl ? 'cursor-move' : ''}`}
            style={{ 
              objectPosition: `${position.x}% ${position.y}%`
            }}
            onMouseDown={handleMouseDown}
          />
          {isAdmin && selectedImage === featureImageUrl && (
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {isDragging ? 'Release to save position' : 'Click and drag to adjust image position'}
            </div>
          )}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
            Use arrow keys or buttons to navigate
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}