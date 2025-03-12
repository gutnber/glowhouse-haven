
import * as React from 'react';
import { Language, LanguageContextType, MetaTags } from './types';
import { translations } from './translations';
import { getTranslationValue, updateMetaTags } from './utils';

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    return (savedLanguage === 'en' || savedLanguage === 'es') ? savedLanguage : 'es';
  });

  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
    updateMetaTags(newLang);
  };

  const t = (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 1) {
      const value = translations[language][key];
      return typeof value === 'string' ? value : key;
    } else {
      return getTranslationValue(translations[language], parts);
    }
  };

  const getMetaTags = (path: string): MetaTags => {
    let seoKey = 'home';
    
    if (path.startsWith('/properties')) {
      seoKey = 'properties';
    } else if (path.startsWith('/contact')) {
      seoKey = 'contact';
    } else if (path.startsWith('/news')) {
      seoKey = 'news';
    } else if (path.match(/\/property\/[^/]+$/)) {
      seoKey = 'property';
    }
    
    return {
      title: t(`seo.${seoKey}.title`),
      description: t(`seo.${seoKey}.description`),
      keywords: t(`seo.${seoKey}.keywords`)
    };
  };

  React.useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t, getMetaTags }}>
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
