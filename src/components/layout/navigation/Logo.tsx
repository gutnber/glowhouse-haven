
import { Link } from "react-router-dom";
import { Home, Building, Newspaper, MailPlus, MessageSquare, MapPin } from "lucide-react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export function Logo() {
  const { isAdmin } = useIsAdmin();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useLanguage();
  
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        setIsLoading(true);
        // Check local storage first for cached logo URL
        const cachedLogo = localStorage.getItem('app_logo_url');
        
        if (cachedLogo) {
          setLogoUrl(cachedLogo);
          setIsLoading(false);
        }
        
        // Still fetch from server to update if needed
        const { data, error } = await supabase
          .from('app_settings')
          .select('logo_url')
          .single();
        
        if (error) {
          console.error('Error fetching logo:', error);
          return;
        }
        
        if (data?.logo_url) {
          // Cache the logo URL
          localStorage.setItem('app_logo_url', data.logo_url);
          setLogoUrl(data.logo_url);
        }
      } catch (error) {
        console.error('Error fetching logo:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLogo();
  }, []);
  
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
  };
  
  // Default to the INMA logo if no custom logo is loaded
  const defaultLogo = "/inma-logo.svg";
  
  return (
    <div className="flex items-center gap-6">
      <Link to="/" className="flex items-center text-xl font-bold text-primary">
        {!isLoading && logoUrl ? (
          <img 
            src={logoUrl} 
            alt="Company Logo" 
            className="h-[70px] max-w-[180px] object-contain transition-opacity duration-300" 
          />
        ) : (
          <img 
            src={defaultLogo}
            alt="Default Logo"
            className="h-[70px] max-w-[180px] object-contain transition-opacity duration-300"
          />
        )}
      </Link>
      <nav className="hidden lg:flex items-center gap-6">
        <Link to="/" className="flex items-center gap-1.5 text-white/90 hover:text-orange-400 transition-colors duration-200">
          <Home className="h-4 w-4" />
          <span className="font-medium">{capitalizeFirstLetter(t('home'))}</span>
        </Link>
        <Link to="/properties" className="flex items-center gap-1.5 text-white/90 hover:text-orange-400 transition-colors duration-200">
          <Building className="h-4 w-4" />
          <span className="font-medium">{capitalizeFirstLetter(t('properties'))}</span>
        </Link>
        <Link to="/frasa" className="flex items-center gap-1.5 text-[hsl(84,60%,50%)] hover:text-[hsl(84,60%,60%)] transition-colors duration-200">
          <MapPin className="h-4 w-4" />
          <span className="font-medium">Frasa</span>
        </Link>
        <Link to="/news" className="flex items-center gap-1.5 text-white/90 hover:text-orange-400 transition-colors duration-200">
          <Newspaper className="h-4 w-4" />
          <span className="font-medium">{capitalizeFirstLetter(t('news'))}</span>
        </Link>
        <Link to="/contact" className="flex items-center gap-1.5 text-white/90 hover:text-orange-400 transition-colors duration-200">
          <MailPlus className="h-4 w-4" />
          <span className="font-medium">{capitalizeFirstLetter(t('contact'))}</span>
        </Link>
        {isAdmin && (
          <Link to="/admin/communications" className="flex items-center gap-1.5 text-white/90 hover:text-orange-400 transition-colors duration-200">
            <MessageSquare className="h-4 w-4" />
            <span className="font-medium">{capitalizeFirstLetter(t('communications'))}</span>
          </Link>
        )}
      </nav>
    </div>
  );
}
