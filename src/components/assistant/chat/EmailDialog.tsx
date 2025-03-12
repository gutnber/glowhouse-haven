
import React from 'react';
import { Loader2, Mail } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmailDialogProps {
  showEmailDialog: boolean;
  setShowEmailDialog: (show: boolean) => void;
  emailValue: string;
  setEmailValue: (value: string) => void;
  isEmailSending: boolean;
  handleEmailTranscript: () => void;
}

export const EmailDialog: React.FC<EmailDialogProps> = ({
  showEmailDialog,
  setShowEmailDialog,
  emailValue,
  setEmailValue,
  isEmailSending,
  handleEmailTranscript
}) => {
  const { language } = useLanguage();
  
  return (
    <Dialog open={showEmailDialog} onOpenChange={setShowEmailDialog}>
      <DialogContent className="bg-gray-900 text-white border border-orange-500/30">
        <DialogHeader>
          <DialogTitle className="text-lg">
            {language === 'es' ? 'Enviar conversación por correo' : 'Email this conversation'}
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            {language === 'es' 
              ? 'Ingrese su correo electrónico para recibir esta conversación' 
              : 'Enter your email to receive this conversation'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Input
            type="email"
            placeholder={language === 'es' ? "Su correo electrónico" : "Your email address"}
            value={emailValue}
            onChange={(e) => setEmailValue(e.target.value)}
            className="bg-gray-800 border-orange-500/30"
          />
        </div>
        
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline"
            onClick={() => setShowEmailDialog(false)}
            className="border-gray-600 text-gray-300"
          >
            {language === 'es' ? 'Cancelar' : 'Cancel'}
          </Button>
          <Button 
            type="button"
            onClick={handleEmailTranscript}
            disabled={isEmailSending}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            {isEmailSending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                {language === 'es' ? 'Enviando...' : 'Sending...'}
              </>
            ) : (
              <><Mail className="h-4 w-4 mr-2" /> 
                {language === 'es' ? 'Enviar' : 'Send'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
