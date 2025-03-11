
import * as React from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Define a nested structure for translations
type TranslationValue = string | Record<string, string | Record<string, string>>;
type TranslationsType = {
  [lang in Language]: {
    [key: string]: TranslationValue;
  }
};

const translations: TranslationsType = {
  en: {
    "mission": "Mission",
    "missionText": "Provide our clients with the peace of mind of doing business with a company that seeks the best benefit for them.",
    "vision": "Vision",
    "visionText": "Offer Real Estate services that positively impact the quality of life of our clients.",
    "services": "INMA Real Estate Solutions offers 5 services",
    "forOwners": "For owners:",
    "propertyMarketingSale": "Marketing of properties for sale.",
    "propertyMarketingRent": "Marketing of properties for rent.",
    "propertyManagementRent": "Management of rental properties.",
    "forBuyers": "For buyers:",
    "propertyOfferSale": "Property offers for Sale.",
    "propertyOfferRent": "Property offers for Rent.",
    "benefits": "Benefits",
    "personalizedAttention": "Personalized Attention",
    "personalizedAttentionText": "We manage an exclusive property inventory to which we focus sales strategies designed for each particular case.",
    "tranquility": "Peace of Mind",
    "tranquilityText": "The Client will receive information in a clear and transparent way about how the property promotion and sale process will be.",
    "documentation": "Documentation",
    "documentationText": "We review that the property documentation is in order so that the sale can be carried out without delays.",
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
    "news": "News",
    "contact": "Contact",
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
    "location": "Location",
    "contactForm": {
      "name": "Name",
      "email": "Email",
      "phone": "Phone (optional)",
      "message": "Message",
      "sending": "Sending...",
      "sendMessage": "Send Message",
      "messageSent": "Message Sent",
      "thankYou": "Thank you for your interest. We will get back to you soon.",
      "sendAnother": "Send Another Message",
      "messageSentSuccess": "Message Sent Successfully!",
      "thankYouInterest": "Thank you for your interest in",
      "getBackSoon": "We'll get back to you as soon as possible.",
      "interestedInProperty": "I'm interested in {propertyName}. Please provide more information."
    },
    "whatsapp": "Contact via WhatsApp",
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
      "dimensions": "Dimensions",
      "type": "Property Type",
      "name": "Property Name",
      "address": "Address",
      "images": "Property Images",
      "visualEffects": "Visual Effects",
      "borderBeam": "Border Beam Effect",
      "notFound": "Property not found"
    },
    "videoSettings": {
      "settings": "Video Settings",
      "url": "YouTube Video URL",
      "autoplay": "Autoplay",
      "muted": "Muted",
      "controls": "Show Controls"
    },
    "replaceImage": "Replace Image",
    "cancel": "Cancel"
  },
  es: {
    "mission": "Misión",
    "missionText": "Brindar a nuestros clientes la tranquilidad de hacer negocios con una empresa que busca el mejor beneficio para ellos.",
    "vision": "Visión",
    "visionText": "Ofrecer servicios inmobiliarios que impacten positivamente en la calidad de vida de nuestros clientes.",
    "services": "INMA Soluciones Inmobiliarias ofrece 5 servicios",
    "forOwners": "Para propietarios:",
    "propertyMarketingSale": "Comercialización de propiedades para venta.",
    "propertyMarketingRent": "Comercialización de propiedades para renta.",
    "propertyManagementRent": "Administración de propiedades en renta.",
    "forBuyers": "Para compradores:",
    "propertyOfferSale": "Oferta de propiedades para Venta.",
    "propertyOfferRent": "Oferta de propiedades para Renta.",
    "benefits": "Beneficios",
    "personalizedAttention": "Atención Personalizada",
    "personalizedAttentionText": "Manejamos un inventario exclusivo de propiedades al que enfocamos estrategias de venta diseñadas para cada caso particular.",
    "tranquility": "Tranquilidad",
    "tranquilityText": "El Cliente recibirá información de manera clara y transparente sobre cómo será el proceso de promoción y venta de la propiedad.",
    "documentation": "Documentación",
    "documentationText": "Revisamos que la documentación de la propiedad esté en orden para que la venta pueda realizarse sin demoras.",
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
    "news": "Noticias",
    "contact": "Contacto",
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
    "location": "Ubicación",
    "contactForm": {
      "name": "Nombre",
      "email": "Correo Electrónico",
      "phone": "Teléfono (opcional)",
      "message": "Mensaje",
      "sending": "Enviando...",
      "sendMessage": "Enviar Mensaje",
      "messageSent": "Mensaje Enviado",
      "thankYou": "Gracias por su interés. Nos pondremos en contacto pronto.",
      "sendAnother": "Enviar Otro Mensaje",
      "messageSentSuccess": "¡Mensaje Enviado Exitosamente!",
      "thankYouInterest": "Gracias por su interés en",
      "getBackSoon": "Nos pondremos en contacto lo antes posible.",
      "interestedInProperty": "Estoy interesado/a en {propertyName}. Por favor, proporcione más información."
    },
    "whatsapp": "Contactar por WhatsApp",
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
      "dimensions": "Dimensiones",
      "type": "Tipo de Propiedad",
      "name": "Nombre de la Propiedad",
      "address": "Dirección",
      "images": "Imágenes",
      "visualEffects": "Efectos Visuales",
      "borderBeam": "Efecto de borde animado en las tarjetas de propiedad",
      "notFound": "Propiedad no encontrada"
    },
    "videoSettings": {
      "settings": "Configuración de Video",
      "url": "URL de Video de YouTube",
      "autoplay": "Reproducir automáticamente",
      "muted": "Silenciado",
      "controls": "Mostrar controles"
    },
    "replaceImage": "Reemplazar Imagen",
    "cancel": "Cancelar"
  }
};

const LanguageContext = React.createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = React.useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferred-language');
    return (savedLanguage === 'en' || savedLanguage === 'es') ? savedLanguage : 'es';
  });

  const handleSetLanguage = (newLang: Language) => {
    setLanguage(newLang);
    localStorage.setItem('preferred-language', newLang);
  };

  const t = (key: string): string => {
    // Handle nested keys like 'property.details'
    const parts = key.split('.');
    if (parts.length === 1) {
      const value = translations[language][key];
      return typeof value === 'string' ? value : key;
    } else {
      let currentObj: any = translations[language];
      
      // Navigate through the nested structure
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (currentObj && typeof currentObj === 'object' && part in currentObj) {
          currentObj = currentObj[part];
        } else {
          return key; // Key path not found
        }
      }
      
      return typeof currentObj === 'string' ? currentObj : key;
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
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
