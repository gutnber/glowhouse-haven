import { Star, X } from "lucide-react"
import { useState } from "react"
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
  const { toast } = useToast()
  const { isAdmin } = useIsAdmin()

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

  const ImageThumbnail = ({ src, index }: { src: string; index: number }) => {
    const isFeatureImage = src === featureImageUrl

    return (
      <div className="cursor-pointer group relative" onClick={() => setSelectedImage(src)}>
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
          <div className="relative w-full h-full">
            <img
              src={selectedImage || ''}
              alt="Expanded view"
              className="w-full h-full object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
