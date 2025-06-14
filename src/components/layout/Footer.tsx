
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FooterCompanyInfo } from "./footer/FooterCompanyInfo";
import { FooterQuickLinks } from "./footer/FooterQuickLinks";
import { FooterContactInfo } from "./footer/FooterContactInfo";
import { NewsletterForm } from "./footer/NewsletterForm";
import { CopyrightSection } from "./footer/CopyrightSection";
import { useLanguage } from "@/contexts/LanguageContext";

interface FooterSettings {
  phone: string | null;
  address: string | null;
  company: string | null;
  logo_url: string | null;
  subscribe_email: string | null;
  enabled: boolean;
}

export function Footer() {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const { language } = useLanguage();
  
  useEffect(() => {
    // Fetch initial data
    fetchFooterSettings();
    
    // Setup a real-time listener for footer_settings changes
    const channel = supabase
      .channel('footer_settings_changes')
      .on('postgres_changes', {
        event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
        schema: 'public',
        table: 'footer_settings'
      }, (payload) => {
        console.log('Footer settings changed, payload:', payload);
        // Force a refresh by incrementing the update trigger
        setUpdateTrigger(prev => prev + 1);
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  // Re-fetch data when update trigger changes
  useEffect(() => {
    if (updateTrigger > 0) {
      console.log('Update trigger fired, refreshing footer settings...');
      fetchFooterSettings();
    }
  }, [updateTrigger]);

  const fetchFooterSettings = async () => {
    console.log('Fetching footer settings...');
    const { data, error } = await supabase
      .from('footer_settings')
      .select('*')
      .single();
      
    if (error) {
      console.error('Error fetching footer settings:', error);
      return;
    }

    console.log('Footer settings fetched:', data);
    
    // Only set the settings if we actually got data back
    if (data) {
      setSettings(data);
    }
  };

  // If settings are disabled or not loaded yet, don't render the footer
  if (!settings?.enabled) {
    return null;
  }

  return (
    <footer className="mt-auto bg-gradient-to-r from-card via-card to-card border-t border-border shadow-lg">
      <div className="container mx-auto py-12 px-4">
        {/* Top section with logo and company info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <FooterCompanyInfo logo_url={settings.logo_url} company={settings.company} />
          <FooterQuickLinks />
          <FooterContactInfo phone={settings.phone} address={settings.address} />
        </div>
        
        {/* Newsletter signup form */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4 text-foreground">{language === 'es' ? 'Suscríbete a Nuestro Boletín' : 'Subscribe to Our Newsletter'}</h3>
            <p className="text-muted-foreground mb-6">{language === 'es' ? 'Mantente actualizado con nuestras últimas propiedades y noticias inmobiliarias' : 'Stay updated with our latest properties and real estate news'}</p>
            <NewsletterForm placeholder={settings.subscribe_email} />
          </div>
        </div>
        
        {/* Copyright */}
        <CopyrightSection company={settings.company} />
      </div>
    </footer>
  );
}
