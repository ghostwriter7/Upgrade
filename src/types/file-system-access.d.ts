export {};

type FilePickerOptions = {
  suggestedName?: string;
  types?: {
    description?: string;
    accept: {
      [key: string]: string[];
    };
  }[];
};

declare global {
  interface Window {
    showOpenFilePicker: (options?: FilePickerOptions) => Promise<FileSystemFileHandle[]>;
    showSaveFilePicker: (options?: FilePickerOptions) => Promise<FileSystemFileHandle>;
  }
}
