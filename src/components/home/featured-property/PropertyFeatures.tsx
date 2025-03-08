
import { Ruler } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";

interface PropertyFeaturesProps {
  property: Tables<'properties'>;
}

export const PropertyFeatures = ({ property }: PropertyFeaturesProps) => {
  const isVacantLand = property.property_type === 'vacantLand';
  
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {!isVacantLand && (
        <>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
            {property.bedrooms} beds
          </span>
          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm">
            {property.bathrooms} baths
          </span>
        </>
      )}
      {property.area && (
        <span className="px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-gray-600 text-white text-sm flex items-center gap-1">
          <Ruler className="h-4 w-4" />
          {property.area} m²
        </span>
      )}
    </div>
  );
};
