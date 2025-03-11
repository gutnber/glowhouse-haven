
import { Card } from "@/components/ui/card"
import { usePropertyMap } from "./map/usePropertyMap"
import { PropertyMapCard } from "./map/PropertyMapCard"
import { MapPin } from "lucide-react"
import { useLanguage } from "@/contexts/LanguageContext"

interface PropertyMapProps {
  googleMapsUrl?: string | null
  latitude?: number | null
  longitude?: number | null
}

export const PropertyMap = ({ googleMapsUrl, latitude, longitude }: PropertyMapProps) => {
  const { mapRef, isLoading, error, coordinates } = usePropertyMap({
    googleMapsUrl,
    latitude,
    longitude
  })

  if (!coordinates) {
    return (
      <div className="h-full w-full">
        <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-full rounded-xl border border-orange-500/30">
          <h2 className="text-2xl font-semibold mb-4 text-white border-b border-orange-500/30 pb-2">{useLanguage().t('location')}</h2>
          <div className="w-full h-[350px] flex items-center justify-center bg-black/20 rounded-lg">
            <div className="text-center space-y-2">
              <MapPin className="h-12 w-12 text-orange-500/50 mx-auto" />
              <p className="text-gray-300">No location coordinates available</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full w-full">
      <PropertyMapCard
        isLoading={isLoading}
        error={error}
        mapRef={mapRef}
      />
    </div>
  )
}
