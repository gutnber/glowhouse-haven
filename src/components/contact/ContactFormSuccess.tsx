
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ContactFormSuccessProps {
  onReset: () => void;
}

export const ContactFormSuccess = ({ onReset }: ContactFormSuccessProps) => {
  const { t, language } = useLanguage();
  
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-white">
        {language === 'es' ? '¡Gracias por tu mensaje!' : t('contact.success')}
      </h3>
      <p className="text-gray-200">
        {language === 'es' 
          ? 'Hemos recibido tu mensaje y te responderemos lo antes posible.' 
          : t('contact.successMessage')}
      </p>
      <Button 
        onClick={onReset} 
        variant="outline"
        className="mt-4 border-orange-500/50 text-white hover:bg-orange-500/20"
      >
        {language === 'es' ? 'Enviar Otro Mensaje' : t('contact.sendAnother')}
      </Button>
    </div>
  );
};
