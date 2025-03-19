
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronRight, Star, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { PropertyYouTubePlayer } from "@/components/property/PropertyYouTubePlayer";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

export const HeroSection = () => {
  const {
    t,
    language
  } = useLanguage();
  const [animationComplete, setAnimationComplete] = useState(false);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const isMobile = useIsMobile();

  // Fetch Punta Colonet property data
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const {
          data,
          error
        } = await supabase.from('properties').select('*').ilike('name', '%colonet%').limit(1).single();
        if (error) {
          console.error('Error fetching property:', error);
        } else if (data) {
          setPropertyData(data);
        }
      } catch (err) {
        console.error('Error in fetching property:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPropertyData();
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
  const headline = language === 'es' ? "Encuentra la propiedad de tus sueños en Baja California" : "Find Your Dream Property in Baja California";
  const subheadline = language === 'es' ? "Somos especialistas en bienes raíces, ofreciendo las mejores propiedades con servicio personalizado y conocimiento local." : "Real estate specialists offering premium properties with personalized service and local expertise.";
  const outcomes = language === 'es' ? ["Acceso exclusivo a las mejores propiedades en Baja California", "Asesoramiento personalizado durante todo el proceso", "Conocimiento local y experiencia en el mercado inmobiliario"] : ["Exclusive access to the best properties in Baja California", "Personalized guidance throughout the entire process", "Local knowledge and expertise in the real estate market"];
  const ctaText = language === 'es' ? "Programa tu consulta" : "Schedule Your Consultation";
  return <div className="relative py-16 md:py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl shadow-xl overflow-hidden my-[15px]">
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/10 backdrop-blur-sm my-0 py-0"></div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10 px-6 md:px-10 max-w-7xl mx-auto">
        {/* Left Column - Text Content */}
        <div className="space-y-8 flex flex-col justify-center">
          {/* Headline & Subheadline */}
          <div className={`space-y-4 transition-all duration-700 delay-100 ${animationClass}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-gradient">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-xl">
              {subheadline}
            </p>
          </div>
          
          {/* Social Proof */}
          <div className={`flex items-center gap-2 transition-all duration-700 delay-200 ${animationClass}`}>
            <div className="flex">
              {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-5 w-5 fill-orange-500 text-orange-500" />)}
            </div>
            <span className="text-white/70 text-sm">
              {language === 'es' ? "100+ clientes satisfechos" : "100+ satisfied clients"}
            </span>
          </div>
          
          {/* Key Outcomes */}
          <div className={`space-y-3 transition-all duration-700 delay-300 ${animationClass}`}>
            {outcomes.map((outcome, index) => <div key={index} className="flex items-center gap-3">
                <div className="bg-orange-500/20 p-1 rounded-full">
                  <Check className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-white">{outcome}</span>
              </div>)}
          </div>
          
          {/* CTA Button */}
          <div className={`pt-4 transition-all duration-700 delay-400 ${animationClass}`}>
            <Button asChild size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all group">
              <Link to="/contact" className="flex items-center gap-2">
                {ctaText}
                <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Right Column - Property Video/Image & Property Info */}
        <div className="bg-inherit">
          {/* Video Container - Adjusted position and rounded corners for all devices */}
          <div className={`relative rounded-2xl overflow-hidden shadow-2xl border border-white/20 max-w-md w-full aspect-video scale-150 mx-auto md:mx-0 ${isMobile ? "" : "md:ml-auto md:-ml-12 md:mt-24"}`}>
            {propertyData?.youtube_url ? <PropertyYouTubePlayer youtubeUrl={propertyData.youtube_url} autoplay={true} muted={true} controls={true} /> : <img src={propertyData?.feature_image_url || "/hero-property.jpg"} alt="Property in Baja California" className="w-full h-full object-cover" onError={e => {
            // Fallback in case image doesn't load
            e.currentTarget.src = "/placeholder.svg";
          }} />}
          </div>
          
          {/* Property Information Card - Below the Video */}
          <div className={`mt-10 w-full max-w-md mx-auto md:mx-0 ${isMobile ? "" : "md:ml-auto md:-ml-12"}`}>
            <div className="bg-gray-800/80 backdrop-blur-md rounded-xl p-4 border border-gray-700 shadow-lg my-0 py-[22px]">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-white font-medium text-lg">
                    {propertyData?.name || (language === 'es' ? "Punta Colonet" : "Punta Colonet")}
                  </h3>
                  <p className="text-orange-300 font-bold text-xl mt-1">
                    {propertyData ? formatCurrency(propertyData.price, propertyData.currency) : "$1,200,000 USD"}
                  </p>
                </div>
                <Link to={`/properties/${propertyData?.id || ""}`} className="text-orange-400 hover:text-orange-300 text-sm font-medium transition-colors">
                  {language === 'es' ? "Ver detalles" : "View details"} →
                </Link>
              </div>
              
              {propertyData?.area && <p className="text-gray-300 text-sm mt-2">
                  {propertyData.area.toLocaleString()} m² | 
                  {propertyData.price_per_sqm ? ` ${formatCurrency(propertyData.price_per_sqm, propertyData.currency)}/m²` : ""}
                </p>}
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-16 -left-16 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>
        </div>
      </div>
    </div>;
};
