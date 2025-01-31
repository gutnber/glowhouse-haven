import * as React from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "welcome": "Welcome to INMA 2.0",
    "subscribe": "Please subscribe to get the latest news and hottest deals",
    "latestNews": "Latest News",
    "viewAllNews": "View All News",
    "showMoreNews": "Show More News",
    "loadMore": "Load More",
    "beds": "Beds",
    "baths": "Baths",
    "properties": "Properties",
    "home": "Home",
    "settings": "Settings",
    "users": "Users",
    "tools": "Tools",
    "signIn": "Sign In",
    "signOut": "Sign Out",
    "propertyManagement": "Property Management",
    "loading": "Loading properties...",
    "addProperty": "Add Property",
    "featuredProperties": "Featured Properties",
    "viewAllProperties": "View All Properties",
    "propertyType": "Property Type",
    "allProperties": "All Properties",
    "townhouse": "Townhouse",
    "vacantLand": "Vacant Land",
    "condo": "Condo",
    "apartment": "Apartment",
    "multifamily": "Multi-Family",
    "singleFamily": "Single Family",
    "commercial": "Commercial"
  },
  es: {
    "welcome": "Bienvenidos a INMA 2.0",
    "subscribe": "Suscríbase para recibir las últimas noticias y las mejores ofertas",
    "latestNews": "Últimas Noticias",
    "viewAllNews": "Ver Todas las Noticias",
    "showMoreNews": "Mostrar Más Noticias",
    "loadMore": "Cargar Más",
    "beds": "Camas",
    "baths": "Baños",
    "properties": "Propiedades",
    "home": "Inicio",
    "settings": "Configuración",
    "users": "Usuarios",
    "tools": "Herramientas",
    "signIn": "Iniciar Sesión",
    "signOut": "Cerrar Sesión",
    "propertyManagement": "Gestión de Propiedades",
    "loading": "Cargando propiedades...",
    "addProperty": "Agregar Propiedad",
    "featuredProperties": "Propiedades Destacadas",
    "viewAllProperties": "Ver Todas las Propiedades",
    "propertyType": "Tipo de Propiedad",
    "allProperties": "Todas las Propiedades",
    "townhouse": "Casa Adosada",
    "vacantLand": "Terreno",
    "condo": "Condominio",
    "apartment": "Departamento",
    "multifamily": "Multi-Familiar",
    "singleFamily": "Unifamiliar",
    "commercial": "Comercial"
  }
};

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = React.useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}