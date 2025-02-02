import { PropertyMarkerCard } from "./PropertyMarkerCard"
import { extractCoordinates } from "./CoordinatesUtils"

interface Property {
  id: string;
  name: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  feature_image_url?: string;
  google_maps_url?: string;
  latitude?: number;
  longitude?: number;
}

export class PropertyMarkers {
  private markers: google.maps.Marker[] = []
  private infoWindows: google.maps.InfoWindow[] = []
  private map: google.maps.Map
  private navigate: (path: string) => void

  constructor(map: google.maps.Map, navigate: (path: string) => void) {
    this.map = map
    this.navigate = navigate
  }

  addMarkers(properties: Property[]) {
    this.clearMarkers()
    const bounds = new google.maps.LatLngBounds()

    properties.forEach(property => {
      const coords = this.getPropertyCoordinates(property)
      if (!coords) return

      bounds.extend(coords)
      this.addMarker(property, coords)
    })

    // Only adjust bounds if we have markers
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds)
      
      // Add some padding to the bounds
      const padded = new google.maps.LatLngBounds(
        new google.maps.LatLng(
          bounds.getSouthWest().lat() - 0.01,
          bounds.getSouthWest().lng() - 0.01
        ),
        new google.maps.LatLng(
          bounds.getNorthEast().lat() + 0.01,
          bounds.getNorthEast().lng() + 0.01
        )
      )
      this.map.fitBounds(padded)
    }

    return bounds
  }

  private getPropertyCoordinates(property: Property) {
    if (property.latitude && property.longitude) {
      return { 
        lat: Number(property.latitude), 
        lng: Number(property.longitude) 
      }
    }
    
    if (property.google_maps_url) {
      const coords = extractCoordinates(property.google_maps_url)
      if (coords) return coords
    }

    return null
  }

  private addMarker(property: Property, position: google.maps.LatLng | google.maps.LatLngLiteral) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title: property.name,
      animation: google.maps.Animation.DROP,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#F59E0B",
        fillOpacity: 1,
        strokeColor: "#FFFFFF",
        strokeWeight: 2,
      }
    })

    const infoWindow = new google.maps.InfoWindow({
      content: PropertyMarkerCard({ property }),
      pixelOffset: new google.maps.Size(0, -10)
    })

    marker.addListener("click", () => {
      this.navigate(`/properties/${property.id}`)
    })

    let isInfoWindowOpen = false
    let closeTimeout: NodeJS.Timeout | null = null

    const openInfoWindow = () => {
      if (closeTimeout) clearTimeout(closeTimeout)
      this.infoWindows.forEach(window => window.close())
      
      // Calculate optimal position for info window
      const markerPosition = marker.getPosition()
      if (markerPosition) {
        const mapBounds = this.map.getBounds()
        if (mapBounds) {
          const center = mapBounds.getCenter()
          const isNorth = markerPosition.lat() > center.lat()
          const isEast = markerPosition.lng() > center.lng()
          
          // Adjust offset based on marker position relative to center
          infoWindow.setOptions({
            pixelOffset: new google.maps.Size(
              isEast ? -110 : 110,
              isNorth ? -130 : 10
            )
          })
        }
      }
      
      infoWindow.open(this.map, marker)
      isInfoWindowOpen = true
    }

    const closeInfoWindow = () => {
      closeTimeout = setTimeout(() => {
        infoWindow.close()
        isInfoWindowOpen = false
      }, 300)
    }

    marker.addListener("mouseover", openInfoWindow)
    marker.addListener("mouseout", closeInfoWindow)

    // Handle mouse events on the info window content
    google.maps.event.addListener(infoWindow, 'domready', () => {
      const content = infoWindow.getContent()
      if (content && typeof content !== 'string') {
        content.addEventListener('mouseover', () => {
          if (closeTimeout) clearTimeout(closeTimeout)
        })
        content.addEventListener('mouseout', closeInfoWindow)
      }
    })

    this.markers.push(marker)
    this.infoWindows.push(infoWindow)
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
    this.infoWindows.forEach(infoWindow => infoWindow.close())
    this.infoWindows = []
  }
}