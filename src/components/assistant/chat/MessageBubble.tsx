
import React from 'react';
import { Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { WhatsAppButton } from '@/components/property/contact-form/WhatsAppButton';
import { Message } from '../types';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const { language } = useLanguage();
  
  const formatMessage = (content: string) => {
    const hasContactSuggestion = content.toLowerCase().includes('contact') || 
                                content.toLowerCase().includes('contactar') ||
                                content.toLowerCase().includes('contacto') ||
                                content.toLowerCase().includes('whatsapp');
    
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return (
      <>
        {paragraphs.map((paragraph, i) => (
          <p key={i} className={i < paragraphs.length - 1 ? 'mb-2' : ''}>
            {paragraph}
          </p>
        ))}
        
        {hasContactSuggestion && (
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <WhatsAppButton 
              propertyName={language === 'es' ? "Consulta general" : "General inquiry"}
              propertyAddress={language === 'es' ? "No especificada" : "Not specified"}
              className="bg-green-600 hover:bg-green-700 text-white"
              fullWidth
            />
            <Button 
              variant="default" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                window.location.href = "/contact";
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              {language === 'es' ? 'Formulario de contacto' : 'Contact form'}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[80%] p-3 rounded-lg ${
          message.role === 'user' 
            ? 'bg-orange-600 text-white' 
            : 'bg-gray-700 text-white'
        }`}
      >
        {formatMessage(message.content)}
      </div>
    </div>
  );
};
