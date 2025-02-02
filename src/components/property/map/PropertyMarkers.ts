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

    if (this.markers.length > 0) {
      this.map.fitBounds(bounds)
      
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
    // Create marker with custom icon - removed white border
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title: property.name,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#F97316",
        fillOpacity: 1,
        strokeWeight: 0, // Removed the white border by setting strokeWeight to 0
      },
      animation: google.maps.Animation.DROP
    })

    // Create info window content using PropertyMarkerCard
    const infoWindowContent = document.createElement('div')
    infoWindowContent.innerHTML = PropertyMarkerCard({ property })

    // Create info window
    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      pixelOffset: new google.maps.Size(0, -8),
      disableAutoPan: false,
      maxWidth: 150,
      minWidth: 150
    })

    // Add click event listener
    marker.addListener("click", () => {
      this.navigate(`/properties/${property.id}`)
    })

    let isInfoWindowOpen = false
    let closeTimeout: NodeJS.Timeout | null = null

    const openInfoWindow = () => {
      if (closeTimeout) clearTimeout(closeTimeout)
      this.infoWindows.forEach(window => window.close())
      
      const markerPosition = marker.getPosition()
      if (markerPosition) {
        const mapBounds = this.map.getBounds()
        if (mapBounds) {
          const center = mapBounds.getCenter()
          const isNorth = markerPosition.lat() > center.lat()
          
          infoWindow.setOptions({
            pixelOffset: new google.maps.Size(
              0,
              isNorth ? -45 : -8
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

    // Add hover event listeners
    marker.addListener("mouseover", openInfoWindow)
    marker.addListener("mouseout", closeInfoWindow)

    // Add hover events for info window content
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