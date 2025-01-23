import { House, MapPin, Bed, Bath, DollarSign, Info, CalendarClock, ListPlus, Pencil } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { Tables } from "@/integrations/supabase/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { useIsAdmin } from "@/hooks/useIsAdmin"

const Properties = () => {
  const { isAdmin } = useIsAdmin()
  
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
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Loading properties...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Properties</h1>
        {isAdmin && (
          <Button asChild>
            <Link to="/add-property">
              <ListPlus className="mr-2 h-4 w-4" />
              Add Property
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {properties?.map((property) => (
          <Card key={property.id} className="overflow-hidden group">
            <div className="relative">
              <Link to={`/properties/${property.id}`}>
                <AspectRatio ratio={16 / 9}>
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.name}
                      className="object-cover w-full h-full rounded-t-lg transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <House className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </AspectRatio>
              </Link>
              {isAdmin && (
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  asChild
                >
                  <Link to={`/properties/${property.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <House className="h-5 w-5" />
                <Link to={`/properties/${property.id}`} className="hover:underline">
                  {property.name}
                </Link>
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
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default Properties