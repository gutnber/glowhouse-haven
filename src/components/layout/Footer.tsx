
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { FooterCompanyInfo } from "./footer/FooterCompanyInfo";
import { FooterQuickLinks } from "./footer/FooterQuickLinks";
import { FooterContactInfo } from "./footer/FooterContactInfo";
import { NewsletterForm } from "./footer/NewsletterForm";
import { CopyrightSection } from "./footer/CopyrightSection";

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

  useEffect(() => {
    fetchFooterSettings();
  }, []);

  const fetchFooterSettings = async () => {
    const { data, error } = await supabase.from('footer_settings').select('*').single();
    if (error) {
      console.error('Error fetching footer settings:', error);
      return;
    }

    // Merge default values with database settings
    setSettings({
      ...data,
      phone: data.phone || "+52 664 484 2251",
      address: data.address || "Calle 10ma. esq. Sirak Baloyan 8779-206 Zona Centro, C.P. 22000, Tijuana, B.C.",
      company: data.company || "Inma Soluciones Inmobiliarias",
      logo_url: data.logo_url || "https://inma.pro/static/images/logo.svg"
    });
  };

  if (!settings?.enabled) {
    return null;
  }

  return (
    <footer className="mt-auto bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-lg">
      <div className="container mx-auto py-12 px-4">
        {/* Top section with logo and company info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <FooterCompanyInfo logo_url={settings.logo_url} company={settings.company} />
          <FooterQuickLinks />
          <FooterContactInfo phone={settings.phone} address={settings.address} />
        </div>
        
        {/* Newsletter signup form */}
        <div className="border-t border-gray-700 pt-8 mt-8">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-xl font-semibold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-gray-300 mb-6">Stay updated with our latest properties and real estate news</p>
            <NewsletterForm placeholder={settings.subscribe_email} />
          </div>
        </div>
        
        {/* Copyright */}
        <CopyrightSection company={settings.company} />
      </div>
    </footer>
  );
}
