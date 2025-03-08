
import { ReactNode } from "react";

interface FooterCompanyInfoProps {
  logo_url: string | null;
  company: string | null;
}

export function FooterCompanyInfo({ logo_url, company }: FooterCompanyInfoProps) {
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
        We specialize in helping you find your dream property with professional service and local expertise.
      </p>
    </div>
  );
}
