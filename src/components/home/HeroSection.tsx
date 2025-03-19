
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer";
import { supabase } from "@/integrations/supabase/client";

export const HeroSection = () => {
  const { t, language } = useLanguage();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Fetch the Punta Colonet property data
  useEffect(() => {
    const fetchProperty = async () => {
      setLoading(true);
      try {
        // Search for property containing "Punta Colonet" in the name
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .ilike('name', '%Punta Colonet%')
          .limit(1);
          
        if (error) throw error;
        
        if (data && data.length > 0) {
          console.log("Found Punta Colonet property:", data[0]);
          setProperty(data[0]);
        }
      } catch (error) {
        console.error("Error fetching Punta Colonet property:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProperty();
  }, []);
  
  // Simulate loading of content for animation purposes
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const animationClass = animationComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8";
  
  // Determine the correct text based on language
  const headline = language === 'es' 
    ? "Encuentra la propiedad de tus sueños en Baja California" 
    : "Find Your Dream Property in Baja California";
    
  const subheadline = language === 'es'
    ? "Somos especialistas en bienes raíces, ofreciendo las mejores propiedades con servicio personalizado y conocimiento local."
    : "Real estate specialists offering premium properties with personalized service and local expertise.";
  
  const outcomes = language === 'es'
    ? [
        "Acceso exclusivo a las mejores propiedades en Baja California",
        "Asesoramiento personalizado durante todo el proceso",
        "Conocimiento local y experiencia en el mercado inmobiliario"
      ]
    : [
        "Exclusive access to the best properties in Baja California",
        "Personalized guidance throughout the entire process",
        "Local knowledge and expertise in the real estate market"
      ];
  
  const ctaText = language === 'es' ? "Programa tu consulta" : "Schedule Your Consultation";
  
  return (
    <div className="relative w-full h-[650px] md:h-[600px] lg:h-[650px] overflow-hidden rounded-3xl">
      {/* Diagonal Overlay - creates the split effect */}
      <div className="absolute inset-0 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 via-orange-500/80 to-transparent clip-diagonal" />
      </div>
      
      {/* Video Background Container - positioned on the right side */}
      <div className="absolute top-0 right-0 w-full h-full">
        {loading ? (
          <div className="h-full w-full bg-gray-800/50 animate-pulse"></div>
        ) : property?.youtube_url ? (
          <div className="w-full h-full">
            <div className="absolute inset-0 bg-black/30 z-[5]"></div>
            <PropertyYouTubePlayer 
              youtubeUrl={property.youtube_url} 
              autoplay={true} 
              muted={true}
              controls={false}
              className="w-full h-full object-cover"
            />
          </div>
        ) : property?.feature_image_url ? (
          <div className="w-full h-full">
            <div className="absolute inset-0 bg-black/30 z-[5]"></div>
            <img 
              src={property.feature_image_url} 
              alt={property.name} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-orange-600 to-orange-800"></div>
        )}
      </div>

      {/* Content Container - positioned over the diagonal overlay */}
      <div className="relative z-20 h-full">
        <div className="container mx-auto h-full px-6">
          <div className="flex flex-col justify-center h-full max-w-md lg:max-w-xl">
            {/* Headline & Subheadline */}
            <div className={`space-y-4 transition-all duration-700 delay-100 ${animationClass}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                {headline}
              </h1>
              <p className="text-lg md:text-xl text-white/90 max-w-xl">
                {subheadline}
              </p>
            </div>
            
            {/* Social Proof */}
            <div className={`flex items-center gap-2 mt-5 transition-all duration-700 delay-200 ${animationClass}`}>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-white text-sm font-medium">
                {language === 'es' ? "100+ clientes satisfechos" : "100+ satisfied clients"}
              </span>
            </div>
            
            {/* Key Outcomes */}
            <div className={`space-y-3 mt-6 transition-all duration-700 delay-300 ${animationClass}`}>
              {outcomes.map((outcome, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="bg-white/20 p-1 rounded-full">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white">{outcome}</span>
                </div>
              ))}
            </div>
            
            {/* CTA Button */}
            <div className={`mt-8 transition-all duration-700 delay-400 ${animationClass}`}>
              <Button 
                asChild
                size="lg"
                className="bg-white text-orange-600 hover:bg-white/90 font-medium rounded-full px-8 py-6 h-auto shadow-xl transition-all group"
              >
                <Link to="/contact" className="flex items-center gap-2">
                  {ctaText}
                  <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Property Info Badge - positioned at the bottom right */}
      {!loading && property && (
        <div className="absolute bottom-6 right-6 z-30 max-w-xs">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-xl">
            <p className="text-white font-medium text-lg">{property.name || "Punta Colonet Property"}</p>
            <p className="text-yellow-300 font-bold">
              {property.price ? 
                `$${property.price?.toLocaleString()} ${property.currency || 'USD'}` : 
                "Contact for pricing"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
