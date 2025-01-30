import { useEffect, useRef, useState } from "react"
import { Loader as UILoader } from "@/components/ui/loader"
import { Loader } from "@googlemaps/js-api-loader"
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useNavigate } from "react-router-dom"
import { Building2, Bed, Bath } from "lucide-react"

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
        .select('id, name, address, bedrooms, bathrooms, price, feature_image_url, google_maps_url, latitude, longitude')

      if (error) throw error
      console.log('Fetched properties:', data)
      return data
    }
  })

  useEffect(() => {
    const extractCoordinates = (url: string) => {
      try {
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

    const createInfoWindowContent = (property: any) => {
      return `
        <div class="p-4 max-w-[300px] bg-black/90 rounded-lg shadow-xl border border-white/20">
          <div class="relative w-full">
            ${property.feature_image_url ? 
              `<img src="${property.feature_image_url}" alt="${property.name}" class="w-full h-40 object-cover rounded-t-lg">` 
              : `<div class="w-full h-40 bg-gray-800 rounded-t-lg flex items-center justify-center">
                  <svg class="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M3 21h18M3 7v14m18-14v14M6 11h.01M6 15h.01M6 19h.01M14 11h.01M14 15h.01M14 19h.01M10 11h.01M10 15h.01M10 19h.01M18 11h.01M18 15h.01M18 19h.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>`
            }
            <div class="absolute top-2 right-2 bg-destructive text-white px-3 py-1 rounded-full text-sm font-bold">
              $${property.price.toLocaleString()}
            </div>
          </div>
          <div class="p-4">
            <h3 class="text-lg font-semibold text-white mb-2">${property.name}</h3>
            <p class="text-gray-300 text-sm mb-3">${property.address}</p>
            <div class="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M2 22v-5l5-5V9a5 5 0 0110 0v3l5 5v5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${property.bedrooms} Beds
              </div>
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                ${property.bathrooms} Baths
              </div>
            </div>
          </div>
        </div>
      `
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

        const loader = new GoogleMapsLoader({
          apiKey: "AIzaSyBEUM9Ra3L3pHapDvDXrsnf9p3uZ8girGQ",
          version: "weekly",
        })

        await loader.load()

        // Calculate bounds for all properties
        const bounds = new google.maps.LatLngBounds()
        properties.forEach(property => {
          let coords = null
          
          if (property.google_maps_url) {
            coords = extractCoordinates(property.google_maps_url)
          }
          
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
          zoom: 10,
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

        // Fit map to bounds without zoom
        mapInstance.fitBounds(bounds, { padding: 50 })

        // Clear existing markers and info windows
        markersRef.current.forEach(marker => marker.setMap(null))
        markersRef.current = []
        infoWindowsRef.current.forEach(infoWindow => infoWindow.close())
        infoWindowsRef.current = []

        // Add markers for each property
        properties.forEach(property => {
          let coords = null
          
          if (property.google_maps_url) {
            coords = extractCoordinates(property.google_maps_url)
          }
          
          if (!coords && property.latitude && property.longitude) {
            coords = { 
              lat: Number(property.latitude), 
              lng: Number(property.longitude) 
            }
          }

          if (!coords) return

          const marker = new google.maps.Marker({
            position: coords,
            map: mapInstance,
            title: property.name,
            animation: google.maps.Animation.DROP,
          })

          const infoWindow = new google.maps.InfoWindow({
            content: createInfoWindowContent(property),
            pixelOffset: new google.maps.Size(0, -20)
          })

          let closeTimeout: NodeJS.Timeout

          marker.addListener("click", () => {
            navigate(`/properties/${property.id}`)
          })

          marker.addListener("mouseover", () => {
            if (closeTimeout) clearTimeout(closeTimeout)
            
            // Close all other info windows
            infoWindowsRef.current.forEach(window => window.close())
            
            // Get map boundaries
            const bounds = mapInstance.getBounds()
            const markerPosition = marker.getPosition()
            
            if (bounds && markerPosition) {
              const ne = bounds.getNorthEast()
              const sw = bounds.getSouthWest()
              const center = bounds.getCenter()
              
              // Calculate optimal position for info window
              const isNorth = markerPosition.lat() > center.lat()
              const isEast = markerPosition.lng() > center.lng()
              
              // Adjust info window position based on marker location
              infoWindow.setOptions({
                pixelOffset: new google.maps.Size(
                  isEast ? -150 : 150,
                  isNorth ? -250 : 20
                )
              })
            }
            
            infoWindow.open(mapInstance, marker)
          })

          marker.addListener("mouseout", () => {
            closeTimeout = setTimeout(() => {
              infoWindow.close()
            }, 3000)
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