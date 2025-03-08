
import { formatCurrency } from "@/lib/utils";
import { Tables } from "@/integrations/supabase/types";

interface PropertyPricingProps {
  property: Tables<'properties'>;
}

export const PropertyPricing = ({ property }: PropertyPricingProps) => {
  return (
    <div className="space-y-1">
      <p className="text-2xl font-semibold text-orange-500">
        {formatCurrency(property.price, property.currency)}
      </p>
      {property.price_per_sqm && property.area && (
        <p className="text-lg text-orange-400/80">
          {formatCurrency(property.price_per_sqm, property.currency)}/m²
        </p>
      )}
    </div>
  );
};
