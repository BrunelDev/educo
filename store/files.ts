import { create } from "zustand";

interface FileStore {
  // State
  filesList: {
    file: File;
    fileUrl: string;
    name: string;
  }[];
  isLoading: boolean;
  error: string | null;

  // File Actions
  addFileWithUrl: (file: File, url: string, name: string) => void;
  removeFileWithUrl: (file: File) => void;
  clearFilesAndUrls: () => void;
  setLoading: (status: boolean) => void;
  setError: (error: string | null) => void;
}

export const useFileStore = create<FileStore>((set) => ({
  // Initial state
  filesList: [],
  isLoading: false,
  error: null,

  // Actions
  addFileWithUrl: (file, url, name) =>
    set((state) => ({
      filesList: [...state.filesList, { file, fileUrl: url, name }],
      error: null,
    })),

  removeFileWithUrl: (fileToRemove) =>
    set((state) => ({
      filesList: state.filesList.filter(
        (item) => item.file.name !== fileToRemove.name
      ),
      error: null,
    })),

  clearFilesAndUrls: () =>
    set(() => ({
      filesList: [],
      error: null,
    })),

  setLoading: (status) => set(() => ({ isLoading: status })),
  setError: (error) => set(() => ({ error })),
}));
