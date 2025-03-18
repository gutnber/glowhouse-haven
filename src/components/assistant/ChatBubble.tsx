
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
      const transcript = messages.map(msg => 
        `${msg.role === 'user' ? 'You' : 'Assistant'}: ${msg.content}`
      ).join('\n\n');
      
      console.log('Sending transcript to email:', emailValue);
      
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

      if (error) {
        console.error('Error inserting contact submission:', error);
        throw error;
      }

      // Add to newsletter subscribers
      await supabase
        .from('newsletter_subscribers')
        .upsert(
          { email: emailValue },
          { onConflict: 'email', ignoreDuplicates: true }
        );
      
      // Call the edge function to send the email
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-contact-email', {
        body: { record: data }
      });

      if (emailError) {
        console.error('Email service error:', emailError);
        throw new Error(emailError.message || 'Failed to send email');
      }
      
      console.log('Email function response:', emailData);
      
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
      
      // Show more specific error message
      const errorMessage = error.message || (language === 'es' 
        ? 'No se pudo enviar el correo electrónico' 
        : 'Failed to send the email');
      
      toast({
        title: language === 'es' ? 'Error' : 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
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
