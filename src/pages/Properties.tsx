import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyCard } from "@/components/home/PropertyCard"
import { PropertiesMap } from "@/components/property/PropertiesMap"
import { Button } from "@/components/ui/button"
import { Plus, Star } from "lucide-react"
import { Link } from "react-router-dom"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useLanguage } from "@/contexts/LanguageContext"
import { PropertyTypeSelect } from "@/components/property/PropertyTypeSelect"
import { Tables } from "@/integrations/supabase/types"
import { useToast } from "@/hooks/use-toast"

const Properties = () => {
  const { isAdmin } = useIsAdmin()
  const { t } = useLanguage()
  const [propertyType, setPropertyType] = useState("all")
  const { toast } = useToast()
  const queryClient = useQueryClient()
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', propertyType],
    queryFn: async () => {
      console.log('Fetching properties with type:', propertyType)
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (propertyType !== 'all') {
        query = query.eq('property_type', propertyType)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Error fetching properties:', error)
        throw error
      }
      console.log('Fetched properties:', data)
      return (data || []) as Tables<'properties'>[]
    }
  })

  const toggleFeatured = useMutation({
    mutationFn: async ({ propertyId, isFeatured }: { propertyId: string, isFeatured: boolean }) => {
      // First, remove featured status from all properties
      if (isFeatured) {
        await supabase
          .from('properties')
          .update({ is_featured: false })
          .eq('is_featured', true)
      }
      
      // Then update the selected property
      const { error } = await supabase
        .from('properties')
        .update({ is_featured: isFeatured })
        .eq('id', propertyId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] })
      queryClient.invalidateQueries({ queryKey: ['featured-property'] })
      toast({
        title: "Success",
        description: "Featured property updated successfully",
      })
    },
    onError: (error) => {
      console.error('Error updating featured property:', error)
      toast({
        title: "Error",
        description: "Failed to update featured property",
        variant: "destructive",
      })
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>{t('loading')}</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="fixed inset-0 bg-black" />
      
      <div className="relative space-y-8">
        <div className="flex justify-between items-center px-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-white">{t('properties')}</h1>
            <PropertyTypeSelect 
              value={propertyType}
              onValueChange={setPropertyType}
            />
          </div>
          {isAdmin && (
            <Button asChild>
              <Link to="/properties/add" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                {t('addProperty')}
              </Link>
            </Button>
          )}
        </div>

        <div className="bg-[#1A1F2C] w-full">
          <PropertiesMap properties={properties} />
        </div>

        <div className="flex gap-6 flex-wrap justify-center px-4">
          {properties?.map((property) => (
            <div key={property.id} className="relative">
              <PropertyCard property={property} />
              {isAdmin && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 hover:bg-black/70"
                  onClick={() => toggleFeatured.mutate({ 
                    propertyId: property.id, 
                    isFeatured: !property.is_featured 
                  })}
                >
                  <Star 
                    className={`h-4 w-4 ${property.is_featured ? 'fill-yellow-500 text-yellow-500' : 'text-white'}`} 
                  />
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Properties