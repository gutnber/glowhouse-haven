
import { Star } from "lucide-react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { BorderBeam } from "@/components/ui/border-beam"

interface ThumbnailCarouselProps {
  images: string[]
  propertyName: string
  featureImageUrl: string | null
  onImageSelect: (src: string, index: number) => void
  onSetFeatureImage: (imageUrl: string) => void
}

export const ThumbnailCarousel = ({
  images,
  propertyName,
  featureImageUrl,
  onImageSelect,
  onSetFeatureImage
}: ThumbnailCarouselProps) => {
  const { isAdmin } = useIsAdmin()

  return (
    <Carousel className="w-full">
      <CarouselContent className="-ml-2 md:-ml-4">
        {images.map((image, index) => (
          <CarouselItem key={image} className="pl-2 md:pl-4 basis-1/2 md:basis-1/4">
            <div className="relative">
              <AspectRatio ratio={4/3}>
                <button 
                  className="w-full h-full p-0 m-0 border-0 bg-transparent cursor-pointer"
                  onClick={() => onImageSelect(image, index)}
                  aria-label={`View ${propertyName} image ${index + 1}`}
                >
                  <div className="relative w-full h-full rounded-lg overflow-hidden">
                    <BorderBeam delay={index} />
                    <img
                      src={image}
                      alt={`${propertyName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                      <div className="absolute inset-0 flex items-center justify-center text-white text-sm font-medium">
                        View larger
                      </div>
                    </div>
                    {image === featureImageUrl && (
                      <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                        <Star className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                </button>
              </AspectRatio>
              
              {isAdmin && (
                <Button
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSetFeatureImage(image);
                  }}
                >
                  Set as feature
                </Button>
              )}
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}
