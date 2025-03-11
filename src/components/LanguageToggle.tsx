
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
        className="w-8 h-8 relative group overflow-hidden rounded-full"
        title="English"
      >
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* USA Flag */}
          <div className="absolute inset-0 bg-red-600" />
          <div className="absolute inset-y-0 left-0 right-0 flex flex-col justify-between py-[2px]">
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-white" />
            <div className="h-[2px] bg-white" />
          </div>
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-700">
            <div className="absolute inset-1 flex items-center justify-center">
              <div className="text-[6px] text-white font-bold">★</div>
            </div>
          </div>
        </div>
      </Button>
      <Button
        variant={language === 'es' ? 'default' : 'outline'}
        size="icon"
        onClick={() => setLanguage('es')}
        className="w-8 h-8 relative group overflow-hidden rounded-full"
        title="Español"
      >
        <div className="absolute inset-0 overflow-hidden rounded-full">
          {/* Mexican Flag */}
          <div className="absolute inset-0 flex">
            <div className="w-1/3 bg-green-600" />
            <div className="w-1/3 bg-white flex items-center justify-center">
              <div className="w-4 h-4 flex items-center justify-center">
                <div className="text-[8px] text-brown-800">🦅</div>
              </div>
            </div>
            <div className="w-1/3 bg-red-600" />
          </div>
        </div>
      </Button>
    </div>
  );
};
