import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { Loader as GoogleMapsLoader } from "@googlemaps/js-api-loader"

interface PropertyMapProps {
  googleMapsUrl?: string | null
  latitude?: number | null
  longitude?: number | null
}

export const PropertyMap = ({ googleMapsUrl, latitude, longitude }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    const extractCoordinates = async (url: string) => {
      try {
        console.log('Attempting to extract coordinates from URL:', url)
        // Handle different Google Maps URL formats
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
        const match = url.match(regex)
        
        if (match) {
          const [, lat, lng] = match
          console.log('Extracted coordinates:', { lat, lng })
          return {
            lat: parseFloat(lat),
            lng: parseFloat(lng)
          }
        }
        console.log('No coordinates found in URL')
        return null
      } catch (error) {
        console.error("Error extracting coordinates:", error)
        return null
      }
    }

    const initializeCoordinates = async () => {
      console.log('Initializing coordinates with:', { googleMapsUrl, latitude, longitude })
      
      if (googleMapsUrl) {
        const extractedCoords = await extractCoordinates(googleMapsUrl)
        if (extractedCoords) {
          console.log('Setting coordinates from URL:', extractedCoords)
          setCoordinates(extractedCoords)
        }
      } else if (latitude && longitude) {
        console.log('Setting coordinates from props:', { lat: latitude, lng: longitude })
        setCoordinates({ lat: latitude, lng: longitude })
      } else {
        console.log('No valid coordinates source found')
      }
    }

    initializeCoordinates()
  }, [googleMapsUrl, latitude, longitude])

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || !coordinates) {
        console.log('Map initialization skipped:', { 
          hasMapRef: !!mapRef.current, 
          hasCoordinates: !!coordinates 
        })
        return
      }

      try {
        console.log('Initializing map with coordinates:', coordinates)
        setIsLoading(true)
        const loader = new GoogleMapsLoader({
          apiKey: "AIzaSyBEUM9Ra3L3pHapDvDXrsnf9p3uZ8girGQ",
          version: "weekly",
        })

        await loader.load()

        // Create the map instance
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: coordinates,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        // Add a marker for the property
        new google.maps.marker.AdvancedMarkerElement({
          position: coordinates,
          map: mapInstance,
        })

        mapInstanceRef.current = mapInstance
        console.log('Map initialized successfully')
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
  }, [coordinates])

  if (!coordinates) {
    console.log('Rendering no coordinates message')
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