import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Loader as GoogleMapsLoader } from "@googlemaps/js-api-loader"

interface PropertyMapProps {
  latitude?: number | null
  longitude?: number | null
}

export const PropertyMap = ({ latitude, longitude }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || !latitude || !longitude) return

      try {
        setIsLoading(true)
        const loader = new GoogleMapsLoader({
          apiKey: "GOOGLE_MAPS_API_KEY",
          version: "weekly",
        })

        await loader.load()

        const location = { lat: latitude, lng: longitude }

        // Create the map instance
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: location,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        // Add a marker for the property
        new google.maps.Marker({
          position: location,
          map: mapInstance,
          animation: google.maps.Animation.DROP,
        })

        mapInstanceRef.current = mapInstance
      } catch (error) {
        console.error("Error loading map:", error)
        setError("Failed to load map")
      } finally {
        setIsLoading(false)
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        // Cleanup map instance if needed
      }
    }
  }, [latitude, longitude])

  if (!latitude || !longitude) {
    return (
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Location</h2>
        <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
          <p className="text-muted-foreground">No location coordinates available</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Location</h2>
      {isLoading && (
        <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
          <Loader />
        </div>
      )}
      {error && (
        <div className="w-full h-[400px] flex items-center justify-center bg-muted rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className={`w-full h-[400px] rounded-lg overflow-hidden ${isLoading ? 'hidden' : ''}`}
      />
    </Card>
  )
}