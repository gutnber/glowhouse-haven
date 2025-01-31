import { useEffect, useRef, useState } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Loader as UILoader } from "@/components/ui/loader"
import { PropertyMarkers } from "./map/PropertyMarkers"
import { createMapStyles } from "./map/MapStyles"

export const PropertiesMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersManagerRef = useRef<PropertyMarkers | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties for map')
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, address, bedrooms, bathrooms, price, feature_image_url, google_maps_url, latitude, longitude')

      if (error) throw error
      console.log('Fetched properties:', data)
      return data
    }
  })

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current || !properties?.length) {
        console.log('Map initialization skipped:', { 
          hasMapRef: !!mapRef.current, 
          hasProperties: !!properties?.length 
        })
        return
      }

      try {
        console.log('Initializing map with properties')
        setIsLoading(true)
        setError(null)

        const loader = new Loader({
          apiKey: "AIzaSyBEUM9Ra3L3pHapDvDXrsnf9p3uZ8girGQ",
          version: "weekly",
        })

        await loader.load()

        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 10,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative', // This makes the map only move when click+hold
          styles: createMapStyles()
        })

        const markersManager = new PropertyMarkers(mapInstance, navigate)
        const bounds = markersManager.addMarkers(properties)

        mapInstance.fitBounds(bounds, {
          top: 50,
          right: 50,
          bottom: 50,
          left: 50
        })

        mapInstanceRef.current = mapInstance
        markersManagerRef.current = markersManager
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
        markersManagerRef.current = null
      }
    }
  }, [properties, navigate])

  return (
    <div className="relative w-full h-[300px] overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <UILoader />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}
      <div 
        ref={mapRef} 
        className="w-full h-full rounded-lg"
        style={{ border: 'none' }}
      />
    </div>
  )
}