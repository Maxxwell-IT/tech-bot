
import React, { useEffect, useRef } from 'react';
import { Message } from './Message';
import { type Message as MessageType } from '../types';

interface ChatWindowProps {
  messages: MessageType[];
  isLoading: boolean;
}

const TypingIndicator: React.FC = () => (
  <div className="flex items-center space-x-2">
      <div className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-pulse delay-0"></div>
      <div className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-pulse delay-200"></div>
      <div className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-pulse delay-400"></div>
  </div>
);


export const ChatWindow: React.FC<ChatWindowProps> = ({ messages, isLoading }) => {
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {messages.map((msg, index) => (
        <Message key={index} role={msg.role} content={msg.content} />
      ))}
      {isLoading && messages[messages.length - 1]?.role === 'user' && (
        <div className="flex justify-start animate-fade-in-slide-up">
          <div className="bg-slate-700 rounded-lg p-3 max-w-lg">
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
};