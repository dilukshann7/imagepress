interface VersionsApi {
  node: () => string;
  chrome: () => string;
  electron: () => string;
  ping: () => Promise<string>;
}

interface OpenedImageFile {
  filePath: string;
  originalSize: number;
}

interface CompressedImageResult {
  filePath: string;
  compressedSize: number;
}

interface ElectronAPI {
  setTitle: (title: string) => void;
  openFile: () => Promise<OpenedImageFile[] | undefined>;
  compressImages: (
    filePaths: string[],
    quality: number,
  ) => Promise<CompressedImageResult[]>;
}

declare global {
  interface Window {
    versions: VersionsApi;
    electronAPI: ElectronAPI;
  }
}

export {};
