
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyTypeSelect } from "../PropertyTypeSelect";
import { formatCurrency } from "@/lib/utils";

interface PropertyStatsProps {
  bedrooms: number;
  bathrooms: number;
  buildYear: number | null;
  area: number | null;
  width?: number | null;
  height?: number | null;
  heatedArea: number | null;
  propertyType: string | null;
  pricePerSqm?: number | null;
  currency?: string | null;
}

export const PropertyStats = ({
  bedrooms,
  bathrooms,
  buildYear,
  area,
  width,
  height,
  heatedArea,
  propertyType,
  pricePerSqm,
  currency = "USD"
}: PropertyStatsProps) => {
  const { t } = useLanguage();
  
  const isVacantLand = propertyType === 'vacantLand';

  return (
    <div className="grid grid-cols-2 gap-4">
      {!isVacantLand && (
        <>
          <div className="border rounded-lg p-4 flex flex-col">
            <span className="text-white text-sm">{t('property.bedrooms')}</span>
            <span className="text-2xl font-bold text-white">{bedrooms}</span>
          </div>
          
          <div className="border rounded-lg p-4 flex flex-col">
            <span className="text-white text-sm">{t('property.bathrooms')}</span>
            <span className="text-2xl font-bold text-white">{bathrooms}</span>
          </div>
          
          {buildYear && (
            <div className="border rounded-lg p-4 flex flex-col">
              <span className="text-white text-sm">{t('property.yearBuilt')}</span>
              <span className="text-2xl font-bold text-white">{buildYear}</span>
            </div>
          )}
        </>
      )}
      
      {area && (
        <div className="border rounded-lg p-4 flex flex-col">
          <span className="text-white text-sm">{t('property.area')}</span>
          <span className="text-2xl font-bold text-white">{area} m²</span>
        </div>
      )}
      
      {width && height && (
        <div className="border rounded-lg p-4 flex flex-col">
          <span className="text-white text-sm">{t('property.dimensions')}</span>
          <span className="text-2xl font-bold text-white">{width}×{height}m</span>
        </div>
      )}
      
      {heatedArea && (
        <div className="border rounded-lg p-4 flex flex-col">
          <span className="text-white text-sm">{t('property.heatedArea')}</span>
          <span className="text-2xl font-bold text-white">{heatedArea} m²</span>
        </div>
      )}
      
      {propertyType && (
        <div className="border rounded-lg p-4 flex flex-col">
          <span className="text-white text-sm">{t('property.type')}</span>
          <span className="text-2xl font-bold text-white">{t(propertyType)}</span>
        </div>
      )}
      
      {pricePerSqm && area && (
        <div className="border rounded-lg p-4 flex flex-col">
          <span className="text-white text-sm">{t('property.pricePerSqm')}</span>
          <span className="text-2xl font-bold text-white">{formatCurrency(pricePerSqm, currency || undefined)}/m²</span>
        </div>
      )}
    </div>
  );
};
