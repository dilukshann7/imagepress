interface OpenedImageFile {
  filePath: string;
  originalSize: number;
}

interface CompressedImageResult {
  filePath: string;
  compressedSize: number;
}

interface ElectronAPI {
  openFile: () => Promise<OpenedImageFile[] | undefined>;
  compressImages: (
    filePaths: string[],
    quality: number,
  ) => Promise<CompressedImageResult[]>;
  getPathForFile: (file: File) => string;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}

export {};
