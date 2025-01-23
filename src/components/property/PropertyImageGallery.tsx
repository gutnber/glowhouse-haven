import { X } from "lucide-react"
import { useState } from "react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { House } from "lucide-react"

interface PropertyImageGalleryProps {
  images: string[]
  propertyName: string
}

export const PropertyImageGallery = ({ images, propertyName }: PropertyImageGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  if (!images || images.length === 0) {
    return (
      <div className="col-span-4 bg-muted rounded-lg flex items-center justify-center py-12">
        <House className="h-24 w-24 text-muted-foreground" />
      </div>
    )
  }

  const ImageThumbnail = ({ src, index }: { src: string; index: number }) => (
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
      </AspectRatio>
    </div>
  )

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