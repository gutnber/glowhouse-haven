
import { ReactNode } from "react";

interface FooterCompanyInfoProps {
  logo_url: string | null;
  company: string | null;
}

export function FooterCompanyInfo({ logo_url, company }: FooterCompanyInfoProps) {
  return (
    <div className="space-y-4">
      {logo_url ? (
        <img 
          src={logo_url} 
          alt={company || "Inma Soluciones Inmobiliarias"} 
          className="h-16 object-contain" 
        />
      ) : (
        <h2 className="text-2xl font-bold text-primary">Inma Soluciones Inmobiliarias</h2>
      )}
      <p className="text-gray-300 text-sm max-w-xs">
        We specialize in helping you find your dream property with professional service and local expertise.
      </p>
    </div>
  );
}
