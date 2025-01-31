export const extractCoordinates = (url: string) => {
  try {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/
    const match = url.match(regex)
    if (match) {
      const [, lat, lng] = match
      return { lat: parseFloat(lat), lng: parseFloat(lng) }
    }
    return null
  } catch (error) {
    console.error("Error extracting coordinates:", error)
    return null
  }
}