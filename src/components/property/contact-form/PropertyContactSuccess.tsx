
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface PropertyContactSuccessProps {
  propertyName: string;
  onSendAnother: () => void;
}

export const PropertyContactSuccess = ({ 
  propertyName, 
  onSendAnother 
}: PropertyContactSuccessProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-8 space-y-4">
      <div className="flex justify-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
      </div>
      <h3 className="text-xl font-bold text-white">{t('contactForm.messageSentSuccess')}</h3>
      <p className="text-gray-300">
        {t('contactForm.thankYouInterest')} {propertyName}.
        <br />
        {t('contactForm.getBackSoon')}
      </p>
      <Button 
        onClick={onSendAnother} 
        variant="outline"
        className="mt-4 border-orange-500/50 text-white hover:bg-orange-500/20"
      >
        {t('contactForm.sendAnother')}
      </Button>
    </div>
  );
};
