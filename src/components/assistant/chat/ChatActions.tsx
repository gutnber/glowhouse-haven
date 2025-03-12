
import React from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatActionsProps {
  handleOpenEmailDialog: () => void;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  handleOpenEmailDialog
}) => {
  const { language, t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center p-2 bg-gray-800 border-t border-gray-700">
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleOpenEmailDialog}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Mail className="h-4 w-4 mr-1" />
          {language === 'es' ? 'Enviar a tu Email' : 'Email to me'}
        </Button>
      </div>
    </div>
  );
};
