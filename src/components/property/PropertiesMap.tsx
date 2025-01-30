import { useEffect, useRef, useState } from "react"
import { Loader as UILoader } from "@/components/ui/loader"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"

export const PropertiesMap = () => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const infoWindowsRef = useRef<google.maps.InfoWindow[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const { data: properties } = useQuery({
    queryKey: ['properties'],
    queryFn: async () => {
      console.log('Fetching properties for map')
      const { data, error } = await supabase
        .from('properties')
        .select('id, name, latitude, longitude, price, feature_image_url, google_maps_url')

      if (error) throw error
      console.log('Fetched properties:', data)
      return data
    }
  })

  useEffect(() => {
    const extractCoordinates = (url: string) => {
      try {
        // Handle different Google Maps URL formats
        const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
        const match = url.match(regex)
        if (match) {
          const [, lat, lng] = match
          return { lat: parseFloat(lat), lng: parseFloat(lng) }
        }
        return null
      } catch (error) {
        console.error("Error extracting coordinates:", error)
        return null
      }
    }

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

        // Calculate bounds for all properties
        const bounds = new google.maps.LatLngBounds()
        properties.forEach(property => {
          let coords = null
          
          // Try to get coordinates from google_maps_url first
          if (property.google_maps_url) {
            coords = extractCoordinates(property.google_maps_url)
          }
          
          // Fallback to latitude/longitude if available
          if (!coords && property.latitude && property.longitude) {
            coords = { 
              lat: Number(property.latitude), 
              lng: Number(property.longitude) 
            }
          }

          if (coords) {
            bounds.extend(coords)
          }
        })

        // Create the map instance with lighter styling
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
              stylers: [{ color: "#6b7280" }]
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ visibility: "on" }, { color: "#1f2937" }, { weight: 2 }]
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#1e293b" }]
            },
            {
              featureType: "landscape",
              elementType: "geometry",
              stylers: [{ color: "#374151" }]
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#4b5563" }]
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#374151" }]
            }
          ]
        })

        // Fit map to bounds
        mapInstance.fitBounds(bounds)

        // Clear existing markers and info windows
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
        infoWindowsRef.current.forEach(infoWindow => infoWindow.close())
        infoWindowsRef.current = []

        // Add markers for each property
        properties.forEach(property => {
          let coords = null
          
          // Try to get coordinates from google_maps_url first
          if (property.google_maps_url) {
            coords = extractCoordinates(property.google_maps_url)
          }
          
          // Fallback to latitude/longitude if available
          if (!coords && property.latitude && property.longitude) {
            coords = { 
              lat: Number(property.latitude), 
              lng: Number(property.longitude) 
            }
          }

          if (!coords) return // Skip if no coordinates available

          const marker = new google.maps.Marker({
            position: coords,
            map: mapInstance,
            title: property.name,
            animation: google.maps.Animation.DROP,
          })

          // Create an InfoWindow with property image
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-4 max-w-[200px]">
                ${property.feature_image_url ? 
                  `<img src="${property.feature_image_url}" alt="${property.name}" class="w-full h-32 object-cover mb-2 rounded">` 
                  : ''
                }
                <h3 class="font-semibold text-base">${property.name}</h3>
                <p class="text-sm">$${property.price.toLocaleString()}</p>
              </div>
            `,
            pixelOffset: new google.maps.Size(0, -30)
          })

          let closeTimeout: NodeJS.Timeout

          // Add click listeners
          marker.addListener("click", () => {
            navigate(`/properties/${property.id}`)
          })

          marker.addListener("mouseover", () => {
            // Clear any existing timeout
            if (closeTimeout) clearTimeout(closeTimeout)
            
            // Close all other info windows
            infoWindowsRef.current.forEach(window => window.close())
            
            // Open this info window
            infoWindow.open(mapInstance, marker)
          })

          marker.addListener("mouseout", () => {
            // Set a timeout to close the info window after 2 seconds
            closeTimeout = setTimeout(() => {
              infoWindow.close()
            }, 2000)
          })

          markersRef.current.push(marker)
          infoWindowsRef.current.push(infoWindow)
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
        // Cleanup markers and info windows
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
        infoWindowsRef.current.forEach(infoWindow => infoWindow.close())
        infoWindowsRef.current = []
      }
    }
  }, [properties, navigate])

  return (
    <div className="relative w-full h-[300px] overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <UILoader />
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
        style={{ border: 'none' }}
      />
    </div>
  )
}