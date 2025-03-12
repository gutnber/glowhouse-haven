
import React, { useState, useRef, useEffect } from 'react';
import { useChatAssistant } from '@/contexts/ChatAssistantContext';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { WhatsAppButton } from '@/components/property/contact-form/WhatsAppButton';

export const ChatBubble = () => {
  const { t, language } = useLanguage();
  const { isOpen, messages, isLoading, toggleChat, sendMessage } = useChatAssistant();
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
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

  // Format message content with support for newlines and contact buttons
  const formatMessage = (content: string) => {
    // Check if message suggests contacting
    const hasContactSuggestion = content.toLowerCase().includes('contact') || 
                                content.toLowerCase().includes('contactar') ||
                                content.toLowerCase().includes('contacto') ||
                                content.toLowerCase().includes('whatsapp');
    
    // Split content by newlines and render as paragraphs
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
            />
            <Button 
              variant="secondary" 
              className="w-full"
              onClick={() => {
                window.location.href = "/contact";
              }}
            >
              {language === 'es' ? 'Formulario de contacto' : 'Contact form'}
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end">
      {/* Chat panel */}
      {isOpen && (
        <div className="mb-3 w-full max-w-[380px] flex flex-col bg-gradient-to-r from-gray-900 to-black border border-orange-500/30 rounded-xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-orange-800 to-orange-900 p-3">
            <h3 className="text-white font-medium">
              {language === 'es' ? 'Asistente Inmobiliario INMA' : 'INMA Real Estate Assistant'}
            </h3>
            <button 
              onClick={toggleChat}
              className="text-gray-200 hover:text-white"
              aria-label="Close chat"
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-3 overflow-y-auto max-h-[350px] min-h-[250px] bg-gray-800/30">
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
                  <div className="max-w-[80%] p-3 rounded-lg bg-gray-700 text-white">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>
          
          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 bg-gray-900 border-t border-orange-500/30">
            <div className="flex items-center gap-2">
              <input
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
                variant="secondary"
                size="icon"
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </form>
        </div>
      )}
      
      {/* Chat toggle button */}
      <button
        onClick={toggleChat}
        className={`rounded-full p-3.5 shadow-lg transition-all duration-300 ${
          isOpen 
            ? 'bg-orange-600 text-white rotate-0' 
            : 'bg-gradient-to-r from-orange-600 to-orange-800 text-white hover:bg-orange-800 animate-pulse'
        }`}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        <MessageCircle className={`h-6 w-6 ${isOpen ? 'rotate-0' : 'rotate-0'}`} />
      </button>
    </div>
  );
};
