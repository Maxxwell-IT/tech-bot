import React, { createContext, useState, useEffect } from 'react';
import { FileItem } from '../types';
import * as driveService from '../services/googleDriveService';

// Fix: Add authentication-related properties to the context type to resolve errors in UserAuth.tsx.
interface GoogleDriveContextType {
    isApiReady: boolean;
    rootFolders: FileItem[] | null;
    error: string | null;
    isSignedIn: boolean;
    user: { name?: string; email?: string; picture?: string; } | null;
    signIn: () => void;
    signOut: () => void;
}

export const GoogleDriveContext = createContext<GoogleDriveContextType>({
    isApiReady: false,
    rootFolders: null,
    error: null,
    // Fix: Provide default values for new authentication properties.
    isSignedIn: false,
    user: null,
    signIn: () => {},
    signOut: () => {},
});

export const GoogleDriveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isApiReady, setIsApiReady] = useState(false);
    const [rootFolders, setRootFolders] = useState<FileItem[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Fix: Provide stub implementation for authentication state.
    // This resolves errors in the UserAuth component, which is currently not used in the application.
    // The application uses a public API key and does not require user sign-in.
    const isSignedIn = false;
    const user = null;
    const signIn = () => console.warn("Sign in functionality is not implemented.");
    const signOut = () => console.warn("Sign out functionality is not implemented.");

    useEffect(() => {
        const initialize = async () => {
            try {
                await driveService.initClient();
                setIsApiReady(true);
                
                const appFolders = await driveService.getFolderContents('root');
                appFolders.sort((a, b) => a.name.localeCompare(b.name, 'uk'));
                setRootFolders(appFolders);

            } catch (err: any) {
                setError(err.message || "Failed to initialize Google Drive client or fetch data.");
                console.error(err);
            }
        };
        initialize();
    }, []);


    return (
        // Fix: Pass the new authentication properties through the context provider.
        <GoogleDriveContext.Provider value={{ isApiReady, rootFolders, error, isSignedIn, user, signIn, signOut }}>
            {children}
        </GoogleDriveContext.Provider>
    );
};