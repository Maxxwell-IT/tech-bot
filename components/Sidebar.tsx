
import React from 'react';
import { type Category } from '../types';
import { DocumentIcon } from './icons/DocumentIcon';
import { CircuitBoardIcon } from './icons/CircuitBoardIcon';
import { SoftwareIcon } from './icons/SoftwareIcon';
import { SparePartsIcon } from './icons/SparePartsIcon';
import { FolderIcon } from './icons/FolderIcon';
import { TroubleshootIcon } from './icons/TroubleshootIcon';
import { FileLibraryIcon } from './icons/FileLibraryIcon';
import { Logo } from './Logo';

interface SidebarProps {
  onCategorySelect: (category: Category) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const sidebarItems = [
  { id: 'documentation', label: 'Документація', icon: DocumentIcon },
  { id: 'schematics', label: 'Електро-схеми', icon: CircuitBoardIcon },
  { id: 'software', label: 'Програмне забезпечення', icon: SoftwareIcon },
  { id: 'parts', label: 'Запчастини', icon: SparePartsIcon },
  { id: 'troubleshooting', label: 'Вирішення проблем', icon: TroubleshootIcon },
  { id: 'qnap', label: 'QNAP Папка', icon: FolderIcon },
  { id: 'fileLibrary', label: 'Бібліотека файлів', icon: FileLibraryIcon },
];

export const Sidebar: React.FC<SidebarProps> = ({ onCategorySelect, isOpen }) => {
  return (
    <aside className={`fixed top-0 left-0 h-full bg-dark-800 border-r border-dark-600 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20`}>
      <div className="p-4 h-[97px] flex items-center justify-center border-b border-dark-600">
        <Logo />
      </div>
      <nav className="p-4">
        <ul>
          {sidebarItems.map((item) => (
            <li key={item.id} className="mb-2">
              <button
                onClick={() => onCategorySelect(item.id as Category)}
                className="w-full flex items-center px-4 py-3 text-slate-300 rounded-lg hover:bg-dark-600 hover:text-brand-primary transition-colors duration-200"
              >
                <item.icon className="w-6 h-6 mr-4" />
                <span className="font-medium text-lg">{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
