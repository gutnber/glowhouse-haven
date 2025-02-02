import { useEffect, useRef } from "react"
import { Tables } from "@/integrations/supabase/types"
import { useNavigate } from "react-router-dom"
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { PropertyMarkerCard } from "./map/PropertyMarkerCard"

interface PropertiesMapProps {
  properties: Tables<'properties'>[]
}

export const PropertiesMap = ({ properties }: PropertiesMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  
  useEffect(() => {
    const initMap = async () => {
      try {
        const validProperties = properties.filter(
          (p) => (p.latitude && p.longitude) || p.google_maps_url
        )

        if (!mapRef.current || validProperties.length === 0) return

        // Create map instance
        const map = L.map(mapRef.current).setView([
          validProperties[0].latitude || 0,
          validProperties[0].longitude || 0
        ], 12)

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map)

        // Add markers for each property
        const bounds = L.latLngBounds([])
        
        validProperties.forEach(property => {
          let lat = property.latitude
          let lng = property.longitude

          // Extract coordinates from Google Maps URL if needed
          if (!lat || !lng) {
            const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
            const match = property.google_maps_url?.match(regex)
            if (match) {
              lat = parseFloat(match[1])
              lng = parseFloat(match[2])
            }
          }

          if (lat && lng) {
            const marker = L.marker([lat, lng], {
              title: property.name
            }).addTo(map)

            // Create popup with property info
            const popupContent = document.createElement('div')
            popupContent.innerHTML = PropertyMarkerCard({ property })
            
            // Add click handler to the popup content
            const popup = L.popup({
              offset: L.point(0, -20),
              closeButton: false,
              className: 'property-popup'
            }).setContent(popupContent)

            marker.bindPopup(popup)

            // Handle marker click
            marker.on('click', () => {
              navigate(`/properties/${property.id}`)
            })

            // Extend bounds to include this marker
            bounds.extend([lat, lng])
          }
        })

        // Fit bounds with padding
        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, {
            padding: [50, 50]
          })
        }

        return () => {
          map.remove()
        }
      } catch (error) {
        console.error("Error loading map:", error)
      }
    }

    initMap()
  }, [properties, navigate])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  )
}