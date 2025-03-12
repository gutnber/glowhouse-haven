
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface ContactFormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
    message: string;
  };
  isSubmitting: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const ContactFormFields = ({ formData, isSubmitting, onChange }: ContactFormFieldsProps) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-white font-medium">
          {language === 'es' ? 'Nombre' : t('contact.name')} *
        </label>
        <input
          id="name"
          name="name"
          value={formData.name}
          onChange={onChange}
          required
          className="mt-1 w-full rounded-md bg-orange-900/30 border border-orange-500/50 p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-white font-medium">
          {language === 'es' ? 'Correo Electrónico' : t('contact.email')} *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          required
          className="mt-1 w-full rounded-md bg-orange-900/30 border border-orange-500/50 p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-white font-medium">
          {language === 'es' ? 'Teléfono (opcional)' : t('contact.phone')}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          className="mt-1 w-full rounded-md bg-orange-900/30 border border-orange-500/50 p-2 text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-white font-medium">
          {language === 'es' ? 'Mensaje' : t('contact.message')} *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={onChange}
          required
          className="mt-1 w-full rounded-md bg-orange-900/30 border border-orange-500/50 p-2 text-white h-32 focus:outline-none focus:ring-2 focus:ring-orange-500"
          disabled={isSubmitting}
        />
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting} 
        className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-md"
      >
        {isSubmitting ? 
          (language === 'es' ? 'Enviando...' : t('contact.sending')) : 
          (language === 'es' ? 'Enviar Mensaje' : t('contact.send'))
        }
      </button>
    </div>
  );
};
