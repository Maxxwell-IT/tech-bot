import { FileItem, FileType } from '../types';

// Fix for TypeScript not recognizing gapi and google from CDN scripts.
// Declaring them as global variables of type 'any' resolves compile-time errors.
declare var gapi: any;
declare var google: any;

// The API key is sourced from the standard environment variable.
const API_KEY = process.env.API_KEY;
// This is the ID of the publicly shared Google Drive folder.
const ROOT_FOLDER_ID = '1L7cpFsYxJUKo2HMmUWdN5qUrLRLqfybI';

// Fix: Access gapi directly as it's declared as a global variable instead of on 'window'.
const loadGapi = () => new Promise<void>((resolve, reject) => {
    if (gapi) {
        gapi.load('client', resolve);
    } else {
        reject(new Error("gapi is not defined"));
    }
});

const getFileTypeFromMime = (mimeType?: string): FileType => {
    if (!mimeType) return 'other';
    if (mimeType.includes('pdf')) return 'pdf';
    if (mimeType.includes('zip')) return 'zip';
    if (mimeType.includes('spreadsheet')) return 'xlsx';
    if (mimeType.includes('wordprocessingml')) return 'docx';
    if (mimeType.startsWith('image/')) return 'png';
    if (mimeType.includes('csv')) return 'csv';
    return 'other';
};

// Fix: Use 'any' for the driveFile parameter type as 'gapi' namespace is not available.
const mapDriveFileToFileItem = (driveFile: any): FileItem => ({
    id: driveFile.id!,
    name: driveFile.name!,
    kind: driveFile.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
    fileType: getFileTypeFromMime(driveFile.mimeType),
    mimeType: driveFile.mimeType,
    webViewLink: driveFile.webViewLink,
});

export const initClient = async () => {
    if (!API_KEY) {
        throw new Error("API_KEY environment variable is not configured for Google Drive.");
    }
    
    await loadGapi();

    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
    });
};

export const getFolderContents = async (folderId: string): Promise<FileItem[]> => {
    let effectiveFolderId = folderId;
    if (folderId === 'root') {
        if (!ROOT_FOLDER_ID) throw new Error(`ROOT_FOLDER_ID is not configured.`);
        effectiveFolderId = ROOT_FOLDER_ID;
    }
    
    const response = await gapi.client.drive.files.list({
        q: `'${effectiveFolderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink)',
        orderBy: 'folder,name',
    });
    return response.result.files?.map(mapDriveFileToFileItem) ?? [];
};

export const getBreadcrumbPath = async (folderId: string): Promise<FileItem[]> => {
    if (!folderId || folderId === 'root' || folderId === ROOT_FOLDER_ID) return [];

    let path: FileItem[] = [];
    let currentId: string | undefined = folderId;
    
    while (currentId && currentId !== ROOT_FOLDER_ID) {
        const response = await gapi.client.drive.files.get({
            fileId: currentId,
            fields: 'id, name, parents, mimeType, webViewLink',
        });
        
        path.unshift(mapDriveFileToFileItem(response.result));
        currentId = response.result.parents?.[0];
        if (!currentId) break; // Reached the top level for the user, stop.
    }
    
    return path;
};

export const searchFiles = async (query: string): Promise<FileItem[]> => {
    if (!ROOT_FOLDER_ID) {
      throw new Error("Cannot search because root folder is not configured.");
    }
    
    // Note: This performs a global search for files matching the name. 
    // For a truly private folder structure, this could show files from outside the target folder.
    // Since we are using a public folder, we assume all relevant files are within it, and this provides a better user experience.
    const response = await gapi.client.drive.files.list({
        q: `name contains '${query}' and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink)',
        pageSize: 50,
    });
    return response.result.files?.map(mapDriveFileToFileItem) ?? [];
};