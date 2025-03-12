
import React from 'react';
import { MessageBubble } from './MessageBubble';
import { LoadingAnimation } from './LoadingAnimation';
import { Message } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading, messagesEndRef }) => {
  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
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
  );
};
