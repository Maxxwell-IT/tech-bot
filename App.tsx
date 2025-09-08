
import React, { useState, useEffect, useCallback } from 'react';
import { type Chat } from "@google/genai";
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { SearchBar } from './components/SearchBar';
import { FileLibraryModal } from './components/FileLibraryModal';
import { initChat } from './services/geminiService';
import { type Message, type Category, type FileItem } from './types';

const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFileLibraryOpen, setIsFileLibraryOpen] = useState<boolean>(false);


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
    // FIX: Added curly braces to the catch block to fix a syntax error that caused cascading compilation errors.
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

  const handleSendMessage = async (text: string) => {
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
        // Replace the placeholder empty message with the error.
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
  };
  
  const handleSearch = (query: string) => {
    if (query.trim()) {
      const searchPrompt = `Знайди в документації та інших ресурсах інформацію по запиту: "${query}"`;
      handleSendMessage(searchPrompt);
    }
  };

  const handleFileSelect = (file: FileItem) => {
    setIsFileLibraryOpen(false);
    handleSendMessage(`Розкажи мені про файл: "${file.name}"`);
  };

  const handleCategorySelect = (category: Category) => {
    if (category === 'fileLibrary') {
      setIsFileLibraryOpen(true);
      return;
    }
    
    let prompt = '';
    switch (category) {
      case 'documentation':
        prompt = 'Покажи мені список доступної документації по обладнанню.';
        break;
      case 'schematics':
        prompt = 'Де я можу знайти електричні схеми?';
        break;
      case 'software':
        prompt = 'Надай мені посилання на останнє програмне забезпечення.';
        break;
      case 'parts':
        prompt = 'Мені потрібен перелік додаткових запчастин.';
        break;
      case 'qnap':
        prompt = 'Дай мені посилання на QNAP розшарену папку з документами.';
        break;
      case 'troubleshooting':
        prompt = 'Допоможи мені з вирішенням типових проблем.';
        break;
    }
    handleSendMessage(prompt);
  };

  return (
    <div className="flex h-screen bg-slate-900 font-sans">
      <Sidebar onCategorySelect={handleCategorySelect} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 h-full transition-all duration-300 ease-in-out" style={{ marginLeft: isSidebarOpen ? '256px' : '0' }}>
        <header className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-200 hidden sm:block">Tech-Bot Assistant</h1>
          </div>
          <div className="w-full max-w-md">
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </header>
        <ChatWindow messages={messages} isLoading={isLoading} />
        <InputBar onSendMessage={handleSendMessage} isLoading={isLoading} />
      </div>
       {isFileLibraryOpen && (
        <FileLibraryModal 
          isOpen={isFileLibraryOpen}
          onClose={() => setIsFileLibraryOpen(false)}
          onFileSelect={handleFileSelect}
        />
      )}
    </div>
  );
};

export default App;
