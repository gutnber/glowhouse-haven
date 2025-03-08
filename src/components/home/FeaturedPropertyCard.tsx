
import { useEffect } from "react"
import { Tables } from "@/integrations/supabase/types"
import { supabase } from "@/integrations/supabase/client"
import { useIsAdmin } from "@/hooks/useIsAdmin"
import { VideoSection } from "./featured-property/VideoSection"
import { PropertyContent } from "./featured-property/PropertyContent"

interface FeaturedPropertyCardProps {
  property: Tables<'properties'>
}

export const FeaturedPropertyCard = ({ property }: FeaturedPropertyCardProps) => {
  const { isAdmin } = useIsAdmin()
  
  // Initialize video settings when component mounts
  useEffect(() => {
    const saveInitialSettings = async () => {
      try {
        const { error } = await supabase
          .from('properties')
          .update({
            youtube_autoplay: true,
            youtube_muted: false,
            youtube_controls: false
          })
          .eq('id', property.id)

        if (error) throw error

        console.log('Initial video settings saved successfully')
      } catch (error) {
        console.error('Error saving initial video settings:', error)
      }
    }
    
    // Save initial settings for admin users
    if (isAdmin && (!property.youtube_autoplay && !property.youtube_muted && !property.youtube_controls)) {
      saveInitialSettings()
    }
  }, [property.id, isAdmin, property.youtube_autoplay, property.youtube_muted, property.youtube_controls])

  return (
    <div className="relative space-y-6 py-12 px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl backdrop-blur-xl border border-orange-500/10" />
      <div className="relative grid grid-cols-12 gap-6">
        {property.youtube_url ? (
          <>
            <div className="col-span-8">
              <VideoSection property={property} />
            </div>
            <div className="col-span-4">
              <PropertyContent property={property} />
            </div>
          </>
        ) : (
          <div className="col-span-12">
            <PropertyContent property={property} />
          </div>
        )}
      </div>
    </div>
  );
};
