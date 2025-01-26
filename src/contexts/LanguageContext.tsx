import React, { createContext, useContext, useState } from 'react';

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
  },
  es: {
    "welcome": "Bienvenido a nuestro nido de inversores en Florida",
    "subscribe": "Suscríbase para recibir las últimas noticias y las mejores ofertas",
    "featuredProperties": "Propiedades Destacadas",
    "viewAllProperties": "Ver Todas las Propiedades",
    "beds": "Habitaciones",
    "baths": "Baños",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

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
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}