import React, { useState, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { DocumentIcon } from './icons/DocumentIcon';
import { SoftwareIcon } from './icons/SoftwareIcon';
import { SparePartsIcon } from './icons/SparePartsIcon';
import { FileLibraryIcon } from './icons/FileLibraryIcon';
import { QuestionIcon } from './icons/QuestionIcon';
import { TrainingIcon } from './icons/TrainingIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { Logo } from './Logo';
import { GoogleDriveContext } from '../contexts/GoogleDriveContext';
import { SpinnerIcon } from './icons/SpinnerIcon';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const mainSidebarItems = [
  { path: '/chat', label: 'Поставити питання', icon: QuestionIcon },
  { path: '/library', label: 'Бібліотека', icon: FileLibraryIcon },
  { path: '/training', label: 'Навчання', icon: TrainingIcon },
  { path: '/software', label: 'Програмне забезпечення', icon: SoftwareIcon },
  { path: '/parts', label: 'Запчастини', icon: SparePartsIcon },
];

const navLinkStyle = "w-full flex items-center px-4 py-3 text-slate-300 rounded-lg hover:bg-dark-600 hover:text-brand-primary transition-colors duration-200";
const activeNavLinkStyle = "bg-dark-700 text-brand-primary";

export const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const [isTechDocOpen, setIsTechDocOpen] = useState(true);
  const { rootFolders, isApiReady } = useContext(GoogleDriveContext);

  const renderTechDocSubMenu = () => {
    if (!isApiReady || rootFolders === null) {
        return (
             <li className="px-4 py-2 text-xs text-dark-500 flex items-center">
                <SpinnerIcon className="w-4 h-4 mr-2" />
                <span>Завантаження...</span>
            </li>
        )
    }

    if (rootFolders.length === 0) {
        return (
            <li className="px-4 py-2 text-xs text-dark-500">
                Папки не знайдено.
            </li>
        )
    }

    return rootFolders.map((item) => (
      <li key={item.id}>
        <NavLink
          to={`/library/${item.id}`}
          className={({ isActive }) => `w-full text-left block px-4 py-2 text-slate-400 rounded-md hover:bg-dark-700 hover:text-brand-primary transition-colors duration-200 text-base ${isActive ? 'text-brand-primary bg-dark-700' : ''}`}
        >
          {item.name}
        </NavLink>
      </li>
    ));
  };

  return (
    <aside className={`fixed top-0 left-0 h-full bg-dark-800 border-r border-dark-600 w-64 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-20 flex flex-col`}>
      <div className="p-4 h-[97px] flex items-center justify-center border-b border-dark-600 flex-shrink-0">
        <Logo />
      </div>
      <nav className="p-4 flex-1 overflow-y-auto">
        <ul>
          <li className="mb-2">
             <button
                onClick={() => setIsTechDocOpen(!isTechDocOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-slate-300 rounded-lg hover:bg-dark-600 hover:text-brand-primary transition-colors duration-200"
                aria-expanded={isTechDocOpen}
              >
                <div className="flex items-center">
                    <DocumentIcon className="w-6 h-6 mr-4" />
                    <span className="font-medium text-lg">Тех. док.</span>
                </div>
                <ChevronDownIcon className={`w-5 h-5 transition-transform duration-200 ${isTechDocOpen ? 'rotate-180' : ''}`} />
              </button>
              {isTechDocOpen && (
                <ul className="pl-8 pt-2 space-y-1 animate-fade-in-slide-up">
                    {renderTechDocSubMenu()}
                </ul>
              )}
          </li>

          {mainSidebarItems.map((item) => (
            <li key={item.path} className="mb-2">
              <NavLink
                to={item.path}
                className={({ isActive }) => `${navLinkStyle} ${isActive ? activeNavLinkStyle : ''}`}
                end={item.path === '/library'} // Make library link active only on root library page
              >
                <item.icon className="w-6 h-6 mr-4" />
                <span className="font-medium text-lg">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};