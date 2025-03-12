
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from './LanguageContext';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface ChatAssistantContextType {
  isOpen: boolean;
  messages: Message[];
  isLoading: boolean;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  closeChat: () => void;
}

const ChatAssistantContext = createContext<ChatAssistantContextType | undefined>(undefined);

export const useChatAssistant = () => {
  const context = useContext(ChatAssistantContext);
  if (!context) {
    throw new Error('useChatAssistant must be used within a ChatAssistantProvider');
  }
  return context;
};

interface ChatAssistantProviderProps {
  children: ReactNode;
}

export const ChatAssistantProvider = ({ children }: ChatAssistantProviderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const { language } = useLanguage();
  
  // Check if current route is a property page
  const propertyId = location.pathname.match(/\/properties\/([a-zA-Z0-9-]+)/)?.[1];
  
  // Fetch properties data for context
  const { data: properties } = useQuery({
    queryKey: ['properties-for-assistant'],
    queryFn: async () => {
      const { data } = await supabase
        .from('properties')
        .select('id, name, price, currency, address, property_type, bedrooms, bathrooms, area')
        .limit(10);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  
  // Fetch current property if on property page
  const { data: currentProperty } = useQuery({
    queryKey: ['property-for-assistant', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      const { data } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();
      return data;
    },
    enabled: !!propertyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Add initial welcome message
  useEffect(() => {
    const welcomeMessage = language === 'es' 
      ? '👋 ¡Hola! Soy tu asistente inmobiliario virtual. ¿En qué puedo ayudarte hoy con propiedades en Baja California?'
      : '👋 Hello! I\'m your virtual real estate assistant. How can I help you today with properties in Baja California?';
    
    setMessages([{
      id: 'welcome',
      role: 'assistant',
      content: welcomeMessage,
      timestamp: new Date()
    }]);
  }, [language]);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };
  
  const closeChat = () => {
    setIsOpen(false);
  };

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    
    try {
      // Convert messages to format expected by API
      const formattedMessages = messages
        .filter(m => m.id !== 'welcome') // Skip welcome message
        .concat(userMessage)
        .map(m => ({
          role: m.role,
          content: m.content
        }));
      
      // Get response from edge function
      const { data, error } = await supabase.functions.invoke("real-estate-assistant", {
        body: { 
          messages: formattedMessages,
          propertyData: properties,
          currentProperty: propertyId 
        }
      });
      
      if (error) throw error;
      
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message to assistant:', error);
      
      // Add error message
      const errorMessage = language === 'es'
        ? 'Lo siento, tuve un problema para responder. Por favor, intenta de nuevo o contacta directamente con un agente.'
        : 'Sorry, I had trouble responding. Please try again or contact an agent directly.';
        
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatAssistantContext.Provider 
      value={{ 
        isOpen, 
        messages, 
        isLoading, 
        toggleChat, 
        sendMessage,
        closeChat
      }}
    >
      {children}
    </ChatAssistantContext.Provider>
  );
};
