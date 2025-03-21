
import { ReactNode } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface FooterCompanyInfoProps {
  logo_url: string | null;
  company: string | null;
}

export function FooterCompanyInfo({ logo_url, company }: FooterCompanyInfoProps) {
  const { language } = useLanguage();
  const companyName = company || "Inma Soluciones Inmobiliarias";
  
  return (
    <div className="space-y-4">
      {logo_url ? (
        <img 
          src={logo_url} 
          alt={companyName} 
          className="h-16 object-contain" 
        />
      ) : (
        <h2 className="text-2xl font-bold text-primary">{companyName}</h2>
      )}
      <p className="text-gray-300 text-sm max-w-xs">
        {language === 'es' 
          ? "Nos especializamos en ayudarte a encontrar tu propiedad ideal con servicio profesional y experiencia local."
          : "We specialize in helping you find your dream property with professional service and local expertise."}
      </p>
    </div>
  );
}
