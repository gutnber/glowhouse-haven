
import { Card } from "@/components/ui/card"
import { Loader as UILoader } from "@/components/ui/loader"
import { useLanguage } from "@/contexts/LanguageContext"

interface PropertyMapCardProps {
  isLoading: boolean
  error: string | null
  mapRef: React.RefObject<HTMLDivElement>
}

export const PropertyMapCard = ({ isLoading, error, mapRef }: PropertyMapCardProps) => {
  return (
    <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 h-full rounded-xl border border-orange-500/30">
      <h2 className="text-2xl font-semibold mb-4 text-white border-b border-orange-500/30 pb-2">{useLanguage().t('location')}</h2>
      <div className="relative w-full h-[350px] rounded-lg overflow-hidden">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <UILoader className="text-orange-500" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <p className="text-orange-500">{error}</p>
          </div>
        )}
        <div 
          ref={mapRef} 
          className="w-full h-full"
        />
      </div>
    </div>
  )
}
