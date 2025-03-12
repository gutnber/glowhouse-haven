
import React from 'react';
import { X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { MessageList } from './MessageList';
import { ChatActions } from './ChatActions';
import { ChatInput } from './ChatInput';
import { Message } from '../types';

interface ChatDialogProps {
  messages: Message[];
  isLoading: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  closeChat: () => void;
  handleOpenEmailDialog: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ChatDialog: React.FC<ChatDialogProps> = ({
  messages,
  isLoading,
  inputValue,
  setInputValue,
  handleSubmit,
  closeChat,
  handleOpenEmailDialog,
  messagesEndRef,
  inputRef
}) => {
  const { language } = useLanguage();

  return (
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
        <MessageList 
          messages={messages} 
          isLoading={isLoading} 
          messagesEndRef={messagesEndRef} 
        />
      </div>
      
      {messages.length > 1 && (
        <ChatActions 
          handleOpenEmailDialog={handleOpenEmailDialog}
        />
      )}
      
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        inputRef={inputRef}
      />
    </div>
  );
};
