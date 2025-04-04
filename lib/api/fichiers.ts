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
}

export interface DossierResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dossier[];
}

const endpoint = endpoints.fichiers.dossiers.list;

export const getDossiers = async (
  page: number = 1
): Promise<DossierResponse> => {
  try {
    const response = await api.get(endpoint, {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dossiers", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const getOneDossiers = async (id: string): Promise<Dossier> => {
  try {
    const response = await api.get(`${endpoint}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dossier", error);
    return {
      id: 4,
      nom: "Marketing & Communication",
      parent: null,
      utilisateur: 3,
      sous_dossiers: [],
      fichiers: [],
      date_creation: "2025-03-21T10:29:46.834618Z",
      date_modification: "2025-03-21T10:29:46.834655Z",
    };
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
    console.error("Error creating dossier", error);
    throw error;
  }
};
export const deleteDossier = async (id: number) => {
  try {
    await api.delete(`${endpoint}${id}/`);
  } catch (error) {
    console.error("Error deleting dossier", error);
  }
};
export const editDossier = async (id: number, nom?: string) => {
  try {
    const response = await api.patch(`${endpoint}${id}/`, {
      nom,
    });
    return response.data;
  } catch (error) {
    console.error("Error editing dossier", error);
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
    console.error("Error extracting filename:", error);
    return "unknown_file";
  }
};

interface CreateFilePayload {
  nom: string;
  type_fichier: string | null;
  url: string;
  dossier: number;
}

const fileEndpoint = endpoints.fichiers.fichiers.base

export const createFile = async (fileData: CreateFilePayload) => {
  try {
    const response = await api.post(`${fileEndpoint}`, fileData
      
    );
    return response.data
    
  } catch (error: unknown) {
    console.error("Error creating file:", error);
    throw error;
    
  }
};
