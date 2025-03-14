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

  const ImageThumbnail = ({ src, index }: { src: string; index: number }) => {
    const isFeatureImage = src === featureImageUrl

    return (
      <div className="cursor-pointer group relative" onClick={() => onImageSelect(src, index)}>
        <AspectRatio ratio={4/3}>
          <div className="relative rounded-lg overflow-hidden">
            <BorderBeam delay={index} />
            <img
              src={src}
              alt={`${propertyName} ${index + 1}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
              <div className="text-white text-sm font-medium">Click to expand</div>
            </div>
            {isFeatureImage && (
              <div className="absolute top-2 right-2 bg-yellow-500 rounded-full p-1">
                <Star className="h-4 w-4 text-white" />
              </div>
            )}
          </div>
        </AspectRatio>
        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onSetFeatureImage(src)
            }}
          >
            Set as feature
          </Button>
        )}
      </div>
    )
  }

  return (
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
  )
}