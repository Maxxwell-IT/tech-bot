
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { type Chat } from "@google/genai";
import { ChatWindow } from '../components/ChatWindow';
import { InputBar } from '../components/InputBar';
import { ExportChatIcon } from '../components/icons/ExportChatIcon';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { initChat } from '../services/geminiService';
import { type Message } from '../types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export const ChatPage: React.FC = () => {
    const [chat, setChat] = useState<Chat | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isExporting, setIsExporting] = useState<boolean>(false);
    const chatWindowRef = useRef<HTMLDivElement>(null);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSendMessage = useCallback(async (text: string) => {
        if (!chat || isLoading || !text.trim()) return;

        const userMessage: Message = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const stream = await chat.sendMessageStream({ message: text });
            let modelResponse = '';
            setMessages(prev => [...prev, { role: 'model', content: '' }]);

            for await (const chunk of stream) {
                modelResponse += chunk.text;
                setMessages(prev => {
                    const newMessages = [...prev];
                    newMessages[newMessages.length - 1] = { role: 'model', content: modelResponse };
                    return newMessages;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
            const errorMessage: Message = { role: 'model', content: "На жаль, сталася помилка. Будь ласка, спробуйте ще раз." };
            setMessages(prev => {
                const newMessages = [...prev];
                if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === 'model' && newMessages[newMessages.length - 1].content === '') {
                    newMessages[newMessages.length - 1] = errorMessage;
                } else {
                    newMessages.push(errorMessage);
                }
                return newMessages;
            });
        } finally {
            setIsLoading(false);
        }
    }, [chat, isLoading]);

    const initialize = useCallback(async () => {
        try {
            const chatInstance = await initChat();
            setChat(chatInstance);
            setMessages([
                {
                    role: 'model',
                    content: "Вітаю! Я ваш 'тех-бот'. Я тут, щоб допомогти вам з документацією, інструкціями, списками устаткування та вирішенням типових проблем. Чим я можу вам допомогти сьогодні?",
                },
            ]);
        } catch (error) {
            console.error("Initialization error:", error);
            setMessages([
                {
                    role: 'model',
                    content: "Виникла помилка під час ініціалізації. Будь ласка, перевірте налаштування API ключа та оновіть сторінку.",
                },
            ]);
        }
    }, []);

    useEffect(() => {
        initialize();
    }, [initialize]);

    useEffect(() => {
        if (location.state?.initialMessage && chat) {
            const { initialMessage } = location.state;
            handleSendMessage(initialMessage);
            // Clear the state to prevent re-sending on re-render
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, chat, handleSendMessage, navigate]);
    
    const handleExportChat = async () => {
        if (!chatWindowRef.current || messages.length <= 1) {
            return;
        }
        setIsExporting(true);
        try {
            const element = chatWindowRef.current;
            const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#2c2c24', scrollY: -window.scrollY, height: element.scrollHeight, windowHeight: element.scrollHeight });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'pt', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasHeight / canvasWidth;
            const imgHeight = pdfWidth * ratio;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;
            }
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            pdf.save(`tech-bot-chat-history-${timestamp}.pdf`);
        } catch (error) {
            console.error("Error exporting chat to PDF:", error);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-dark-700 flex justify-end">
                 <button 
                    onClick={handleExportChat} 
                    disabled={isExporting || isLoading || messages.length <= 1}
                    className="p-2 rounded-md hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-label="Export chat history as PDF"
                    title="Export chat history as PDF"
                >
                    {isExporting ? <SpinnerIcon className="w-6 h-6" /> : <ExportChatIcon className="w-6 h-6" />}
                </button>
            </div>
            <ChatWindow ref={chatWindowRef} messages={messages} isLoading={isLoading} />
            <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
        </div>
    );
};
