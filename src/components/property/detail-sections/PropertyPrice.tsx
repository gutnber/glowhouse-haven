
import { useLanguage } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/lib/utils";

interface PropertyPriceProps {
  price: number;
  currency?: string | null;
  referenceNumber: string | null;
  arv: number | null;
  pricePerSqm?: number | null;
}

export const PropertyPrice = ({
  price,
  currency = "USD",
  referenceNumber,
  arv,
  pricePerSqm
}: PropertyPriceProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <span className="text-white text-sm">{t('property.price')}</span>
      <div className="space-y-1">
        <span className="text-3xl font-bold text-white">{formatCurrency(price, currency || undefined)}</span>
        {pricePerSqm && (
          <div className="text-xl text-orange-500 mt-1 font-semibold">
            {formatCurrency(pricePerSqm, currency || undefined)}/m²
          </div>
        )}
      </div>
      
      {referenceNumber && (
        <div className="mt-2">
          <span className="text-white text-sm">{t('property.referenceNumber')}</span>
          <span className="text-xl font-semibold text-white ml-2">{referenceNumber}</span>
        </div>
      )}
      
      {arv && (
        <div className="mt-2">
          <span className="text-white text-sm">{t('property.arvLabel')}</span>
          <span className="text-xl font-semibold text-white ml-2">{formatCurrency(arv, currency || undefined)}</span>
        </div>
      )}
      
      {/* Removed duplicate price per sqm section since it's already shown prominently below the main price */}
    </div>
  );
};
