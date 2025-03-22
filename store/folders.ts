import { create } from 'zustand';
import { Dossier } from '@/lib/api/fichiers';

interface FolderStore {
  folders: Dossier[];
  removeFolder: (folderId: number) => void;
  setFolders: (folders: Dossier[]) => void;
}

export const useFolderStore = create<FolderStore>((set) => ({
  folders: [],
  removeFolder: (folderId) => 
    set((state) => ({
      folders: state.folders.filter((folder) => folder.id !== folderId)
    })),
  setFolders: (folders) => set({ folders })
}));