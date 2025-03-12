
import React, { useState, useRef, useEffect } from 'react';
import { useChatAssistant } from '@/contexts/ChatAssistantContext';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { ChatDialog } from './chat/ChatDialog';
import { EmailDialog } from './chat/EmailDialog';

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

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      <EmailDialog
        showEmailDialog={showEmailDialog}
        setShowEmailDialog={setShowEmailDialog}
        emailValue={emailValue}
        setEmailValue={setEmailValue}
        isEmailSending={isEmailSending}
        handleEmailTranscript={handleEmailTranscript}
      />
      
      {isOpen && (
        <ChatDialog
          messages={messages}
          isLoading={isLoading}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          closeChat={closeChat}
          handleSendTranscript={handleSendTranscript}
          handleOpenEmailDialog={handleOpenEmailDialog}
          handleDownloadTranscript={handleDownloadTranscript}
          messagesEndRef={messagesEndRef}
          inputRef={inputRef}
        />
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
