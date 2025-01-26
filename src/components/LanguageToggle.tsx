import { Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex gap-2">
      <Button
        variant={language === 'en' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setLanguage('en')}
        className="w-8 h-8"
      >
        <Flag className="h-4 w-4 text-blue-500" />
      </Button>
      <Button
        variant={language === 'es' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setLanguage('es')}
        className="w-8 h-8"
      >
        <Flag className="h-4 w-4 text-green-500" />
      </Button>
    </div>
  );
};