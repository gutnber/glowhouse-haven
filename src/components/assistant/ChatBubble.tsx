import React, { useState, useRef, useEffect } from 'react';
import { useChatAssistant } from '@/contexts/ChatAssistantContext';
import { MessageCircle, X, Send, Loader2, Mail, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { WhatsAppButton } from '@/components/property/contact-form/WhatsAppButton';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

export const ChatBubble = () => {
  const { t, language } = useLanguage();
  const { isOpen, messages, isLoading, toggleChat, sendMessage, closeChat } = useChatAssistant();
  const [inputValue, setInputValue] = useState('');
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [isEmailSending, setIsEmailSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleSendTranscript = async () => {
    try {
      const transcript = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      localStorage.setItem('chatTranscript', transcript);
      
      navigate('/contact');
      
      closeChat();
      
      toast({
        title: language === 'es' ? 'Conversación guardada' : 'Conversation saved',
        description: language === 'es' 
          ? 'Puedes continuar la conversación en la página de contacto' 
          : 'You can continue this conversation on the contact page',
        duration: 5000,
      });
    } catch (error) {
      console.error('Error saving transcript:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'No se pudo guardar la conversación' 
          : 'Failed to save the conversation',
        variant: 'destructive',
      });
    }
  };

  const handleOpenEmailDialog = () => {
    setShowEmailDialog(true);
  };

  const handleEmailTranscript = async () => {
    if (!emailValue || !/\S+@\S+\.\S+/.test(emailValue)) {
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'Por favor ingrese un correo electrónico válido' 
          : 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setIsEmailSending(true);

    try {
      const transcript = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([{
          name: language === 'es' ? 'Usuario del chat' : 'Chat User',
          email: emailValue,
          message: `--- Chat Transcript ---\n${transcript}`,
          status: 'new'
        }])
        .select()
        .single();

      if (error) throw error;

      await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email: emailValue },
          { onConflict: 'email', ignoreDuplicates: true }
        );
      
      const { error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: { record: data }
      });

      if (emailError) throw emailError;
      
      setShowEmailDialog(false);
      setEmailValue('');
      
      toast({
        title: language === 'es' ? 'Correo enviado' : 'Email sent',
        description: language === 'es' 
          ? 'La conversación ha sido enviada a su correo electrónico' 
          : 'The conversation has been sent to your email',
      });
    } catch (error) {
      console.error('Error emailing transcript:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'No se pudo enviar el correo electrónico' 
          : 'Failed to send the email',
        variant: 'destructive',
      });
    } finally {
      setIsEmailSending(false);
    }
  };

  const handleDownloadTranscript = () => {
    try {
      const title = language === 'es' ? 'Conversación con Asistente INMA' : 'Conversation with INMA Assistant';
      const date = new Date().toLocaleString();
      const header = `${title}\n${date}\n\n`;
      
      const transcript = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      const fullTranscript = header + transcript;
      
      const element = document.createElement('a');
      const file = new Blob([fullTranscript], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = 'INMA-chat-transcript.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      
      toast({
        title: language === 'es' ? 'Descarga completada' : 'Download complete',
        description: language === 'es' 
          ? 'La conversación se ha descargado como archivo de texto' 
          : 'The conversation has been downloaded as a text file',
      });
    } catch (error) {
      console.error('Error downloading transcript:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'No se pudo descargar la conversación' 
          : 'Failed to download the conversation',
        variant: 'destructive',
      });
    }
  };

  const formatMessage = (content: string) => {
    const hasContactSuggestion = content.toLowerCase().includes('contact') || 
                                content.toLowerCase().includes('contactar') ||
                                content.toLowerCase().includes('contacto') ||
                                content.toLowerCase().includes('whatsapp');
    
    const paragraphs = content.split('\n').filter(p => p.trim());
    
    return (
      <>
        {paragraphs.map((paragraph, i) => (
          <p key={i} className={i < paragraphs.length - 1 ? 'mb-2' : ''}>
            {paragraph}
          </p>
        ))}
        
        {hasContactSuggestion && (
          <div className="mt-3 flex flex-col sm:flex-row gap-2">
            <WhatsAppButton 
              propertyName={language === 'es' ? "Consulta general" : "General inquiry"}
              propertyAddress={language === 'es' ? "No especificada" : "Not specified"}
              className="bg-green-600 hover:bg-green-700 text-white"
              fullWidth
            />
            <Button 
              variant="default" 
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => {
                window.location.href = "/contact";
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              {language === 'es' ? 'Formulario de contacto' : 'Contact form'}
            </Button>
          </div>
        )}
      </>
    );
  };

  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center p-3">
      <svg 
        className="w-16 h-16 mb-2" 
        viewBox="0 0 123.35 119.06" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="101.3" cy="108.27" r="5.51" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '0s' }}
        />
        <circle 
          cx="106.2" cy="90.34" r="7.9" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '0.4s' }}
        />
        <circle 
          cx="103.53" cy="67.78" r="8.68" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '0.8s' }}
        />
        <circle 
          cx="94.9" cy="44.15" r="11.33" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '1.2s' }}
        />
        <circle 
          cx="67.36" cy="28.19" r="13.66" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '1.6s' }}
        />
        <circle 
          cx="27.85" cy="24.55" r="17.65" 
          className="animate-[circle-fill_2.4s_ease-in-out_infinite] fill-current text-gray-300"
          style={{ animationDelay: '2.0s' }}
        />
      </svg>
      <p className="text-sm text-white font-medium">Por favor, espera...</p>
    </div>
  );

  const EmailDialog = () => (
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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <EmailDialog />
      
      {isOpen && (
        <div className="mb-3 w-full max-w-[380px] flex flex-col bg-gray-900 border border-orange-500/30 rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-800 to-orange-900 p-3">
            <h3 className="text-white font-medium">
              {language === 'es' ? 'Asistente Inmobiliario INMA' : 'INMA Real Estate Assistant'}
            </h3>
            <button 
              onClick={closeChat}
              className="text-gray-200 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
          
          <div className="flex-1 p-3 overflow-y-auto max-h-[350px] min-h-[250px] bg-gray-800/50">
            <div className="space-y-3">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === 'user' 
                        ? 'bg-orange-600 text-white' 
                        : 'bg-gray-700 text-white'
                    }`}
                  >
                    {formatMessage(message.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg bg-gray-700 text-white">
                    <LoadingAnimation />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {messages.length > 1 && (
            <div className="flex justify-between items-center p-2 bg-gray-800 border-t border-gray-700">
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSendTranscript}
                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  {language === 'es' ? 'Guardar' : 'Save'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleOpenEmailDialog}
                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <Mail className="h-4 w-4 mr-1" />
                  {language === 'es' ? 'Enviar por correo' : 'Email'}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleDownloadTranscript}
                  className="text-gray-300 hover:text-white hover:bg-gray-700"
                >
                  <Download className="h-4 w-4 mr-1" />
                  {language === 'es' ? 'Descargar' : 'Download'}
                </Button>
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-3 bg-gray-900 border-t border-orange-500/30">
            <div className="flex items-center gap-2">
              <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={language === 'es' ? "Escribe tu pregunta..." : "Type your question..."}
                className="flex-1 py-2 px-3 rounded-md bg-gray-800 text-white placeholder-gray-400 border border-orange-500/30 focus:outline-none focus:ring-2 focus:ring-orange-500"
                disabled={isLoading}
              />
              <Button 
                type="submit" 
                disabled={isLoading || !inputValue.trim()} 
                variant="default"
                size="icon"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      <button
        onClick={toggleChat}
        className={`rounded-full p-3.5 shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-orange-600 text-white rotate-0' 
            : 'bg-gradient-to-r from-orange-600 to-orange-800 text-white hover:bg-orange-800'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle className="h-6 w-6" />
      </button>
    </div>
  );
};
