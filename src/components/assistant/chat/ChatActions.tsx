
import React from 'react';
import { Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatActionsProps {
  handleSendTranscript: () => void;
  handleOpenEmailDialog: () => void;
  handleDownloadTranscript: () => void;
}

export const ChatActions: React.FC<ChatActionsProps> = ({
  handleSendTranscript,
  handleOpenEmailDialog,
  handleDownloadTranscript
}) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex justify-between items-center p-2 bg-gray-800 border-t border-gray-700">
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleSendTranscript}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Mail className="h-4 w-4 mr-1" />
          {t('chat.save')}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleOpenEmailDialog}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Mail className="h-4 w-4 mr-1" />
          {t('chat.email')}
        </Button>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleDownloadTranscript}
          className="text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <Download className="h-4 w-4 mr-1" />
          {t('chat.download')}
        </Button>
      </div>
    </div>
  );
};
