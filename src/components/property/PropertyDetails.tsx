
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { useLanguage } from '@/contexts/LanguageContext';
import { PropertyStats } from './detail-sections/PropertyStats';
import { PropertyPrice } from './detail-sections/PropertyPrice';
import { PropertyDescription } from './detail-sections/PropertyDescription';
import { PropertyFeatures } from './detail-sections/PropertyFeatures';
import { PropertyYouTubePlayer } from './PropertyYouTubePlayer';

interface PropertyDetailsProps {
  id: string;
  name: string;
  bedrooms: number;
  bathrooms: number;
  buildYear: number | null;
  price: number;
  currency?: string | null;
  pricePerSqm?: number | null;
  arv: number | null;
  description: string | null;
  features: string[] | null;
  googleMapsUrl?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  youtubeUrl: string | null;
  youtubeAutoplay: boolean | null;
  youtubeMuted: boolean | null;
  youtubeControls: boolean | null;
  area: number | null;
  width?: number | null;
  height?: number | null;
  heatedArea: number | null;
  referenceNumber: string | null;
  enableBorderBeam: boolean | null;
  propertyType: string | null;
}

export const PropertyDetails = ({
  id,
  name,
  bedrooms,
  bathrooms,
  buildYear,
  price,
  currency = "USD",
  pricePerSqm = null,
  arv,
  description,
  features,
  youtubeUrl,
  youtubeAutoplay,
  youtubeMuted,
  youtubeControls,
  area,
  width,
  height,
  heatedArea,
  referenceNumber,
  propertyType
}: PropertyDetailsProps) => {
  const { isAdmin } = useIsAdmin();
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold">{t('property.details')}</h2>
          {isAdmin && (
            <Button variant="outline" size="sm" asChild>
              <Link to={`/properties/edit/${id}`} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                {t('property.edit')}
              </Link>
            </Button>
          )}
        </div>

        <PropertyStats 
          bedrooms={bedrooms}
          bathrooms={bathrooms}
          buildYear={buildYear}
          area={area}
          width={width}
          height={height}
          heatedArea={heatedArea}
          propertyType={propertyType}
          pricePerSqm={pricePerSqm}
          currency={currency}
        />
        
        <PropertyPrice 
          price={price}
          currency={currency}
          referenceNumber={referenceNumber}
          arv={arv}
        />
      </div>

      <PropertyDescription description={description} />
      <PropertyFeatures features={features} />

      {youtubeUrl && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('property.video')}</h3>
          <PropertyYouTubePlayer 
            youtubeUrl={youtubeUrl} 
            autoplay={youtubeAutoplay} 
            muted={youtubeMuted} 
            controls={youtubeControls} 
          />
        </div>
      )}
    </div>
  );
};
