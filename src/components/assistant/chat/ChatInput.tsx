
import React from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  inputRef: React.RefObject<HTMLInputElement>;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  inputValue,
  setInputValue,
  handleSubmit,
  isLoading,
  inputRef
}) => {
  const { language } = useLanguage();
  
  return (
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
  );
};
