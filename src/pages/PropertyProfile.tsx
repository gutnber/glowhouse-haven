import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { House, MapPin, Bed, Bath, DollarSign, Info, CalendarClock, ChevronLeft, Pencil, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useState } from "react"

const PropertyProfile = () => {
  const { id } = useParams()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  
  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Tables<'properties'>
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Loading property...</p>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <p className="text-xl">Property not found</p>
        <Button asChild>
          <Link to="/properties">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <Button variant="ghost" asChild className="-ml-4">
            <Link to="/properties">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Properties
            </Link>
          </Button>
          <h1 className="text-4xl font-bold">{property.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {property.address}
          </div>
        </div>
        <Button asChild>
          <Link to={`/properties/${id}/edit`}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit Property
          </Link>
        </Button>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-4 gap-4">
        {property.images && property.images.length > 0 ? (
          <>
            <div className="col-span-2 row-span-2 cursor-pointer group relative" onClick={() => setSelectedImage(property.images[0])}>
              <AspectRatio ratio={16/9}>
                <img
                  src={property.images[0]}
                  alt={`${property.name} main`}
                  className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="text-white text-sm font-medium">Click to expand</div>
                </div>
              </AspectRatio>
            </div>
            <div className="grid grid-cols-2 col-span-2 gap-4">
              {property.images.slice(1, 5).map((image, index) => (
                <div key={image} className="cursor-pointer group relative" onClick={() => setSelectedImage(image)}>
                  <AspectRatio ratio={1}>
                    <img
                      src={image}
                      alt={`${property.name} ${index + 2}`}
                      className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <div className="text-white text-sm font-medium">Click to expand</div>
                    </div>
                  </AspectRatio>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="col-span-4 bg-muted rounded-lg flex items-center justify-center py-12">
            <House className="h-24 w-24 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <div className="text-muted-foreground">Bedrooms</div>
                <div className="flex items-center gap-2 text-lg">
                  <Bed className="h-5 w-5" />
                  {property.bedrooms}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-muted-foreground">Bathrooms</div>
                <div className="flex items-center gap-2 text-lg">
                  <Bath className="h-5 w-5" />
                  {property.bathrooms}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-muted-foreground">Year Built</div>
                <div className="flex items-center gap-2 text-lg">
                  <CalendarClock className="h-5 w-5" />
                  {property.build_year}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-muted-foreground">Price</div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <DollarSign className="h-5 w-5" />
                  {property.price.toLocaleString()}
                </div>
              </div>
            </div>
          </Card>

          {property.description && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {property.arv && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Investment Details</h2>
              <div className="space-y-2">
                <div className="text-muted-foreground">After Repair Value (ARV)</div>
                <div className="flex items-center gap-2 text-lg font-semibold">
                  <DollarSign className="h-5 w-5" />
                  {property.arv.toLocaleString()}
                </div>
              </div>
            </Card>
          )}

          {property.features && property.features.length > 0 && (
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">Features</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map((feature, index) => (
                  <div
                    key={index}
                    className={cn(
                      "px-3 py-1 rounded-full text-sm",
                      "bg-primary/10 text-primary"
                    )}
                  >
                    {feature}
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Image Modal */}
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
    </div>
  )
}

export default PropertyProfile