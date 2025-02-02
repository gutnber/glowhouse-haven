import { Loader } from "@googlemaps/js-api-loader"

// Use a single loader instance across the application
export const googleMapsLoader = new Loader({
  apiKey: "AIzaSyDj7PNdT4nHJRXrE2kzJdT_SQ7AHE4Okw8",
  version: "weekly",
})