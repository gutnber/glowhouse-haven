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
        path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
        fillColor: "#F97316",
        fillOpacity: 1,
        strokeWeight: 0,
        scale: 2,
        anchor: new google.maps.Point(12, 17),
      },
      animation: google.maps.Animation.DROP
    })

    const infoWindowContent = document.createElement('div')
    infoWindowContent.innerHTML = PropertyMarkerCard({ property })
    
    // Add styles to remove InfoWindow borders and close button
    const style = document.createElement('style')
    style.textContent = `
      .gm-style .gm-style-iw-c {
        padding: 0 !important;
        border-radius: 8px !important;
        box-shadow: none !important;
        border: none !important;
        top: 0 !important;
        margin-top: -8px !important;
      }
      .gm-style .gm-style-iw-d {
        overflow: hidden !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      .gm-style .gm-style-iw-t::after {
        display: none !important;
      }
      .gm-style-iw-tc {
        display: none !important;
      }
      .gm-ui-hover-effect {
        display: none !important;
      }
      .gm-style-iw {
        padding: 0 !important;
        margin: 0 !important;
      }
    `
    infoWindowContent.appendChild(style)

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