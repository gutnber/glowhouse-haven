
import { PropertyContactForm } from "@/components/property/PropertyContactForm";
import { WhatsAppButton } from "@/components/property/contact-form/WhatsAppButton";
import { Tables } from "@/integrations/supabase/types";

interface PropertyContactSectionProps {
  property: Tables<'properties'>;
}

export const PropertyContactSection = ({ property }: PropertyContactSectionProps) => {
  return (
    <div className="bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900 p-6 rounded-xl border border-orange-500/30 shadow-xl">
      <PropertyContactForm 
        propertyId={property.id} 
        propertyName={property.name} 
        enableBorderBeam={property.enable_border_beam} 
      />
      
      {/* WhatsApp Contact Button */}
      <div className="mt-4">
        <WhatsAppButton
          propertyName={property.name}
          propertyAddress={property.address || ''}
          className="bg-green-600 hover:bg-green-700 text-white w-full"
        />
      </div>
    </div>
  );
};
