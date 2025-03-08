
import { Card } from "@/components/ui/card"
import { usePropertyMap } from "./map/usePropertyMap"
import { PropertyMapCard } from "./map/PropertyMapCard"

interface PropertyMapProps {
  googleMapsUrl?: string | null
  latitude?: number | null
  longitude?: number | null
}

export const PropertyMap = ({ googleMapsUrl, latitude, longitude }: PropertyMapProps) => {
  const { mapRef, isLoading, error, coordinates } = usePropertyMap({
    googleMapsUrl,
    latitude,
    longitude
  })

  if (!coordinates) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div className="w-full h-[250px] flex items-center justify-center bg-muted rounded-lg">
          <p className="text-muted-foreground">No location coordinates available</p>
        </div>
      </Card>
    )
  }

  return (
    <PropertyMapCard
      isLoading={isLoading}
      error={error}
      mapRef={mapRef}
    />
  )
}
