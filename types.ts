export interface Message {
  role: 'user' | 'model';
  content: string;
}

export type FileType = 'pdf' | 'zip' | 'xlsx' | 'docx' | 'png' | 'csv' | 'other';

export interface FileItem {
  id: string;
  name: string;
  kind: 'file' | 'folder';
  fileType?: FileType;
  children?: FileItem[];
  mimeType?: string;
  webViewLink?: string;
}