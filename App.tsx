import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { SearchBar } from './components/SearchBar';

// Page Components
import { ChatPage } from './pages/ChatPage';
import { FileLibraryPage } from './pages/FileLibraryPage';
import { PlaceholderPage } from './pages/PlaceholderPage';

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      const searchPrompt = `Знайди в документації та інших ресурсах інформацію по запиту: "${query}"`;
      // Navigate to the chat page and pass the search query in the state
      navigate('/chat', { state: { initialMessage: searchPrompt } });
    }
  };

  return (
    <div className="flex h-screen bg-dark-900 font-sans">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex flex-col flex-1 h-full transition-all duration-300 ease-in-out" style={{ marginLeft: isSidebarOpen ? '256px' : '0' }}>
        <header className="bg-dark-800/50 backdrop-blur-sm border-b border-dark-600 p-4 flex items-center justify-between gap-4 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-md hover:bg-dark-600 focus:outline-none focus:ring-2 focus:ring-brand-primary">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-slate-200 hidden sm:block">Tech-Bot Assistant</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-full max-w-xs hidden md:block">
              <SearchBar onSearch={handleSearch} />
            </div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto bg-dark-900">
           <Routes>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/library/*" element={<FileLibraryPage />} />
            <Route 
                path="/training" 
                element={
                    <PlaceholderPage 
                        title="Навчання" 
                        message="Тут будуть зібрані навчальні матеріали, інструкції та відео-уроки."
                        prompt="Які є навчальні матеріали?"
                    />} 
            />
            <Route 
                path="/software" 
                element={
                    <PlaceholderPage 
                        title="Програмне забезпечення" 
                        message="Цей розділ надасть доступ до необхідного програмного забезпечення."
                        prompt="Де знайти програмне забезпечення для лінії порізки Hegla?"
                    />} 
            />
            <Route 
                path="/parts" 
                element={
                    <PlaceholderPage 
                        title="Запчастини" 
                        message="Тут ви зможете знайти каталоги запчастин та інформацію про їх наявність."
                        prompt="Мені потрібен каталог запчастин для Bystronic."
                    />} 
            />
            <Route path="*" element={
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-red-500">404 - Сторінку не знайдено</h2>
                    <p className="mt-4 text-dark-500">На жаль, сторінка, яку ви шукаєте, не існує.</p>
                </div>
            } />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;