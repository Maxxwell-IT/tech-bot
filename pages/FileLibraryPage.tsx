import React, { useState, useMemo, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { type FileItem } from '../types';
import * as driveService from '../services/googleDriveService';
import { GoogleDriveContext } from '../contexts/GoogleDriveContext';
import { SearchIcon } from '../components/icons/SearchIcon';
import { FileIcon } from '../components/icons/FileIcon';
import { SpinnerIcon } from '../components/icons/SpinnerIcon';
import { FolderIcon } from '../components/icons/FolderIcon';
import { ChatBubbleIcon } from '../components/icons/ChatBubbleIcon';

export const FileLibraryPage: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedItems, setDisplayedItems] = useState<FileItem[]>([]);
    const [currentPath, setCurrentPath] = useState<FileItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const { isApiReady } = useContext(GoogleDriveContext);
    const params = useParams();
    const navigate = useNavigate();
    
    const pathId = useMemo(() => params['*'] || 'root', [params]);
    const isSearching = useMemo(() => searchTerm.trim().length > 0, [searchTerm]);

    const loadFolder = useCallback(async (folderId: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const [items, breadcrumbs] = await Promise.all([
                driveService.getFolderContents(folderId),
                driveService.getBreadcrumbPath(folderId)
            ]);
            setDisplayedItems(items);
            setCurrentPath(breadcrumbs);
        } catch (err: any) {
            setError(err.message || 'Не вдалося завантажити файли.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const performSearch = useCallback(async (query: string) => {
        setIsLoading(true);
        setError(null);
        try {
            const results = await driveService.searchFiles(query);
            setDisplayedItems(results);
        } catch (err: any) {
             setError(err.message || 'Помилка пошуку.');
             console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Effect for loading folder contents or performing search
    useEffect(() => {
        if (isApiReady) {
            if (isSearching) {
                performSearch(searchTerm);
            } else {
                loadFolder(pathId);
            }
        }
    }, [isApiReady, pathId, isSearching, searchTerm, loadFolder, performSearch]);

    const handleAskBot = (file: FileItem, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click event from firing
        navigate('/chat', { state: { initialMessage: `Розкажи мені про файл: "${file.name}"` } });
    };

    const handleItemClick = (item: FileItem) => {
        if (item.kind === 'folder') {
            navigate(`/library/${item.id}`);
            if (isSearching) {
                setSearchTerm(''); // Clear search when navigating to a folder from results
            }
        } else if (item.webViewLink) {
            window.open(item.webViewLink, '_blank', 'noopener,noreferrer');
        }
    };
    
    const handleBreadcrumbClick = (folderId: string) => {
        navigate(`/library/${folderId}`);
    };

    if (!isApiReady) {
        return <div className="flex flex-col items-center justify-center text-center text-dark-500 py-16"><SpinnerIcon className="w-8 h-8 mb-4"/><p>Ініціалізація Google Drive...</p></div>;
    }

    const renderContent = () => {
        if (isLoading) {
            return <div className="flex flex-col items-center justify-center text-center text-dark-500 py-16"><SpinnerIcon className="w-8 h-8 mb-4"/><p>Завантаження файлів...</p></div>;
        }
        if (error) {
            return <div className="text-center text-red-400 py-16"><p>{error}</p></div>;
        }
        if (displayedItems.length > 0) {
            return (
                <ul className="space-y-1">
                    {displayedItems.map(item => (
                        <li key={item.id}
                            onClick={() => handleItemClick(item)}
                            className="flex items-center justify-between p-3 text-left text-slate-300 rounded-lg hover:bg-dark-600 transition-colors duration-200 cursor-pointer group"
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleItemClick(item)}
                        >
                            <div className="flex items-center truncate">
                                {item.kind === 'folder' ? <FolderIcon className="w-6 h-6 mr-4 flex-shrink-0 text-brand-primary/80" /> : <FileIcon fileType={item.fileType} className="w-6 h-6 mr-4 flex-shrink-0" />}
                                <span className="font-medium truncate">{item.name}</span>
                            </div>
                            {item.kind === 'file' && (
                                <button
                                    onClick={(e) => handleAskBot(item, e)}
                                    className="p-2 rounded-full opacity-0 group-hover:opacity-100 focus:opacity-100 hover:bg-dark-700 transition-opacity"
                                    title="Запитати у бота про цей файл"
                                >
                                    <ChatBubbleIcon className="w-5 h-5" />
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            );
        }
        return <div className="text-center text-dark-500 py-16"><p>Файли не знайдено.</p></div>;
    };

    return (
        <div className="p-4 sm:p-6 h-full flex flex-col">
            <header className="flex-shrink-0 mb-4">
                <h2 className="text-2xl font-bold text-white mb-4">Бібліотека файлів</h2>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon className="h-5 w-5 text-dark-500" />
                    </div>
                    <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Пошук файлів у Drive..." className="block w-full bg-dark-700 border border-dark-600 rounded-lg py-2 pl-10 pr-3 text-slate-200 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-brand-primary" aria-label="Search files" />
                </div>
            </header>
            
            <div className="p-3 border-y border-dark-700 mb-4 flex-shrink-0">
                {!isSearching ? (
                    <nav aria-label="breadcrumb">
                        <ol className="flex items-center space-x-1 text-sm text-dark-500 truncate">
                            <li><Link to="/library" className="hover:text-brand-primary transition-colors">Бібліотека</Link></li>
                            {currentPath.map((folder, index) => (
                                <li key={folder.id} className="flex items-center">
                                    <span className="mx-1 select-none">/</span>
                                    {index === currentPath.length - 1 ? 
                                    <span className="font-semibold text-slate-300 truncate">{folder.name}</span> : 
                                    <button onClick={() => handleBreadcrumbClick(folder.id)} className="hover:text-brand-primary transition-colors truncate">{folder.name}</button>}
                                </li>
                            ))}
                        </ol>
                    </nav>
                ) : (
                    <p className="text-sm text-dark-500">Результати пошуку для: <span className="font-semibold text-slate-300">"{searchTerm}"</span></p>
                )}
            </div>

            <div className="flex-1 overflow-y-auto pr-2">
                {renderContent()}
            </div>
        </div>
    );
};