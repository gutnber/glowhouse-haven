
/**
 * Utilities for property location handling
 */

/**
 * Extract coordinates from a Google Maps URL
 */
export const extractCoordinatesFromUrl = (url: string) => {
  try {
    console.log('Attempting to extract coordinates from URL:', url)
    // Handle different Google Maps URL formats
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
    const match = url.match(regex)
    
    if (match) {
      const [, lat, lng] = match
      console.log('Extracted coordinates:', { lat, lng })
      return {
        lat: parseFloat(lat),
        lng: parseFloat(lng)
      }
    }
    console.log('No coordinates found in URL')
    return null
  } catch (error) {
    console.error("Error extracting coordinates:", error)
    return null
  }
}

/**
 * Get coordinates from either direct lat/lng or from a Google Maps URL
 */
export const getPropertyCoordinates = (
  latitude: number | null | undefined, 
  longitude: number | null | undefined, 
  googleMapsUrl: string | null | undefined
) => {
  console.log('Initializing coordinates with:', { googleMapsUrl, latitude, longitude })
  
  if (latitude && longitude) {
    console.log('Using direct coordinates:', { lat: latitude, lng: longitude })
    return { lat: latitude, lng: longitude }
  }
  
  if (googleMapsUrl) {
    const extractedCoords = extractCoordinatesFromUrl(googleMapsUrl)
    if (extractedCoords) {
      console.log('Using coordinates from URL:', extractedCoords)
      return extractedCoords
    }
  }
  
  console.log('No valid coordinates found')
  return null
}
