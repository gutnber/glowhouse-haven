
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery";
import { PropertyDetails } from "@/components/property/PropertyDetails";
import { PropertyMap } from "@/components/property/PropertyMap";
import { House } from "lucide-react";
import { useRef, useState } from "react";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { useAuthSession } from "@/hooks/useAuthSession";
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyProfileHeader } from "@/components/property/profile/PropertyProfileHeader";
import { PropertyMainMedia } from "@/components/property/profile/PropertyMainMedia";
import { PropertyContactSection } from "@/components/property/profile/PropertyContactSection";

const PropertyProfile = () => {
  const { id } = useParams();
  const { t } = useLanguage();
  const session = useAuthSession();
  
  const {
    data: property,
    isLoading
  } = useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      console.log('Fetching property with id:', id);
      const {
        data,
        error
      } = await supabase.from('properties').select('*').eq('id', id).single();
      if (error) throw error;
      console.log('Fetched property:', data);
      return data as Tables<'properties'>;
    }
  });
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-900 via-black to-orange-900">
        <p className="text-white">Loading property...</p>
      </div>
    );
  }
  
  if (!property) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-0 bg-gradient-to-br from-gray-900 via-black to-orange-900">
        <p className="text-xl text-white">Property not found</p>
        <Button asChild className="bg-orange-600 hover:bg-orange-700">
          <Link to="/properties">Back to Properties</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation session={session} />
      <main className="flex-1 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 pt-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <PropertyProfileHeader property={property} />

          {/* Media Section - Video or Feature Image */}
          <PropertyMainMedia property={property} />

          {/* Image Gallery */}
          <PropertyImageGallery 
            images={property.images || []} 
            propertyId={property.id} 
            propertyName={property.name} 
            featureImageUrl={property.feature_image_url} 
          />

          {/* Content Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column - Property Details */}
            <div className="space-y-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl border border-orange-500/30 shadow-xl">
              <PropertyDetails 
                bedrooms={property.bedrooms} 
                bathrooms={property.bathrooms} 
                buildYear={property.build_year} 
                price={property.price} 
                currency={property.currency}
                pricePerSqm={property.price_per_sqm}
                arv={property.arv} 
                description={property.description} 
                features={property.features} 
                youtubeUrl={null} /* Removing YouTube from details since it's at the top */
                youtubeAutoplay={property.youtube_autoplay} 
                youtubeMuted={property.youtube_muted} 
                youtubeControls={property.youtube_controls}
                area={property.area}
                heatedArea={property.heated_area}
                referenceNumber={property.reference_number}
                enableBorderBeam={property.enable_border_beam}
                propertyType={property.property_type}
                id={property.id}
                name={property.name}
              />
            </div>
            
            {/* Right Column - Map and Contact Form */}
            <div className="space-y-6">
              {/* Map Section */}
              {(property.latitude && property.longitude) || property.google_maps_url ? (
                <div className="rounded-xl overflow-hidden border border-orange-500/30 shadow-xl h-[500px]">
                  <PropertyMap 
                    latitude={property.latitude} 
                    longitude={property.longitude} 
                    googleMapsUrl={property.google_maps_url} 
                  />
                </div>
              ) : null}
              
              {/* Contact Form */}
              <PropertyContactSection property={property} />
            </div>
          </div>
        </div>
      </main>
      {/* Footer is already included in RootLayout */}
    </div>
  );
};

export default PropertyProfile;
