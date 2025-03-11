
import { Home, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function FooterQuickLinks() {
  const { language } = useLanguage();
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-primary-foreground border-b border-gray-700 pb-2">
        {language === 'es' ? 'Enlaces Rápidos' : 'Quick Links'}
      </h3>
      <ul className="space-y-2">
        <li>
          <a href="/" className="text-gray-300 hover:text-white flex items-center gap-2 group">
            <Home className="h-4 w-4 text-orange-500" />
            <span className="group-hover:translate-x-1 transition-transform">
              {language === 'es' ? 'Inicio' : 'Home'}
            </span>
          </a>
        </li>
        <li>
          <a href="/properties" className="text-gray-300 hover:text-white flex items-center gap-2 group">
            <Home className="h-4 w-4 text-orange-500" />
            <span className="group-hover:translate-x-1 transition-transform">
              {language === 'es' ? 'Propiedades' : 'Properties'}
            </span>
          </a>
        </li>
        <li>
          <a href="/contact" className="text-gray-300 hover:text-white flex items-center gap-2 group">
            <Mail className="h-4 w-4 text-orange-500" />
            <span className="group-hover:translate-x-1 transition-transform">
              {language === 'es' ? 'Contáctenos' : 'Contact Us'}
            </span>
          </a>
        </li>
      </ul>
    </div>
  );
}
