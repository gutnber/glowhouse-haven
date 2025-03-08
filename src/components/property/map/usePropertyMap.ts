
import { useEffect, useRef, useState } from "react"
import { googleMapsLoader } from "@/utils/googleMaps"
import { getPropertyCoordinates } from "./property-location-utils"

interface UsePropertyMapProps {
  googleMapsUrl?: string | null
  latitude?: number | null
  longitude?: number | null
}

export const usePropertyMap = ({ googleMapsUrl, latitude, longitude }: UsePropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)

  // Initialize coordinates from props
  useEffect(() => {
    const coords = getPropertyCoordinates(latitude, longitude, googleMapsUrl)
    if (coords) {
      setCoordinates(coords)
    } else {
      setError("No valid location coordinates available")
      setIsLoading(false)
    }
  }, [googleMapsUrl, latitude, longitude])

  // Initialize map when coordinates are available
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
        setError(null)

        const google = await googleMapsLoader.load()

        // Create the map instance
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: coordinates,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        // Add a marker for the property
        new google.maps.Marker({
          position: coordinates,
          map: mapInstance,
          animation: google.maps.Animation.DROP,
        })

        mapInstanceRef.current = mapInstance
        console.log('Map initialized successfully')
        setIsLoading(false)
      } catch (error) {
        console.error("Error loading map:", error)
        setError("Failed to load map")
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

  return { mapRef, isLoading, error, coordinates }
}
