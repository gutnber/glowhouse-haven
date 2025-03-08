
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
  
  return (
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
      
      {pricePerSqm && area && (
        <div className="border rounded-lg p-4 flex flex-col">
          <span className="text-muted-foreground text-sm">{t('property.pricePerSqm')}</span>
          <span className="text-2xl font-bold">{formatCurrency(pricePerSqm, currency || undefined)}/m²</span>
        </div>
      )}
    </div>
  );
};
