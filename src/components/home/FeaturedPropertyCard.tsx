import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer"
import { Tables } from "@/integrations/supabase/types"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight, Ruler } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

interface FeaturedPropertyCardProps {
  property: Tables<'properties'>
}

export const FeaturedPropertyCard = ({ property }: FeaturedPropertyCardProps) => {
  const { isAdmin } = useIsAdmin()
  const { toast } = useToast()
  const [autoplay, setAutoplay] = useState<boolean>(false)
  const [muted, setMuted] = useState<boolean>(true)
  const [controls, setControls] = useState<boolean>(true)
  
  const isVacantLand = property.property_type === 'vacantLand'

  // Load video settings from property when component mounts
  useEffect(() => {
    setAutoplay(property.youtube_autoplay || false)
    setMuted(property.youtube_muted || true)
    setControls(property.youtube_controls || true)
  }, [property])

  const updateVideoSettings = async (
    setting: 'youtube_autoplay' | 'youtube_muted' | 'youtube_controls',
    value: boolean
  ) => {
    try {
      console.log('Updating video settings:', setting, value)
      const { error } = await supabase
        .from('properties')
        .update({ [setting]: value })
        .eq('id', property.id)

      if (error) throw error

      // Update local state to reflect the change
      switch (setting) {
        case 'youtube_autoplay':
          setAutoplay(value)
          break
        case 'youtube_muted':
          setMuted(value)
          break
        case 'youtube_controls':
          setControls(value)
          break
      }

      toast({
        title: "Success",
        description: "Video settings updated successfully",
      })
    } catch (error) {
      console.error('Error updating video settings:', error)
      toast({
        title: "Error",
        description: "Failed to update video settings",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="relative space-y-6 py-12 px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl backdrop-blur-xl border border-orange-500/10" />
      <div className="relative grid grid-cols-12 gap-6">
        {property.youtube_url ? (
          <>
            <div className="col-span-8">
              <PropertyYouTubePlayer 
                youtubeUrl={property.youtube_url}
                autoplay={autoplay}
                muted={muted}
                controls={controls}
              />
              {isAdmin && (
                <div className="mt-4 space-y-2 bg-background/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span>Autoplay</span>
                    <Switch 
                      checked={autoplay}
                      onCheckedChange={(checked) => {
                        updateVideoSettings('youtube_autoplay', checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Muted</span>
                    <Switch 
                      checked={muted}
                      onCheckedChange={(checked) => {
                        updateVideoSettings('youtube_muted', checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Controls</span>
                    <Switch 
                      checked={controls}
                      onCheckedChange={(checked) => {
                        updateVideoSettings('youtube_controls', checked)
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="col-span-4 space-y-4">
              <h2 className="text-3xl font-bold text-white">{property.name}</h2>
              <p className="text-2xl font-semibold text-orange-500">
                {formatCurrency(property.price)}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  {!isVacantLand && (
                    <>
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                        {property.bedrooms} beds
                      </span>
                      <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                        {property.bathrooms} baths
                      </span>
                    </>
                  )}
                  {property.area && (
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      {property.area} m²
                    </span>
                  )}
                </div>
                <p className="text-white/80 line-clamp-4">{property.description}</p>
                {property.features && property.features.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {property.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                )}
                <Button asChild className="w-full mt-4">
                  <Link to={`/property/${property.id}`}>
                    View More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
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
              <div className="flex items-center gap-2 flex-wrap">
                {!isVacantLand && (
                  <>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                      {property.bedrooms} beds
                    </span>
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
                      {property.bathrooms} baths
                    </span>
                  </>
                )}
                {property.area && (
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    {property.area} m²
                  </span>
                )}
              </div>
              <p className="text-white/80">{property.description}</p>
              {property.features && property.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {property.features.map((feature, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              )}
              <Button asChild className="w-full mt-4">
                <Link to={`/property/${property.id}`}>
                  View More <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}