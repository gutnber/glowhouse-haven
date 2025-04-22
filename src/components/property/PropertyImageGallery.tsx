
import { House } from "lucide-react"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { ThumbnailCarousel } from "./gallery/ThumbnailCarousel"
import { FullScreenViewer } from "./gallery/FullScreenViewer"

interface PropertyImageGalleryProps {
  images: string[]
  propertyId: string
  propertyName: string
  featureImageUrl: string | null
}

export const PropertyImageGallery = ({ 
  images, 
  propertyId, 
  propertyName, 
  featureImageUrl 
}: PropertyImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const { toast } = useToast()

  const handleImageSelect = (src: string, index: number) => {
    console.log("Image selected in gallery component:", src, "index:", index)
    setSelectedImage(src)
    setSelectedIndex(index)
    if (src === featureImageUrl) {
      fetchPropertyPosition()
    } else {
      setPosition({ x: 50, y: 50 })
    }
  }

  const fetchPropertyPosition = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('feature_image_position')
        .eq('id', propertyId)
        .single()

      if (error) throw error

      if (data?.feature_image_position) {
        const [x, y] = data.feature_image_position.split(' ').map(val => 
          parseFloat(val.replace('%', ''))
        )
        setPosition({ x, y })
      }
    } catch (error) {
      console.error('Error fetching image position:', error)
    }
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

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (!selectedImage) return
    
    const currentIndex = images.indexOf(selectedImage)
    let newIndex = currentIndex

    if (direction === 'prev' && currentIndex > 0) {
      newIndex = currentIndex - 1
    } else if (direction === 'next' && currentIndex < images.length - 1) {
      newIndex = currentIndex + 1
    }

    setSelectedImage(images[newIndex])
    setSelectedIndex(newIndex)
  }

  const handlePositionSave = async () => {
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

  if (!images || images.length === 0) {
    return (
      <div className="col-span-4 bg-muted rounded-lg flex items-center justify-center py-12">
        <House className="h-24 w-24 text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <ThumbnailCarousel
        images={images}
        propertyName={propertyName}
        featureImageUrl={featureImageUrl}
        onImageSelect={handleImageSelect}
        onSetFeatureImage={handleSetFeatureImage}
      />

      <FullScreenViewer
        selectedImage={selectedImage}
        selectedIndex={selectedIndex}
        images={images}
        featureImageUrl={featureImageUrl}
        position={position}
        onClose={() => setSelectedImage(null)}
        onNavigate={handleNavigate}
        onPositionChange={setPosition}
        onPositionSave={handlePositionSave}
      />
    </>
  )
}
