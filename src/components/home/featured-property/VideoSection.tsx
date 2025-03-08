
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer";
import { VideoSettings } from "./VideoSettings";
import { useState } from "react";
import { Tables } from "@/integrations/supabase/types";

interface VideoSectionProps {
  property: Tables<'properties'>;
}

export const VideoSection = ({ property }: VideoSectionProps) => {
  const { isAdmin } = useIsAdmin();
  const [videoSettings, setVideoSettings] = useState({
    autoplay: property.youtube_autoplay ?? true,
    muted: property.youtube_muted ?? false,
    controls: property.youtube_controls ?? false,
  });

  const handleSettingsChange = (settings: { 
    autoplay: boolean; 
    muted: boolean; 
    controls: boolean 
  }) => {
    setVideoSettings(settings);
  };

  if (!property.youtube_url) {
    return null;
  }

  return (
    <div>
      <PropertyYouTubePlayer 
        youtubeUrl={property.youtube_url}
        autoplay={videoSettings.autoplay}
        muted={videoSettings.muted}
        controls={videoSettings.controls}
      />
      
      {isAdmin && (
        <VideoSettings 
          propertyId={property.id}
          initialSettings={videoSettings}
          onSettingsChange={handleSettingsChange}
        />
      )}
    </div>
  );
};
