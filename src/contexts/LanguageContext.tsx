
import * as React from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Define a nested structure for translations
type TranslationValue = string | Record<string, string>;
type TranslationsType = {
  [lang in Language]: {
    [key: string]: TranslationValue;
  }
};

const translations: TranslationsType = {
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
    "commercial": "Commercial",
    "propertyMode": "Property Mode",
    "propertyStatus": "Status",
    "forSale": "For Sale",
    "forRent": "For Rent",
    "available": "Available",
    "pending": "Pending",
    "sold": "Sold",
    "cabin": "Cabin",
    "ranch": "Ranch",
    "property": {
      "details": "Property Details",
      "edit": "Edit Property",
      "bedrooms": "Bedrooms",
      "bathrooms": "Bathrooms",
      "yearBuilt": "Year Built",
      "area": "Total Area",
      "heatedArea": "Heated Area",
      "price": "Price",
      "pricePerSqm": "Price per m²",
      "arvLabel": "After Repair Value",
      "referenceNumber": "Reference Number",
      "description": "Description",
      "features": "Features",
      "video": "Property Video",
      "contactUs": "Contact Us About This Property",
      "dimensions": "Dimensions"
    }
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
    "commercial": "Comercial",
    "propertyMode": "Modo de Propiedad",
    "propertyStatus": "Estado",
    "forSale": "En Venta",
    "forRent": "En Alquiler",
    "available": "Disponible",
    "pending": "Pendiente",
    "sold": "Vendido",
    "cabin": "Cabaña",
    "ranch": "Rancho",
    "property": {
      "details": "Detalles de la Propiedad",
      "edit": "Editar Propiedad",
      "bedrooms": "Dormitorios",
      "bathrooms": "Baños",
      "yearBuilt": "Año de Construcción",
      "area": "Área Total",
      "heatedArea": "Área Calefaccionada",
      "price": "Precio",
      "pricePerSqm": "Precio por m²",
      "arvLabel": "Valor Después de Reparación",
      "referenceNumber": "Número de Referencia",
      "description": "Descripción",
      "features": "Características",
      "video": "Video de la Propiedad",
      "contactUs": "Contáctenos Sobre Esta Propiedad",
      "dimensions": "Dimensiones"
    }
  }
};

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>('en');

  const t = (key: string): string => {
    // Handle nested keys like 'property.details'
    const parts = key.split('.');
    if (parts.length === 1) {
      const value = translations[language][key];
      return typeof value === 'string' ? value : key;
    } else {
      const [category, subKey] = parts;
      const categoryObj = translations[language][category];
      if (categoryObj && typeof categoryObj === 'object' && !Array.isArray(categoryObj)) {
        const value = (categoryObj as Record<string, string>)[subKey];
        return value || key;
      }
      return key;
    }
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
