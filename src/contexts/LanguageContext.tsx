import * as React from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    "welcome": "Welcome to our investors nest in florida",
    "subscribe": "Please subscribe to get the latest news and hottest deals",
    "featuredProperties": "Featured Properties",
    "viewAllProperties": "View All Properties",
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
    "addProperty": "Add Property"
  },
  es: {
    "welcome": "Bienvenido a nuestro nido de inversores en Florida",
    "subscribe": "Suscríbase para recibir las últimas noticias y las mejores ofertas",
    "featuredProperties": "Propiedades Destacadas",
    "viewAllProperties": "Ver Todas las Propiedades",
    "beds": "Habitaciones",
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
    "addProperty": "Agregar Propiedad"
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