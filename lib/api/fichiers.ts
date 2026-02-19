import api, { endpoints } from "../api";

export type FileType = "VIDEO" | "IMAGE" | "DOCUMENT" | "AUDIO";

export interface Fichier {
  id: number;
  nom: string;
  type_fichier: FileType;
  url: string;
  dossier: number;
  utilisateur: number;
  date_creation: string;
  date_modification: string;
}
export interface Dossier {
  id: number;
  nom: string;
  parent: number | null;
  utilisateur: number;
  sous_dossiers: Dossier[];
  fichiers: Fichier[];
  date_creation: string;
  date_modification: string;
  type_dossier: string;
}

export interface DossierResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dossier[];
}

const endpoint = endpoints.fichiers.dossiers.list;

export const getDossiers = async (page: number = 1): Promise<Dossier[]> => {
  try {
    const response = await api.get("fichiers/arborescence/", {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export const getOneDossiers = async (id: string): Promise<Dossier> => {
  try {
    const response = await api.get(`${endpoint}${id}/`);
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export const createFolder = async (nom: string, parent: string | null) => {
  try {
    const response = await api.post(endpoint, {
      nom,
      parent,
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};
export const deleteDossier = async (id: number) => {
  try {
    await api.delete(`${endpoint}${id}/`);
  } catch (error) {
console.error(error)
    ;
  }
};
export const editDossier = async (id: number, nom?: string) => {
  try {
    const response = await api.patch(`${endpoint}${id}/`, {
      nom,
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
  }
};

export const extractFilenameFromUrl = (url: string): string => {
  try {
    // Try to get filename from the last part of the URL
    const urlParts = url.split("/");
    let filename = urlParts[urlParts.length - 1];

    // Remove query parameters if present
    if (filename.includes("?")) {
      filename = filename.split("?")[0];
    }

    // Remove timestamp prefix pattern (numbers followed by hyphen)
    filename = filename.replace(/^\d+-/, "");

    // Decode URI components
    filename = decodeURIComponent(filename);

    return filename || "unknown_file";
  } catch (error) {
console.error(error)
    ;
    return "unknown_file";
  }
};

interface CreateFilePayload {
  nom: string;
  type_fichier: string | null;
  url: string;
  dossier: number;
}

const fileEndpoint = endpoints.fichiers.fichiers.base;

/**
 * Gets a file by its ID
 * @param id - The ID of the file to retrieve
 * @returns The file data
 */
export const getFile = async (id: number): Promise<Fichier> => {
  try {
    const response = await api.get(`${fileEndpoint}${id}/`);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export const createFile = async (fileData: CreateFilePayload) => {
  try {
    const response = await api.post(`${fileEndpoint}`, fileData);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

/**
 * Interface for updating a file
 * All fields are optional to allow partial updates
 */
export interface UpdateFilePayload {
  nom?: string;
  type_fichier?: string | null;
  url?: string;
  dossier?: number;
}

/**
 * Updates an existing file with the provided data
 * @param id - The ID of the file to update
 * @param fileData - The data to update the file with
 * @returns The updated file data
 */
export const updateFile = async (id: number, fileData: UpdateFilePayload) => {
  try {
    const response = await api.patch(`${fileEndpoint}${id}/`, fileData);
    return response.data;
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

/**
 * Deletes a file by its ID
 * @param id - The ID of the file to delete
 * @returns A promise that resolves when the file is deleted
 */
export const deleteFile = async (id: number): Promise<void> => {
  try {
    await api.delete(`${fileEndpoint}${id}/`);
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export interface FoldersList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dossier[];
}

export const getFoldersList = async (page: number = 1): Promise<FoldersList> => {
  try {
    const response = await api.get("fichiers/dossiers/", {
      params: {
        page,
        page_size: 50, // Set a reasonable page size
      },
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export interface FilesList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Fichier[];
}

export const getFilesList = async (): Promise<FilesList> => {
  try {
    const response = await api.get("fichiers/fichiers/?page_size=1000");
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export const moveFolderToFolder = async (
  id: number,
  parent: number
): Promise<void> => {
  try {
    await api.patch(`fichiers/dossiers/${id}/`, { parent });
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};

export const moveFileToFolder = async (
  id: number,
  dossier: number
): Promise<void> => {
  try {
    await api.patch(`fichiers/fichiers/${id}/`, { dossier });
  } catch (error: unknown) {
    console.error(error);
    throw error;
  }
};
