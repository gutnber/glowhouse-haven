
import React, { useState, useRef, useEffect } from 'react';
import { useChatAssistant } from '@/contexts/ChatAssistantContext';
import { MessageCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
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
      // Instead of trying to insert directly, save transcript to localStorage
      const transcript = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      // Store the transcript in localStorage
      localStorage.setItem('chatTranscript', transcript);
      
      // Redirect to contact page
      window.location.href = '/contact';
      
      // Close the dialog
      setShowEmailDialog(false);
      setEmailValue('');
      
      toast({
        title: language === 'es' ? 'Redirigiendo' : 'Redirecting',
        description: language === 'es' 
          ? 'Complete el formulario de contacto para recibir la transcripción' 
          : 'Please complete the contact form to receive the transcript',
      });
    } catch (error) {
      console.error('Error preparing transcript:', error);
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: language === 'es' 
          ? 'No se pudo preparar la transcripción' 
          : 'Failed to prepare the transcript',
        variant: 'destructive',
      });
      setIsEmailSending(false);
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
          handleOpenEmailDialog={handleOpenEmailDialog}
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
