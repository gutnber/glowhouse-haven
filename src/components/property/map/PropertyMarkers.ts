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
  private markers: google.maps.marker.AdvancedMarkerElement[] = []
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
    // Create pin element
    const pinElement = document.createElement('div');
    pinElement.innerHTML = `
      <div style="
        width: 20px;
        height: 20px;
        background-color: #F97316;
        border: 2px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      "></div>
    `;

    // Create advanced marker
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      map: this.map,
      title: property.name,
      content: pinElement
    });

    const infoWindow = new google.maps.InfoWindow({
      content: PropertyMarkerCard({ property }),
      pixelOffset: new google.maps.Size(0, -8),
      disableAutoPan: false,
      maxWidth: 150,
      minWidth: 150
    });

    google.maps.event.addListener(infoWindow, 'domready', () => {
      const iwOuter = document.querySelector('.gm-style-iw');
      if (iwOuter) {
        const parent = iwOuter.parentElement;
        if (parent) {
          const closeButton = parent.querySelector('.gm-ui-hover-effect');
          if (closeButton) closeButton.remove();
          
          const style = document.createElement('style');
          style.textContent = `
            .gm-style-iw { 
              padding: 0 !important; 
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: transparent !important;
            }
            .gm-style-iw > button { display: none !important; }
            .gm-style-iw > div { 
              overflow: hidden !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .gm-style-iw-d { 
              overflow: hidden !important;
              padding: 0 !important;
              margin: 0 !important;
            }
            .gm-style .gm-style-iw-t::after { display: none !important; }
            .gm-style-iw-tc { display: none !important; }
            .gm-style .gm-style-iw-tc { display: none !important; }
            .gm-style .gm-style-iw-c { 
              padding: 0 !important;
              margin: 0 !important;
              border: none !important;
              box-shadow: none !important;
              background: transparent !important;
            }
          `;
          document.head.appendChild(style);
        }
      }
    });

    marker.addListener("click", () => {
      this.navigate(`/properties/${property.id}`)
    });

    let isInfoWindowOpen = false;
    let closeTimeout: NodeJS.Timeout | null = null;

    const openInfoWindow = () => {
      if (closeTimeout) clearTimeout(closeTimeout);
      this.infoWindows.forEach(window => window.close());
      
      const markerPosition = marker.position as google.maps.LatLng;
      if (markerPosition) {
        const mapBounds = this.map.getBounds();
        if (mapBounds) {
          const center = mapBounds.getCenter();
          const isNorth = markerPosition.lat() > center.lat();
          
          infoWindow.setOptions({
            pixelOffset: new google.maps.Size(
              0,
              isNorth ? -45 : -8
            )
          });
        }
      }
      
      infoWindow.open(this.map, marker);
      isInfoWindowOpen = true;
    };

    const closeInfoWindow = () => {
      closeTimeout = setTimeout(() => {
        infoWindow.close();
        isInfoWindowOpen = false;
      }, 300);
    };

    marker.addListener("mouseover", openInfoWindow);
    marker.addListener("mouseout", closeInfoWindow);

    google.maps.event.addListener(infoWindow, 'domready', () => {
      const content = infoWindow.getContent();
      if (content && typeof content !== 'string') {
        content.addEventListener('mouseover', () => {
          if (closeTimeout) clearTimeout(closeTimeout);
        });
        content.addEventListener('mouseout', closeInfoWindow);
      }
    });

    this.markers.push(marker);
    this.infoWindows.push(infoWindow);
  }

  private clearMarkers() {
    this.markers.forEach(marker => marker.map = null);
    this.markers = [];
    this.infoWindows.forEach(infoWindow => infoWindow.close());
    this.infoWindows = [];
  }
}