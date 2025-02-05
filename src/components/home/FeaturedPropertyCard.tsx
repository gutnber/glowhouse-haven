import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer"
import { Tables } from "@/integrations/supabase/types"
import { formatCurrency } from "@/lib/utils"

interface FeaturedPropertyCardProps {
  property: Tables<'properties'>
}

export const FeaturedPropertyCard = ({ property }: FeaturedPropertyCardProps) => {
  return (
    <div className="relative space-y-6 py-12 px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl backdrop-blur-xl border border-orange-500/10" />
      <div className="relative grid grid-cols-12 gap-6">
        {property.youtube_url ? (
          <>
            <div className="col-span-8">
              <PropertyYouTubePlayer 
                youtubeUrl={property.youtube_url}
                autoplay={property.youtube_autoplay || false}
                muted={property.youtube_muted || true}
                controls={property.youtube_controls || true}
              />
            </div>
            <div className="col-span-4 space-y-4">
              <h2 className="text-3xl font-bold text-white">{property.name}</h2>
              <p className="text-2xl font-semibold text-orange-500">
                {formatCurrency(property.price)}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                    {property.bedrooms} beds
                  </span>
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                    {property.bathrooms} baths
                  </span>
                </div>
                <p className="text-white/80 line-clamp-4">{property.description}</p>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-12 space-y-4">
            <h2 className="text-4xl font-bold text-white">{property.name}</h2>
            <p className="text-2xl font-semibold text-orange-500">
              {formatCurrency(property.price)}
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                  {property.bedrooms} beds
                </span>
                <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                  {property.bathrooms} baths
                </span>
              </div>
              <p className="text-white/80">{property.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}