import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { Button } from "@/components/ui/button"
import { PropertyHeader } from "@/components/property/PropertyHeader"
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery"
import { PropertyDetails } from "@/components/property/PropertyDetails"

const PropertyProfile = () => {
  const { id } = useParams()
  
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