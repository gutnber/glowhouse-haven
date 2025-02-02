export const createMapStyles = () => [
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