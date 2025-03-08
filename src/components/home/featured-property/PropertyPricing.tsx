
import { formatCurrency } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";

interface PropertyPricingProps {
  property: Tables<'properties'>;
}

export const PropertyPricing = ({ property }: PropertyPricingProps) => {
  const currencySymbol = property.currency === "MXN" ? "MX$" : "$";
  
  return (
    <div className="space-y-1">
      {property.price_per_sqm && property.area && (
        <p className="text-lg text-orange-400/80">
          {currencySymbol}{property.price_per_sqm.toLocaleString()}/m²
        </p>
      )}
      <p className="text-2xl font-semibold text-orange-500">
        {formatCurrency(property.price, property.currency)}
      </p>
    </div>
  );
};
