
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyYouTubePlayer } from "../PropertyYouTubePlayer";

interface PropertyYouTubeSectionProps {
  youtubeUrl: string | null;
  autoplay: boolean | null;
  muted: boolean | null;
  controls: boolean | null;
}

export const PropertyYouTubeSection = ({ 
  youtubeUrl,
  autoplay,
  muted,
  controls
}: PropertyYouTubeSectionProps) => {
  const { t } = useLanguage();
  
  if (!youtubeUrl) return null;
  
  return (
    <div className="space-y-2">
      <h3 className="text-xl font-semibold text-white">{t('property.video')}</h3>
      <PropertyYouTubePlayer 
        youtubeUrl={youtubeUrl} 
        autoplay={autoplay} 
        muted={muted} 
        controls={controls} 
      />
    </div>
  );
};
