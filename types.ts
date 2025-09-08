
export interface Message {
  role: 'user' | 'model';
  content: string;
}

export type Category = 'documentation' | 'schematics' | 'software' | 'parts' | 'qnap' | 'troubleshooting' | 'fileLibrary';

export interface FileItem {
  id: number;
  name: string;
  type: 'pdf' | 'zip' | 'xlsx' | 'docx' | 'other';
}
