
import { useLanguage } from "@/contexts/LanguageContext";

interface PropertyPriceProps {
  price: number;
  currency?: string | null;
  referenceNumber: string | null;
  arv: number | null;
}

export const PropertyPrice = ({
  price,
  currency = "USD",
  referenceNumber,
  arv
}: PropertyPriceProps) => {
  const { t } = useLanguage();
  
  // Format price with currency
  const formatPriceWithCurrency = (value: number, currencyCode: string = "USD") => {
    const symbol = currencyCode === "MXN" ? "MX$" : "$";
    return `${symbol}${value.toLocaleString()}`;
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col">
      <span className="text-muted-foreground text-sm">{t('property.price')}</span>
      <span className="text-3xl font-bold">{formatPriceWithCurrency(price, currency || undefined)}</span>
      
      {referenceNumber && (
        <div className="mt-2">
          <span className="text-muted-foreground text-sm">{t('property.referenceNumber')}</span>
          <span className="text-xl font-semibold ml-2">{referenceNumber}</span>
        </div>
      )}
      
      {arv && (
        <div className="mt-2">
          <span className="text-muted-foreground text-sm">{t('property.arvLabel')}</span>
          <span className="text-xl font-semibold ml-2">{formatPriceWithCurrency(arv, currency || undefined)}</span>
        </div>
      )}
    </div>
  );
};
