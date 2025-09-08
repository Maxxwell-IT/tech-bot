import { type FileItem } from '../types';

const mockFiles: FileItem[] = [
  { id: 1, name: 'Compressor Atlas-5 Manual.pdf', type: 'pdf' },
  { id: 2, name: 'Controller v3.1 Firmware.zip', type: 'zip' },
  { id: 3, name: 'Schematics Atlas-5 rev2.pdf', type: 'pdf' },
  { id: 4, name: 'Spare Parts List 2024.xlsx', type: 'xlsx' },
  { id: 5, name: 'Troubleshooting Guide Q1.docx', type: 'docx' },
  { id: 6, name: 'Installation Notes.txt', type: 'other' },
  { id: 7, name: 'Compressor Beta-2 Manual.pdf', type: 'pdf' },
  { id: 8, name: 'Safety Procedures.docx', type: 'docx' },
  { id: 9, name: 'Maintenance Log 2023.xlsx', type: 'xlsx' },
  { id: 10, name: 'Warranty Information.pdf', type: 'pdf' },
];

/**
 * Simulates fetching files from an external source like QNAP or Google Drive.
 * @returns A promise that resolves with an array of FileItem objects.
 */
export const fetchFiles = (): Promise<FileItem[]> => {
  console.log('Fetching files from external source...');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Simulate a potential network error
      if (Math.random() > 0.95) { // 5% chance of failure
        console.error('Simulated network error while fetching files.');
        reject(new Error('Failed to fetch files from the server.'));
      } else {
        console.log('Successfully fetched files.');
        resolve(mockFiles);
      }
    }, 1200); // Simulate network latency
  });
};