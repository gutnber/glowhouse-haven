
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export const HeroSection = () => {
  const { language } = useLanguage();

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center py-16 md:py-24 rounded-3xl overflow-hidden mx-4 md:mx-8 lg:mx-12">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-gray-800/95 to-gray-900/90"></div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center space-y-8">
        {/* Welcome Text */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
          {language === 'es' ? 'Bienvenidos a INMA' : 'Welcome to INMA'}
        </h1>
        
        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto">
          {language === 'es' 
            ? 'Descubre propiedades excepcionales en Baja California' 
            : 'Discover exceptional properties in Baja California'}
        </p>
        
        {/* CTA Button */}
        <div className="mt-12">
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-full px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all"
          >
            <Link to="/properties">
              {language === 'es' ? 'Explorar Propiedades' : 'Explore Properties'}
            </Link>
          </Button>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ChevronDown className="h-8 w-8 text-white/50" />
        </div>
      </div>
      
      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
      <div className="absolute -top-16 -left-16 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl"></div>
    </div>
  );
};
