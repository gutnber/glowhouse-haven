import { useLanguage } from "@/contexts/LanguageContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FeaturedPropertyCard } from "./FeaturedPropertyCard";

export const WelcomeSection = () => {
  const { t } = useLanguage();

  // Fetch app settings to determine if featured property should be shown
  const { data: settings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ['app-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('app_settings')
        .select('*')
        .single();
      
      if (error) {
        console.error('Error fetching app settings:', error);
        return { featured_property_enabled: false };
      }
      return data;
    }
  });

  // Fetch featured property only if the setting is enabled
  const { data: featuredProperty, isLoading: isLoadingProperty } = useQuery({
    queryKey: ['featured-property'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('is_featured', true)
        .single();
      
      if (error) {
        console.error('Error fetching featured property:', error);
        return null;
      }
      return data;
    },
    enabled: !!settings?.featured_property_enabled
  });

  // If still loading, don't show anything yet
  if (isLoadingSettings || (settings?.featured_property_enabled && isLoadingProperty)) {
    return null;
  }

  // Show featured property if enabled and available
  if (settings?.featured_property_enabled && featuredProperty) {
    return <FeaturedPropertyCard property={featuredProperty} />;
  }

  // Otherwise show the welcome message
  return (
    <div className="relative space-y-6 py-24 px-8">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-3xl backdrop-blur-xl border border-orange-500/10" />
      <div className="relative">
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-orange-600 text-center">
          {t('welcome')}
        </h1>
        <p className="text-xl max-w-2xl mx-auto leading-relaxed mt-6 text-center text-zinc-100">
          {t('subscribe')}
        </p>
      </div>
    </div>
  );
};
