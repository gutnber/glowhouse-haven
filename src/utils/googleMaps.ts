import { Loader } from "@googlemaps/js-api-loader"

// Use a single loader instance across the application
export const googleMapsLoader = new Loader({
  apiKey: "AIzaSyBEUM9Ra3L3pHapDvDXrsnf9p3uZ8girGQ",
  version: "weekly",
})