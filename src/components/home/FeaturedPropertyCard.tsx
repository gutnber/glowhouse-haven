import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer"
import { Tables } from "@/integrations/supabase/types"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight, Ruler, Save } from "lucide-react"
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
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  
  const isVacantLand = property.property_type === 'vacantLand'
  const currencySymbol = property.currency === "MXN" ? "MX$" : "$"

  // Load video settings from property when component mounts
  useEffect(() => {
    // Set initial states from property data or defaults
    setAutoplay(property.youtube_autoplay ?? false)
    setMuted(property.youtube_muted ?? true)
    setControls(property.youtube_controls ?? true)
  }, [property])

  const updateVideoSettings = async () => {
    try {
      console.log('Saving video settings:', { autoplay, muted, controls })
      const { error } = await supabase
        .from('properties')
        .update({
          youtube_autoplay: autoplay,
          youtube_muted: muted,
          youtube_controls: controls
        })
        .eq('id', property.id)

      if (error) throw error

      setHasUnsavedChanges(false)
      toast({
        title: "Success",
        description: "Video settings saved successfully",
      })
    } catch (error) {
      console.error('Error saving video settings:', error)
      toast({
        title: "Error",
        description: "Failed to save video settings",
        variant: "destructive",
      })
    }
  }

  const handleSettingChange = (
    setting: 'youtube_autoplay' | 'youtube_muted' | 'youtube_controls',
    value: boolean
  ) => {
    setHasUnsavedChanges(true)
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
                        handleSettingChange('youtube_autoplay', checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Muted</span>
                    <Switch 
                      checked={muted}
                      onCheckedChange={(checked) => {
                        handleSettingChange('youtube_muted', checked)
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Show Controls</span>
                    <Switch 
                      checked={controls}
                      onCheckedChange={(checked) => {
                        handleSettingChange('youtube_controls', checked)
                      }}
                    />
                  </div>
                  {hasUnsavedChanges && (
                    <Button 
                      onClick={updateVideoSettings}
                      className="w-full mt-2"
                      variant="secondary"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="col-span-4 space-y-4">
              <h2 className="text-3xl font-bold text-white">{property.name}</h2>
              <div className="space-y-1">
                <p className="text-2xl font-semibold text-orange-500">
                  {formatCurrency(property.price, property.currency)}
                </p>
                {property.price_per_sqm && property.area && (
                  <p className="text-lg text-orange-400/80">
                    {currencySymbol}{property.price_per_sqm.toLocaleString()}/m²
                  </p>
                )}
              </div>
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
                  <Link to={`/properties/${property.id}`}>
                    View More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="col-span-12 space-y-4">
            <h2 className="text-4xl font-bold text-white">{property.name}</h2>
            <div className="space-y-1">
              <p className="text-2xl font-semibold text-orange-500">
                {formatCurrency(property.price, property.currency)}
              </p>
              {property.price_per_sqm && property.area && (
                <p className="text-lg text-orange-400/80">
                  {currencySymbol}{property.price_per_sqm.toLocaleString()}/m²
                </p>
              )}
            </div>
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
                <Link to={`/properties/${property.id}`}>
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
