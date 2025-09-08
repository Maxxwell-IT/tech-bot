
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SendIcon } from '../components/icons/SendIcon';

interface PlaceholderPageProps {
  title: string;
  message: string;
  prompt: string;
}

export const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, message, prompt }) => {
    const navigate = useNavigate();

    const handleAskQuestion = () => {
        navigate('/chat', { state: { initialMessage: prompt } });
    }

    return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in-slide-up">
            <h1 className="text-4xl font-bold text-slate-200 mb-4">{title}</h1>
            <p className="text-lg text-dark-500 max-w-2xl mb-8">{message}</p>
            <button
                onClick={handleAskQuestion}
                className="inline-flex items-center gap-3 bg-brand-primary text-dark-900 font-bold py-3 px-6 rounded-lg hover:bg-brand-primary-hover transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 focus:ring-brand-primary"
            >
                <SendIcon className="w-5 h-5" />
                <span>Запитати у Тех-Бота</span>
            </button>
        </div>
    );
};
