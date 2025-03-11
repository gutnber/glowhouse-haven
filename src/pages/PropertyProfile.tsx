
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { PropertyHeader } from "@/components/property/PropertyHeader";
import { PropertyImageGallery } from "@/components/property/PropertyImageGallery";
import { PropertyDetails } from "@/components/property/PropertyDetails";
import { PropertyContactForm } from "@/components/property/PropertyContactForm";
import { PropertyMap } from "@/components/property/PropertyMap";
import { House, Play, MessageCircle } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";
import { TopNavigation } from "@/components/layout/TopNavigation";
import { useAuthSession } from "@/hooks/useAuthSession";
import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer";
import { useLanguage } from "@/contexts/LanguageContext";

const PropertyProfile = () => {
  const { id } = useParams();
  const { isAdmin } = useIsAdmin();
  const { toast } = useToast();
  const { t } = useLanguage();
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({
    x: 50,
    y: 50
  });
  const [showVideo, setShowVideo] = useState(false);
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
  
  const updateImagePositionMutation = useMutation({
    mutationFn: async (position: string) => {
      const {
        error
      } = await supabase.from('properties').update({
        feature_image_position: position
      }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Image position updated successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update image position",
        variant: "destructive"
      });
    }
  });
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isAdmin) return;
    setIsDragging(true);
    e.preventDefault(); // Prevent image dragging
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current || !isAdmin) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;

    // Clamp values between 0 and 100
    const clampedX = Math.max(0, Math.min(100, x));
    const clampedY = Math.max(0, Math.min(100, y));
    setPosition({
      x: clampedX,
      y: clampedY
    });
  };
  
  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Convert position to CSS object-position format
    const positionString = `${position.x}% ${position.y}%`;
    updateImagePositionMutation.mutate(positionString);
  };
  
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
          <PropertyHeader id={property.id} name={property.name} address={property.address} />

          {/* Media Section - Video or Feature Image */}
          <div className="relative rounded-xl overflow-hidden border border-orange-500/30 shadow-xl">
            {property.youtube_url ? (
              <div className="aspect-video w-full">
                <PropertyYouTubePlayer 
                  youtubeUrl={property.youtube_url} 
                  autoplay={property.youtube_autoplay} 
                  muted={property.youtube_muted} 
                  controls={property.youtube_controls} 
                />
              </div>
            ) : property.feature_image_url ? (
              <div ref={containerRef} className="relative" onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
                <div className="w-full h-[500px] relative">
                  <img 
                    ref={imageRef} 
                    src={property.feature_image_url} 
                    alt={`${property.name} banner`} 
                    className={`w-full h-full object-cover transition-all duration-200 ${isAdmin ? 'cursor-move' : ''}`} 
                    style={{
                      objectPosition: isDragging ? `${position.x}% ${position.y}%` : property.feature_image_position || '50% 50%'
                    }} 
                    onMouseDown={handleMouseDown} 
                  />
                </div>
                {isAdmin && (
                  <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    {isDragging ? 'Release to save position' : 'Click and drag to adjust image position'}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-[500px] bg-gradient-to-r from-orange-900/20 via-gray-800/30 to-orange-900/20 flex items-center justify-center">
                <House className="h-32 w-32 text-orange-500/50" />
              </div>
            )}
          </div>

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
              <div className="bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900 p-6 rounded-xl border border-orange-500/30 shadow-xl">
                <PropertyContactForm 
                  propertyId={property.id} 
                  propertyName={property.name} 
                  enableBorderBeam={property.enable_border_beam} 
                />
                
                {/* WhatsApp Contact Button - Moved from header */}
                <div className="mt-4">
                  <Button 
                    onClick={() => {
                      const message = `Hi! I'm interested in the property: ${property.name} at ${property.address}`;
                      const encodedMessage = encodeURIComponent(message);
                      const whatsappUrl = `https://wa.me/526461961667?text=${encodedMessage}`;
                      window.open(whatsappUrl, '_blank');
                    }} 
                    variant="secondary"
                    className="w-full flex items-center justify-center"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {t('whatsapp')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Footer is already included in RootLayout */}
    </div>
  );
};

export default PropertyProfile;
