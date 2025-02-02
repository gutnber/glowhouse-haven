import { useEffect, useRef } from "react"
import { Tables } from "@/integrations/supabase/types"
import { googleMapsLoader } from "@/utils/googleMaps"
import { createMapStyles } from "./map/MapStyles"
import { PropertyMarkers } from "./map/PropertyMarkers"
import { useNavigate } from "react-router-dom"

interface PropertiesMapProps {
  properties: Tables<'properties'>[]
}

export const PropertiesMap = ({ properties }: PropertiesMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    const initMap = async () => {
      try {
        const google = await googleMapsLoader.load()
        const validProperties = properties.filter(
          (p) => (p.latitude && p.longitude) || p.google_maps_url
        )

        if (!mapRef.current || validProperties.length === 0) return

        const map = new google.maps.Map(mapRef.current, {
          center: { 
            lat: validProperties[0].latitude || 0,
            lng: validProperties[0].longitude || 0
          },
          zoom: 12,
          styles: createMapStyles(),
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        })

        const propertyMarkers = new PropertyMarkers(map, navigate)
        propertyMarkers.addMarkers(validProperties)

      } catch (error) {
        console.error("Error loading map:", error)
      }
    }

    initMap()
  }, [properties, navigate])

  return (
    <div 
      ref={mapRef} 
      className="w-[100vw] h-[400px] -ml-[calc(50vw-50%)] relative left-[calc(50%-50vw)]"
    />
  )
}