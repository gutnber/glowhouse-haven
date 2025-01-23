import { House, MapPin, Bed, Bath, DollarSign, Info, CalendarClock, ListPlus } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const Properties = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
      
      if (error) throw error
      return data as Tables<'properties'>[]
    }
  })

  if (isLoading) {
    return <div>Loading properties...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Properties</h1>
        <Button>
          <ListPlus className="mr-2 h-4 w-4" />
          Add Property
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties?.map((property) => (
          <Card key={property.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <House className="h-5 w-5" />
                {property.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {property.address}
              </div>
              <div className="flex gap-4">
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  {property.bedrooms} beds
                </div>
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  {property.bathrooms} baths
                </div>
              </div>
              <div className="flex items-center gap-2">
                <CalendarClock className="h-4 w-4" />
                Built in {property.build_year}
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <DollarSign className="h-4 w-4" />
                ${property.price.toLocaleString()}
              </div>
              {property.arv && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                  ARV: ${property.arv.toLocaleString()}
                </div>
              )}
              {property.features && property.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {property.features.map((feature, index) => (
                    <span
                      key={index}
                      className="bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Properties