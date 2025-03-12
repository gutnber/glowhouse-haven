
import React, { useEffect, useState } from 'react';
import { useContactForm } from '@/hooks/useContactForm';
import { ContactForm } from '@/components/contact/ContactForm';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Contact() {
  const { t, language } = useLanguage();
  const contactForm = useContactForm();
  const [transcript, setTranscript] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for saved chat transcript in localStorage
    const savedTranscript = localStorage.getItem('chatTranscript');
    if (savedTranscript) {
      setTranscript(savedTranscript);
      
      // Append transcript to the message if form is available
      if (contactForm.form) {
        const currentMessage = contactForm.form.getValues('message') || '';
        const fullMessage = currentMessage + 
          (currentMessage ? '\n\n' : '') + 
          '--- Chat Transcript ---\n' + 
          savedTranscript;
        
        contactForm.form.setValue('message', fullMessage);
        
        // Remove from localStorage after using it
        localStorage.removeItem('chatTranscript');
      }
    }
  }, [contactForm.form]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 border-b border-orange-500/30 pb-2">
          {language === 'es' ? 'Contacto' : t('contactPage')}
        </h1>
        
        <div className="bg-[#883a19] rounded-xl p-6 shadow-lg">
          {language === 'es' && (
            <p className="text-white mb-6">
              ¿Tiene preguntas o desea obtener más información sobre nuestras propiedades? ¡Estamos aquí para ayudarle!
            </p>
          )}
          
          {transcript && (
            <div className="mb-4 p-4 bg-orange-900/20 rounded-lg border border-orange-600/30">
              <p className="text-white font-medium mb-2">
                {t('contact.transcriptAdded')}
              </p>
            </div>
          )}
          
          <ContactForm 
            form={contactForm.form}
            isSubmitting={contactForm.isSubmitting}
            isSuccess={contactForm.isSuccess}
            onSubmit={contactForm.handleSubmit}
            resetForm={contactForm.resetForm}
          />
        </div>
      </div>
    </div>
  );
}
