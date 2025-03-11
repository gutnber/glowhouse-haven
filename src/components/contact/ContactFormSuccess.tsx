
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactFormSuccessProps {
  onReset: () => void;
}

export const ContactFormSuccess = ({ onReset }: ContactFormSuccessProps) => {
  const { language } = useLanguage();

  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-white">
        {language === 'es' ? 'Mensaje Enviado Exitosamente!' : 'Message Sent Successfully!'}
      </h3>
      <p className="text-orange-200">
        {language === 'es' 
          ? 'Gracias por contactarnos. Nos pondremos en contacto con usted lo antes posible.'
          : 'Thank you for contacting us. We will get back to you as soon as possible.'}
      </p>
      <Button 
        onClick={onReset} 
        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white"
      >
        {language === 'es' ? 'Enviar otro mensaje' : 'Send another message'}
      </Button>
    </div>
  );
};
