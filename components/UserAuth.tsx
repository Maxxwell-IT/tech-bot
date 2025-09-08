import React, { useContext, useState, useRef, useEffect } from 'react';
import { GoogleDriveContext } from '../contexts/GoogleDriveContext';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { GoogleSignInButton } from './GoogleSignInButton';

export const UserAuth: React.FC = () => {
    const { isApiReady, isSignedIn, user, signIn, signOut } = useContext(GoogleDriveContext);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (!isApiReady) {
        return (
            <div className="flex items-center justify-center w-10 h-10">
                <SpinnerIcon className="w-5 h-5 text-dark-500" />
            </div>
        );
    }

    if (!isSignedIn) {
        return <GoogleSignInButton onClick={signIn} isShort={true} />;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="w-10 h-10 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-800 focus:ring-brand-primary">
                {user?.picture ? (
                    <img src={user.picture} alt={user.name} className="w-full h-full rounded-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                    <div className="w-10 h-10 rounded-full bg-dark-600 flex items-center justify-center text-slate-300 font-bold">
                        {user?.name?.[0]}
                    </div>
                )}
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-dark-700 border border-dark-600 rounded-lg shadow-xl z-20 animate-fade-in-slide-up">
                    <div className="p-4 border-b border-dark-600">
                        <p className="font-semibold text-slate-200 truncate">{user?.name}</p>
                        <p className="text-sm text-dark-500 truncate">{user?.email}</p>
                    </div>
                    <div className="p-2">
                        <button
                            onClick={() => {
                                signOut();
                                setIsDropdownOpen(false);
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-slate-300 rounded-md hover:bg-dark-600 hover:text-brand-primary"
                        >
                            Вийти
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};