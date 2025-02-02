import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyCard } from "@/components/home/PropertyCard"
import { PropertiesMap } from "@/components/property/PropertiesMap"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useLanguage } from "@/contexts/LanguageContext"
import { PropertyTypeSelect } from "@/components/property/PropertyTypeSelect"
import { Tables } from "@/integrations/supabase/types"
import { useEffect } from "react"

const Properties = () => {
  const { isAdmin } = useIsAdmin()
  const { t } = useLanguage()
  const [propertyType, setPropertyType] = useState("all")
  const navigate = useNavigate()
  
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        console.log('No active session found, redirecting to home')
        navigate('/')
      }
    }
    checkAuth()
  }, [navigate])
  
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

        <div className="bg-[#1A1F2C]">
          <PropertiesMap properties={properties} />
        </div>

        <div className="flex gap-6 flex-wrap justify-center px-4">
          {properties?.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Properties