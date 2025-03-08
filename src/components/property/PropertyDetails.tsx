import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';
import { useIsAdmin } from '@/hooks/useIsAdmin';
import { PropertyMap } from './PropertyMap';
import { PropertyYouTubePlayer } from './PropertyYouTubePlayer';
import { formatCurrency } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { PropertyTypeSelect } from './PropertyTypeSelect';

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
  enableBorderBeam,
  propertyType
}: PropertyDetailsProps) => {
  const { isAdmin } = useIsAdmin();
  const { t } = useLanguage();
  
  // Format price with currency
  const formatPriceWithCurrency = (value: number, currencyCode: string = "USD") => {
    const symbol = currencyCode === "MXN" ? "MX$" : "$";
    return `${symbol}${value.toLocaleString()}`;
  };

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

        <div className="grid grid-cols-2 gap-4">
          <div className="border rounded-lg p-4 flex flex-col">
            <span className="text-muted-foreground text-sm">{t('property.bedrooms')}</span>
            <span className="text-2xl font-bold">{bedrooms}</span>
          </div>
          
          <div className="border rounded-lg p-4 flex flex-col">
            <span className="text-muted-foreground text-sm">{t('property.bathrooms')}</span>
            <span className="text-2xl font-bold">{bathrooms}</span>
          </div>
          
          {buildYear && (
            <div className="border rounded-lg p-4 flex flex-col">
              <span className="text-muted-foreground text-sm">{t('property.yearBuilt')}</span>
              <span className="text-2xl font-bold">{buildYear}</span>
            </div>
          )}
          
          {area && (
            <div className="border rounded-lg p-4 flex flex-col">
              <span className="text-muted-foreground text-sm">{t('property.area')} (m²)</span>
              <span className="text-2xl font-bold">{area}</span>
            </div>
          )}
          
          {width && height && (
            <div className="border rounded-lg p-4 flex flex-col">
              <span className="text-muted-foreground text-sm">{t('property.dimensions')}</span>
              <span className="text-2xl font-bold">{width} × {height}m</span>
            </div>
          )}
          
          {heatedArea && (
            <div className="border rounded-lg p-4 flex flex-col">
              <span className="text-muted-foreground text-sm">{t('property.heatedArea')} (m²)</span>
              <span className="text-2xl font-bold">{heatedArea}</span>
            </div>
          )}
          
          {propertyType && (
            <div className="border rounded-lg p-4 flex flex-col">
              <span className="text-muted-foreground text-sm">{t('propertyType')}</span>
              <span className="text-2xl font-bold capitalize">
                <PropertyTypeSelect 
                  value={propertyType} 
                  onValueChange={() => {}} 
                  disabled={true} 
                  className="p-0 font-bold opacity-100 pointer-events-none"
                />
              </span>
            </div>
          )}
          
          {referenceNumber && (
            <div className="border rounded-lg p-4 flex flex-col">
              <span className="text-muted-foreground text-sm">{t('property.referenceNumber')}</span>
              <span className="text-2xl font-bold">{referenceNumber}</span>
            </div>
          )}
        </div>
        
        <div className="border rounded-lg p-4 flex flex-col">
          <span className="text-muted-foreground text-sm">{t('property.price')}</span>
          <span className="text-3xl font-bold">{formatPriceWithCurrency(price, currency || undefined)}</span>
          
          {pricePerSqm && (
            <div className="mt-2">
              <span className="text-muted-foreground text-sm">{t('property.pricePerSqm') || 'Price per m²'}</span>
              <span className="text-xl font-semibold ml-2">{formatPriceWithCurrency(pricePerSqm, currency || undefined)}/m²</span>
            </div>
          )}
          
          {arv && (
            <div className="mt-2">
              <span className="text-muted-foreground text-sm">{t('property.arvLabel')}</span>
              <span className="text-xl font-semibold ml-2">{formatPriceWithCurrency(arv, currency || undefined)}</span>
            </div>
          )}
        </div>
      </div>

      {description && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('property.description')}</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {description.split('\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {features && features.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{t('property.features')}</h3>
          <ul className="grid grid-cols-2 gap-2">
            {features.map((feature, i) => (
              <li key={i} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      )}

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
