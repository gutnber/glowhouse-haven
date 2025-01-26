import { Star, X } from "lucide-react"
import { useState, useRef } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { House } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useIsAdmin } from "@/hooks/useIsAdmin"

interface PropertyImageGalleryProps {
  images: string[]
  propertyId: string
  propertyName: string
  featureImageUrl: string | null
}

export const PropertyImageGallery = ({ images, propertyId, propertyName, featureImageUrl }: PropertyImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 }) // Percentage values
  const containerRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const { isAdmin } = useIsAdmin()

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

  // When an image is selected for viewing, fetch its position if it's the feature image
  const handleImageSelect = (src: string) => {
    setSelectedImage(src)
    if (src === featureImageUrl) {
      fetchPropertyPosition()
    } else {
      setPosition({ x: 50, y: 50 }) // Reset position for non-feature images
    }
  }

  if (!images || images.length === 0) {
    return (
      <div className="col-span-4 bg-muted rounded-lg flex items-center justify-center py-12">
        <House className="h-24 w-24 text-muted-foreground" />
      </div>
    )
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
      <div className="cursor-pointer group relative" onClick={() => handleImageSelect(src)}>
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

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <ImageThumbnail key={image} src={image} index={index} />
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-4 z-10"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-4 w-4" />
          </Button>
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
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}