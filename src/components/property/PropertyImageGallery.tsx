import { Star, X, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { House } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

interface PropertyImageGalleryProps {
  images: string[]
  propertyId: string
  propertyName: string
  featureImageUrl: string | null
}

export const PropertyImageGallery = ({ images, propertyId, propertyName, featureImageUrl }: PropertyImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { isAdmin } = useIsAdmin()

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!selectedImage) return
    
    const currentIndex = images.indexOf(selectedImage)
    
    if (e.key === 'ArrowLeft' && currentIndex > 0) {
      setSelectedImage(images[currentIndex - 1])
      setSelectedIndex(currentIndex - 1)
    } else if (e.key === 'ArrowRight' && currentIndex < images.length - 1) {
      setSelectedImage(images[currentIndex + 1])
      setSelectedIndex(currentIndex + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, images])

  // Fetch the current property to get the feature_image_position
  const fetchPropertyPosition = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('feature_image_position')
        .eq('id', propertyId)
        .single()

      if (error) throw error

      if (data.feature_image_position) {
        const [x, y] = data.feature_image_position.split(' ').map(val => 
          parseFloat(val.replace('%', ''))
        )
        setPosition({ x, y })
      }
    } catch (error) {
      console.error('Error fetching image position:', error)
    }
  }

  const handleImageSelect = (src: string, index: number) => {
    setSelectedImage(src)
    setSelectedIndex(index)
    if (src === featureImageUrl) {
      fetchPropertyPosition()
    } else {
      setPosition({ x: 50, y: 50 })
    }
  }

  const navigateImage = (direction: 'prev' | 'next') => {
    const currentIndex = images.indexOf(selectedImage || '')
    let newIndex = currentIndex

    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else if (direction === 'next' && currentIndex < images.length - 1) {
      newIndex = currentIndex + 1
    }

    setSelectedImage(images[newIndex])
    setSelectedIndex(newIndex)
  }

  const handleSetFeatureImage = async (imageUrl: string) => {
    try {
      const { error } = await supabase
        .from('properties')
        .update({ feature_image_url: imageUrl })
        .eq('id', propertyId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Feature image updated successfully",
      })
    } catch (error) {
      console.error('Error updating feature image:', error)
      toast({
        title: "Error",
        description: "Failed to update feature image",
        variant: "destructive",
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin || !selectedImage) return
    setIsDragging(true)
    e.preventDefault() // Prevent image dragging
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !isAdmin || !selectedImage) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    setPosition({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = async () => {
    if (!isDragging || !selectedImage || selectedImage !== featureImageUrl) return
    setIsDragging(false)

    // Convert position to CSS object-position format and update in database
    const positionString = `${position.x}% ${position.y}%`
    try {
      const { error } = await supabase
        .from('properties')
        .update({ feature_image_position: positionString })
        .eq('id', propertyId)

      if (error) throw error

      toast({
        title: "Success",
        description: "Image position updated successfully",
      })
    } catch (error) {
      console.error('Error updating image position:', error)
      toast({
        title: "Error",
        description: "Failed to update image position",
        variant: "destructive",
      })
    }
  }

  const ImageThumbnail = ({ src, index }: { src: string; index: number }) => {
    const isFeatureImage = src === featureImageUrl

    return (
      <div className="cursor-pointer group relative" onClick={() => handleImageSelect(src, index)}>
        <AspectRatio ratio={4/3}>
          <img
            src={src}
            alt={`${propertyName} ${index + 1}`}
            className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
            <div className="text-white text-sm font-medium">Click to expand</div>
          </div>
          {isFeatureImage && (
            <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
              <Star className="h-4 w-4 text-white" />
            </div>
          )}
        </AspectRatio>
        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              handleSetFeatureImage(src)
            }}
          >
            Set as feature
          </Button>
        )}
      </div>
    )
  }

  if (!images || images.length === 0) {
    return (
      <div className="col-span-4 bg-muted rounded-lg flex items-center justify-center py-12">
        <House className="h-24 w-24 text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {images.map((image, index) => (
            <CarouselItem key={image} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4">
              <ImageThumbnail src={image} index={index} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <div className="absolute right-4 top-4 z-10 flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateImage('prev')}
              disabled={selectedIndex === 0}
              className="bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigateImage('next')}
              disabled={selectedIndex === images.length - 1}
              className="bg-black/20 hover:bg-black/40 text-white"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-black/20 hover:bg-black/40 text-white"
              onClick={() => setSelectedImage(null)}
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
    </>
  )
}
