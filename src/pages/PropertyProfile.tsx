import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { Button } from "@/components/ui/button"
import { PropertyHeader } from "@/components/property/PropertyHeader"
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery"
import { PropertyDetails } from "@/components/property/PropertyDetails"
import { House, ArrowDown, ArrowUp } from "lucide-react"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useToast } from "@/hooks/use-toast"

const PropertyProfile = () => {
  const { id } = useParams()
  const { isAdmin } = useIsAdmin()
  const { toast } = useToast()
  
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

  const updateImagePositionMutation = useMutation({
    mutationFn: async (position: string) => {
      const { error } = await supabase
        .from('properties')
        .update({ feature_image_position: position })
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Image position updated successfully",
      })
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update image position",
        variant: "destructive",
      })
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
          <Link to="/properties">Back to Properties</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <PropertyHeader
        id={property.id}
        name={property.name}
        address={property.address}
      />

      {property.feature_image_url ? (
        <div className="relative">
          <div className="w-full h-[300px] relative rounded-lg overflow-hidden">
            <img
              src={property.feature_image_url}
              alt={`${property.name} banner`}
              className="w-full h-full object-cover"
              style={{ objectPosition: property.feature_image_position || 'center' }}
            />
          </div>
          {isAdmin && (
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateImagePositionMutation.mutate('center top')}
              >
                <ArrowUp className="h-4 w-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateImagePositionMutation.mutate('center center')}
              >
                Center
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => updateImagePositionMutation.mutate('center bottom')}
              >
                <ArrowDown className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[300px] bg-muted rounded-lg flex items-center justify-center">
          <House className="h-24 w-24 text-muted-foreground" />
        </div>
      )}

      <PropertyImageGallery
        images={property.images || []}
        propertyId={property.id}
        propertyName={property.name}
        featureImageUrl={property.feature_image_url}
      />

      <PropertyDetails
        bedrooms={property.bedrooms}
        bathrooms={property.bathrooms}
        buildYear={property.build_year}
        price={property.price}
        arv={property.arv}
        description={property.description}
        features={property.features}
      />
    </div>
  )
}

export default PropertyProfile