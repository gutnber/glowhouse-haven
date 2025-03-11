
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { Tables } from "@/integrations/supabase/types";

interface PropertyProfileHeaderProps {
  property: Tables<'properties'>;
}

export const PropertyProfileHeader = ({ property }: PropertyProfileHeaderProps) => {
  const { isAdmin } = useIsAdmin();
  
  return (
    <PropertyHeader 
      id={property.id} 
      name={property.name} 
      address={property.address} 
    />
  );
};
