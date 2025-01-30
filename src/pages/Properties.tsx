import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { PropertyCard } from "@/components/home/PropertyCard"
import { PropertiesMap } from "@/components/property/PropertiesMap"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Link } from "react-router-dom"
import { useIsAdmin } from "@/hooks/useIsAdmin"

const Properties = () => {
  const { isAdmin } = useIsAdmin()
  
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return data
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Loading properties...</p>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen">
      {/* Solid black background */}
      <div className="fixed inset-0 bg-black" />
      
      {/* Content */}
      <div className="relative space-y-8 max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">Properties</h1>
          {isAdmin && (
            <Button asChild>
              <Link to="/properties/add" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Property
              </Link>
            </Button>
          )}
        </div>

        <PropertiesMap />

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