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

    return bounds
  }

  private getPropertyCoordinates(property: Property) {
    if (property.google_maps_url) {
      const coords = extractCoordinates(property.google_maps_url)
      if (coords) return coords
    }
    
    if (property.latitude && property.longitude) {
      return { 
        lat: Number(property.latitude), 
        lng: Number(property.longitude) 
      }
    }

    return null
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
      disableAutoPan: true,
    })

    let closeTimeout: NodeJS.Timeout

    marker.addListener("click", () => {
      this.navigate(`/properties/${property.id}`)
    })

    marker.addListener("mouseover", () => {
      if (closeTimeout) clearTimeout(closeTimeout)
      this.infoWindows.forEach(window => window.close())
      
      const markerPosition = marker.getPosition()
      if (markerPosition) {
        const mapCenter = this.map.getCenter()
        if (mapCenter) {
          const isNorth = markerPosition.lat() > mapCenter.lat()
          const isEast = markerPosition.lng() > mapCenter.lng()
          
          infoWindow.setOptions({
            pixelOffset: new google.maps.Size(
              isEast ? -100 : 100,
              isNorth ? -20 : 20
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