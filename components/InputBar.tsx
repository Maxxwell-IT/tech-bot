import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from './icons/SendIcon';

interface InputBarProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

export const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div className="bg-dark-800 p-4 border-t border-dark-600">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4 max-w-4xl mx-auto">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Введіть ваше запитання..."
          disabled={isLoading}
          className="flex-1 bg-dark-700 border border-dark-600 rounded-lg py-3 px-4 text-slate-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-none max-h-40 overflow-y-auto"
          rows={1}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="bg-brand-primary text-dark-900 p-3 rounded-lg disabled:bg-dark-600 disabled:cursor-not-allowed hover:bg-brand-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-800 focus:ring-brand-primary"
        >
          <SendIcon className="w-6 h-6"/>
        </button>
      </form>
    </div>
  );
};
