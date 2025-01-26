import { useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Loader } from "@/components/ui/loader"

interface PropertyMapProps {
  address: string
}

export const PropertyMap = ({ address }: PropertyMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return

      try {
        // Load the Google Maps JavaScript API
        const loader = new google.maps.plugins.loader.Loader({
          apiKey: "GOOGLE_MAPS_API_KEY",
          version: "weekly",
        })

        await loader.load()

        // Geocode the address to get coordinates
        const geocoder = new google.maps.Geocoder()
        const results = await geocoder.geocode({ address })

        if (!results.results?.[0]) {
          console.error("Address not found")
          return
        }

        const { location } = results.results[0].geometry

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
      }
    }

    initMap()

    return () => {
      if (mapInstanceRef.current) {
        // Cleanup map instance if needed
      }
    }
  }, [address])

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Location</h2>
      <div 
        ref={mapRef} 
        className="w-full h-[400px] rounded-lg overflow-hidden"
      />
    </Card>
  )
}