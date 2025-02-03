import { PropertyMarkerCard } from "./PropertyMarkerCard"
import { extractCoordinates } from "./CoordinatesUtils"
import { perfectInfoWindowStyles } from "./configs/InfoWindowStyles"
import { perfectMarkerConfig, infoWindowConfig, mapConfig } from "./configs/MarkerConfig"

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

  private clearMarkers() {
    this.markers.forEach(marker => marker.setMap(null))
    this.markers = []
    this.infoWindows.forEach(infoWindow => infoWindow.close())
    this.infoWindows = []
  }

  private addMarker(property: Property, position: google.maps.LatLng | google.maps.LatLngLiteral) {
    const marker = new google.maps.Marker({
      position,
      map: this.map,
      title: property.name,
      icon: {
        ...perfectMarkerConfig,
        anchor: new google.maps.Point(
          perfectMarkerConfig.anchor.x,
          perfectMarkerConfig.anchor.y
        ),
      },
      animation: google.maps.Animation.DROP
    })

    const infoWindowContent = document.createElement('div')
    infoWindowContent.innerHTML = PropertyMarkerCard({ property })
    
    const style = document.createElement('style')
    style.textContent = perfectInfoWindowStyles
    infoWindowContent.appendChild(style)

    const infoWindow = new google.maps.InfoWindow({
      content: infoWindowContent,
      pixelOffset: new google.maps.Size(
        infoWindowConfig.pixelOffset.x,
        infoWindowConfig.pixelOffset.y
      ),
      disableAutoPan: infoWindowConfig.disableAutoPan,
      maxWidth: infoWindowConfig.maxWidth,
      minWidth: infoWindowConfig.minWidth
    })

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
      }, infoWindowConfig.closeTimeout)
    }

    marker.addListener("mouseover", openInfoWindow)
    marker.addListener("mouseout", closeInfoWindow)

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
}