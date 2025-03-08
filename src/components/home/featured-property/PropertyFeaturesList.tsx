
import { Tables } from "@/integrations/supabase/types";

interface PropertyFeaturesListProps {
  features: string[] | null;
}

export const PropertyFeaturesList = ({ features }: PropertyFeaturesListProps) => {
  if (!features || features.length === 0) {
    return null;
  }
  
  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {features.map((feature, index) => (
        <span 
          key={index}
          className="px-2 py-1 rounded-full bg-orange-500/20 text-orange-500 text-xs"
        >
          {feature}
        </span>
      ))}
    </div>
  );
};
