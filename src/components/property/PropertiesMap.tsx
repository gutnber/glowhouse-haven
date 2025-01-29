import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"
import { GoogleMapsLoader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export const PropertiesMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties for map')
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, latitude, longitude, price')
        .not('latitude', 'is', null)
        .not('longitude', 'is', null)

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

        const loader = new GoogleMapsLoader({
          apiKey: "AIzaSyBEUM9Ra3L3pHapDvDXrsnf9p3uZ8girGQ",
          version: "weekly",
        })

        await loader.load()

        // Calculate bounds for all properties
        const bounds = new google.maps.LatLngBounds()
        properties.forEach(property => {
          bounds.extend({ lat: Number(property.latitude), lng: Number(property.longitude) })
        })

        // Create the map instance
        const mapInstance = new google.maps.Map(mapRef.current, {
          center: bounds.getCenter(),
          zoom: 12,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "on" }, { color: "#000000" }, { weight: 2 }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#0f172a" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#1e293b" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#475569" }]
            }
          ]
        })

        // Fit map to bounds
        mapInstance.fitBounds(bounds)

        // Clear existing markers
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []

        // Add markers for each property
        properties.forEach(property => {
          const marker = new google.maps.Marker({
            position: { 
              lat: Number(property.latitude), 
              lng: Number(property.longitude) 
            },
            map: mapInstance,
            title: property.name,
            animation: google.maps.Animation.DROP,
          })

          // Create an InfoWindow for each marker
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-semibold">${property.name}</h3>
                <p class="text-sm">$${property.price.toLocaleString()}</p>
              </div>
            `,
          })

          // Add click listeners
          marker.addListener("click", () => {
            navigate(`/properties/${property.id}`)
          })

          marker.addListener("mouseover", () => {
            infoWindow.open(mapInstance, marker)
          })

          marker.addListener("mouseout", () => {
            infoWindow.close()
          })

          markersRef.current.push(marker)
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
        // Cleanup markers
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
      }
    }
  }, [properties, navigate])

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4 text-white">Property Locations</h2>
      <div className="relative w-full h-[500px] rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <p className="text-destructive">{error}</p>
          </div>
        )}
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
      </div>
    </Card>
  )
}