import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyCard } from "@/components/home/PropertyCard"
import { PropertiesMap } from "@/components/property/PropertiesMap"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useLanguage } from "@/contexts/LanguageContext"
import { PropertyTypeSelect } from "@/components/property/PropertyTypeSelect"

const Properties = () => {
  const { isAdmin } = useIsAdmin()
  const { t } = useLanguage()
  const [propertyType, setPropertyType] = useState("all")
  
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ['properties', propertyType],
    queryFn: async () => {
      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (propertyType !== 'all') {
        query = query.eq('property_type', propertyType)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
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
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-black" />
      
      <div className="relative space-y-8 max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
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

        <div className="backdrop-blur-sm bg-white/5 rounded-xl border border-white/20 p-4">
          <PropertiesMap properties={properties} />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Properties