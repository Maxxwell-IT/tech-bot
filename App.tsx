import React, { useState, useEffect, useCallback, useRef } from 'react';
import { type Chat } from "@google/genai";
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { SearchBar } from './components/SearchBar';
import { FileLibraryModal } from './components/FileLibraryModal';
import { initChat } from './services/geminiService';
import { type Message, type Category, type FileItem } from './types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ExportChatIcon } from './components/icons/ExportChatIcon';
import { SpinnerIcon } from './components/icons/SpinnerIcon';


const App: React.FC = () => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isFileLibraryOpen, setIsFileLibraryOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);


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
  
  const handleExportChat = async () => {
    if (!chatWindowRef.current || messages.length <= 1) {
      console.log("Chat window ref not found or no messages to export.");
      return;
    }

    setIsExporting(true);

    try {
      const element = chatWindowRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#2c2c24', // Match with dark-900 (Dark Graphite)
        scrollY: -window.scrollY,
        height: element.scrollHeight,
        windowHeight: element.scrollHeight,
      });

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
    <div className="flex h-screen bg-dark-900 font-sans">
      <Sidebar onCategorySelect={handleCategorySelect} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 h-full transition-all duration-300 ease-in-out" style={{ marginLeft: isSidebarOpen ? '256px' : '0' }}>
        <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-600 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-brand-primary">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-200 hidden sm:block">Tech-Bot Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-full max-w-md">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </div>
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
        </header>
        <ChatWindow ref={chatWindowRef} messages={messages} isLoading={isLoading} />
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