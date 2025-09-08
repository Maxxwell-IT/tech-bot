import React, { useState, useMemo, useEffect } from 'react';
import { type FileItem } from '../types';
import { fetchFiles } from '../services/fileService';
import { SearchIcon } from './icons/SearchIcon';
import { CloseIcon } from './icons/CloseIcon';
import { FileIcon } from './icons/FileIcon';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface FileLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileSelect: (file: FileItem) => void;
}

export const FileLibraryModal: React.FC<FileLibraryModalProps> = ({ isOpen, onClose, onFileSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const loadFiles = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const fetchedFiles = await fetchFiles();
          setFiles(fetchedFiles);
        } catch (err) {
          setError('Не вдалося завантажити файли. Будь ласка, спробуйте пізніше.');
          console.error(err);
        } finally {
          setIsLoading(false);
        }
      };
      loadFiles();
    }
  }, [isOpen]);

  const filteredFiles = useMemo(() => {
    return files.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, files]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center text-dark-500 py-16">
          <SpinnerIcon className="w-8 h-8 mb-4"/>
          <p>Завантаження файлів...</p>
        </div>
      );
    }

    if (error) {
       return (
        <div className="text-center text-red-400 py-16">
          <p>{error}</p>
        </div>
      );
    }
    
    if (filteredFiles.length > 0) {
      return (
        <ul className="space-y-2">
          {filteredFiles.map(file => (
            <li key={file.id}>
              <button 
                onClick={() => onFileSelect(file)}
                className="w-full flex items-center p-3 text-left text-slate-300 rounded-lg hover:bg-dark-600 transition-colors duration-200 focus:outline-none focus:bg-dark-600 focus:ring-2 focus:ring-brand-primary"
              >
                <FileIcon fileType={file.type} className="w-6 h-6 mr-4 flex-shrink-0" />
                <span className="font-medium truncate">{file.name}</span>
              </button>
            </li>
          ))}
        </ul>
      );
    }

    return (
      <div className="text-center text-dark-500 py-16">
        <p>Файли не знайдено.</p>
      </div>
    );
  };

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="file-library-title"
    >
      <div 
        className="bg-dark-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col border border-dark-600 animate-fade-in-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-4 border-b border-dark-600">
          <h2 id="file-library-title" className="text-xl font-bold text-white">Бібліотека файлів</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-dark-600" aria-label="Close file library">
            <CloseIcon className="w-6 h-6 text-dark-500" />
          </button>
        </header>

        <div className="p-4 border-b border-dark-600">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="h-5 w-5 text-dark-500" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Пошук файлів..."
                className="block w-full bg-dark-700 border border-dark-600 rounded-lg py-2 pl-10 pr-3 text-slate-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                aria-label="Search files"
            />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-4">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};
