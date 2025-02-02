import { useEffect, useRef } from "react"
import { Loader } from "@googlemaps/js-api-loader"
import { Tables } from "@/integrations/supabase/types"

interface PropertiesMapProps {
  properties: Tables<'properties'>[]
}

export const PropertiesMap = ({ properties }: PropertiesMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const initMap = async () => {
      const loader = new Loader({
        apiKey: "AIzaSyDj7PNdT4nHJRXrE2kzJdT_SQ7AHE4Okw8",
        version: "weekly",
      })

      try {
        const google = await loader.load()
        const validProperties = properties.filter(
          (p) => p.latitude && p.longitude
        )

        if (!mapRef.current || validProperties.length === 0) return

        const map = new google.maps.Map(mapRef.current, {
          center: { 
            lat: validProperties[0].latitude || 0,
            lng: validProperties[0].longitude || 0
          },
          zoom: 12,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#ffffff" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#000000" }, { lightness: 13 }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "administrative",
              elementType: "geometry.stroke",
              stylers: [{ color: "#144b53" }, { lightness: 14 }, { weight: 1.4 }],
            },
            {
              featureType: "landscape",
              elementType: "all",
              stylers: [{ color: "#08304b" }],
            },
            {
              featureType: "poi",
              elementType: "geometry",
              stylers: [{ color: "#0c4152" }, { lightness: 5 }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "road.highway",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b434f" }, { lightness: 25 }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.fill",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "road.arterial",
              elementType: "geometry.stroke",
              stylers: [{ color: "#0b3d51" }, { lightness: 16 }],
            },
            {
              featureType: "road.local",
              elementType: "geometry",
              stylers: [{ color: "#000000" }],
            },
            {
              featureType: "transit",
              elementType: "all",
              stylers: [{ color: "#146474" }],
            },
            {
              featureType: "water",
              elementType: "all",
              stylers: [{ color: "#021019" }],
            },
          ],
        })

        validProperties.forEach((property) => {
          if (property.latitude && property.longitude) {
            const marker = new google.maps.Marker({
              position: { 
                lat: property.latitude,
                lng: property.longitude
              },
              map,
              title: property.name,
            })

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div style="color: black;">
                  <h3>${property.name}</h3>
                  <p>${property.address}</p>
                  <p>$${property.price.toLocaleString()}</p>
                </div>
              `,
            })

            marker.addListener("click", () => {
              infoWindow.open(map, marker)
            })
          }
        })
      } catch (error) {
        console.error("Error loading map:", error)
      }
    }

    initMap()
  }, [properties])

  return (
    <div 
      ref={mapRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  )
}