import { PropertyMarkerCard } from "./PropertyMarkerCard"
import { extractCoordinates } from "./mapUtils"

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

      bounds.extend(coords)
      this.addMarker(property, coords)
    })

    return bounds
  }

  private addMarker(property: Property, position: google.maps.LatLng | google.maps.LatLngLiteral) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title: property.name,
      animation: google.maps.Animation.DROP,
    })

    const infoWindow = new google.maps.InfoWindow({
      content: PropertyMarkerCard({ property }),
      disableAutoPan: true, // Prevent map from moving
      pixelOffset: new google.maps.Size(0, 0)
    })

    let closeTimeout: NodeJS.Timeout

    marker.addListener("click", () => {
      this.navigate(`/properties/${property.id}`)
    })

    marker.addListener("mouseover", () => {
      if (closeTimeout) clearTimeout(closeTimeout)
      
      this.infoWindows.forEach(window => window.close())
      
      // Calculate optimal position for info window
      const markerPosition = marker.getPosition()
      if (markerPosition) {
        const mapBounds = this.map.getBounds()
        const mapCenter = this.map.getCenter()
        
        if (mapBounds && mapCenter) {
          const isNorth = markerPosition.lat() > mapCenter.lat()
          const isEast = markerPosition.lng() > mapCenter.lng()
          
          // Adjust offset based on marker position relative to map center
          infoWindow.setOptions({
            pixelOffset: new google.maps.Size(
              isEast ? -100 : 100, // Move left or right
              isNorth ? -30 : 30   // Move up or down
            )
          })
        }
      }
      
      infoWindow.open(this.map, marker)
    })

    marker.addListener("mouseout", () => {
      closeTimeout = setTimeout(() => {
        infoWindow.close()
      }, 300)
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