
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tables } from "@/integrations/supabase/types";
import { PropertyPricing } from "./PropertyPricing";
import { PropertyFeatures } from "./PropertyFeatures";
import { PropertyFeaturesList } from "./PropertyFeaturesList";

interface PropertyContentProps {
  property: Tables<'properties'>;
}

export const PropertyContent = ({ property }: PropertyContentProps) => {
  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-white">{property.name}</h2>
      
      <PropertyPricing property={property} />
      
      <div className="space-y-2">
        <PropertyFeatures property={property} />
        
        <p className="text-white/80 line-clamp-4">{property.description}</p>
        
        <PropertyFeaturesList features={property.features} />
        
        <Button asChild className="w-full mt-4">
          <Link to={`/properties/${property.id}`}>
            View More <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};
