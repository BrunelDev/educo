import api, { endpoints } from "../api";

export interface Ressource {
  id: number;
  titre: string;
  type_ressource: string;
  url: string;
  webinaire: number;
  utilisateur: number;
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
export const subscribeToWebinaire = async (webinaireId: number): Promise<void> => {
  try {
    await api.post("formations/webinaires/inscription/", { webinaire: webinaireId });
  } catch (error) {
    console.error("Error subscribing to webinaire:", error);
    throw error;
  }
};

