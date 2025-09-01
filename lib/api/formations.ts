import api, { endpoints } from "../api";

export interface Ressource {
  id: number;
  titre: string;
  type_ressource: string;
  url: string;
  webinaire?: number;
  utilisateur?: number;
  date_creation: string;
  date_modification: string;
  description: string;
  auteur: string;
}

export interface Webinaire {
  id: number;
  titre: string;
  description: string;
  image: string;
  formateur_nom: string;
  formateur_profession: string;
  date: string;
  duree: string;
  utilisateur: number;
  ressources: Ressource[];
  date_creation: string;
  date_modification: string;
  inscrit: boolean;
  formateur_image: string;
}

export interface WebinairesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Webinaire[];
}

export interface RessourcesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Ressource[];
}

const endpoint = endpoints.formations.webinaires.list;

export const getWebinaireById = async (id: number): Promise<Webinaire> => {
  try {
    const response = await api.get<Webinaire>(`formations/webinaires/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération du webinaire`, (error as Error).message);
    throw error;
  }
};

export const getWebinaires = async (
  page: number = 1
): Promise<WebinairesResponse> => {
  try {
    const response = await api.get<WebinairesResponse>(endpoint, {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getRessources = async (): Promise<RessourcesResponse> => {
  try {
    const response = await api.get(endpoints.formations.ressources.base);
    return response.data;
  } catch (error) {
    console.error("Failed to get Ressources", (error as Error).message);
    throw error;
  }
};

/**
 * Interface for the data that can be updated in a resource
 */
export interface UpdateRessourceDto {
  titre?: string;
  description?: string;
  type_ressource?: string;
  url?: string;
  auteur?: string;
}

/**
 * Update an existing resource with partial data
 * @param id The ID of the resource to update
 * @param updateData The partial data to update the resource with
 * @returns The updated resource data
 */
export const updateRessource = async (
  id: number,
  updateData: UpdateRessourceDto
): Promise<Ressource> => {
  try {
    const response = await api.patch<Ressource>(
      `${endpoints.formations.ressources.base}${id}/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating resource:", error);
    throw error;
  }
};

// s'inscrire a webinaire
export const subscribeToWebinaire = async (
  webinaireId: number
): Promise<void> => {
  try {
    await api.post("formations/webinaires/inscription/", {
      webinaire: webinaireId,
    });
  } catch (error) {
    console.error("Error subscribing to webinaire:", error);
    throw error;
  }
};

// se désinscrire de webinaire
export const unsubscribeFromWebinaire = async (
  webinaireId: number
): Promise<void> => {
  try {
    await api.delete(`formations/webinaires/inscription/${webinaireId}/`);
  } catch (error) {
    console.error("Error unsubscribing from webinaire:", error);
    throw error;
  }
};

// --- Dossiers (Formations) ---

export interface DossierRessource {
  id: number;
  titre: string;
  type_ressource: string;
  url: string;
  description: string;
  auteur: string;
  date_creation: string;
  // Optional fields observed in API payloads
  date_modification?: string;
  webinaire?: number;
  utilisateur?: number;
}

export interface DossierUtilisateur {
  id: number;
  email: string;
  nom_complet: string;
}

export interface Dossier {
  id: number;
  nom: string;
  description: string | null;
  parent: number ;
  ressources: DossierRessource[];
  utilisateur?: number | DossierUtilisateur;
  date_creation: string;
  date_modification: string;
  chemin_complet: string;
  sous_dossiers: Dossier[];
}

export interface DossiersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dossier[];
}

export interface GetDossiersParams {
  parent_id?: number;
  include_empty?: boolean;
}


// Lister vos dossiers
export const getDossiers = async (
  params: GetDossiersParams = {}
): Promise<DossiersResponse> => {
  try {
    const response = await api.get<DossiersResponse>(`formations/dossiers/`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching dossiers:", error);
    throw error;
  }
};

// Détails d'un dossier
export const getDossierById = async (id: number): Promise<Dossier> => {
  try {
    const response = await api.get<Dossier>(`formations/dossiers/${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching dossier details:", error);
    throw error;
  }
};
