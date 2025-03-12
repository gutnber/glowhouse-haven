
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactFormSuccessProps {
  onReset: () => void;
}

export const ContactFormSuccess = ({ onReset }: ContactFormSuccessProps) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-16 w-16 text-green-500">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>
      <h3 className="text-xl font-bold text-white">{language === 'es' ? '¡Gracias por tu mensaje!' : t('contact.success')}</h3>
      <p className="text-gray-200">
        {language === 'es' 
          ? 'Hemos recibido tu mensaje y te responderemos lo antes posible.' 
          : t('contact.successMessage')}
      </p>
      <button 
        onClick={onReset} 
        className="mt-4 border border-orange-500/50 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-md"
      >
        {language === 'es' ? 'Enviar Otro Mensaje' : t('contact.sendAnother')}
      </button>
    </div>
  );
};
