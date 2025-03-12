
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

interface WhatsAppButtonProps {
  propertyName: string;
  propertyAddress: string;
  className?: string;
  fullWidth?: boolean;
}

export const WhatsAppButton = ({
  propertyName,
  propertyAddress,
  className,
  fullWidth = false
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
      className={cn(
        "flex items-center justify-center", 
        fullWidth ? "w-full" : "",
        className
      )}
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      {t('whatsapp')}
    </Button>
  );
};
