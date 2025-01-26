import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { Button } from "@/components/ui/button"
import { PropertyHeader } from "@/components/property/PropertyHeader"
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery"
import { PropertyDetails } from "@/components/property/PropertyDetails"
import { House } from "lucide-react"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useToast } from "@/hooks/use-toast"
import { useRef, useState } from "react"

const PropertyProfile = () => {
  const { id } = useParams()
  const { isAdmin } = useIsAdmin()
  const { toast } = useToast()
  const imageRef = useRef<HTMLImageElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 50, y: 50 }) // Percentage values
  
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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin) return
    setIsDragging(true)
    e.preventDefault() // Prevent image dragging
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !isAdmin) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x))
    const clampedY = Math.max(0, Math.min(100, y))

    setPosition({ x: clampedX, y: clampedY })
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    setIsDragging(false)

    // Convert position to CSS object-position format
    const positionString = `${position.x}% ${position.y}%`
    updateImagePositionMutation.mutate(positionString)
  }

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
        <div 
          ref={containerRef}
          className="relative"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div className="w-full h-[300px] relative rounded-lg overflow-hidden">
            <img
              ref={imageRef}
              src={property.feature_image_url}
              alt={`${property.name} banner`}
              className={`w-full h-full object-cover transition-all duration-200 ${isAdmin ? 'cursor-move' : ''}`}
              style={{ 
                objectPosition: isDragging 
                  ? `${position.x}% ${position.y}%` 
                  : property.feature_image_position || '50% 50%'
              }}
              onMouseDown={handleMouseDown}
            />
          </div>
          {isAdmin && (
            <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {isDragging ? 'Release to save position' : 'Click and drag to adjust image position'}
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