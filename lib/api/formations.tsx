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

export const getRessources = async () : Promise<RessourcesResponse> => {
  try {
    const response = await api.get(endpoints.formations.ressources.base);
    return response.data;
  } catch (error) {
    console.error("Failed to get Ressources", (error as Error).message)
    throw error
  }
}