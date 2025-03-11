
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface WhatsAppButtonProps {
  propertyName: string;
  propertyAddress: string;
}

export const WhatsAppButton = ({
  propertyName,
  propertyAddress
}: WhatsAppButtonProps) => {
  const { t } = useLanguage();
  
  const handleWhatsAppClick = () => {
    const message = `Hi! I'm interested in the property: ${propertyName} at ${propertyAddress}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/526461961667?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };
  
  return (
    <Button 
      onClick={handleWhatsAppClick} 
      variant="secondary"
      className="w-full flex items-center justify-center"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      {t('whatsapp')}
    </Button>
  );
};
