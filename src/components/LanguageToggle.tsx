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
        className="w-8 h-8 relative group"
        title="English"
      >
        {/* USA Flag styling */}
        <Flag className="h-4 w-4">
          <div className="absolute inset-0 bg-blue-600" />
          <div className="absolute inset-[15%] bg-white flex items-center justify-center">
            <div className="text-[8px] text-blue-600 font-bold">USA</div>
          </div>
        </Flag>
      </Button>
      <Button
        variant={language === 'es' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setLanguage('es')}
        className="w-8 h-8 relative group"
        title="Español"
      >
        {/* Mexican Flag styling */}
        <Flag className="h-4 w-4">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-white to-red-600" />
          <div className="absolute inset-[30%] flex items-center justify-center">
            <div className="text-[6px] text-brown-800 font-bold">MX</div>
          </div>
        </Flag>
      </Button>
    </div>
  );
};