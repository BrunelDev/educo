import api, { endpoints } from "../api";

export type ProjectStatus = "en_cours" | "termine" | "a_faire" ;

export interface ProjectCreator {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  status: ProjectStatus;
  participants: number[];
  creator: ProjectCreator;
  team: number;
  date_creation: string;
  date_modification: string;
}
export interface ProjectResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Project[];
  }


export const getProjects = async (): Promise<Project[]> => {
    try {
        const response = await api.get<Project[]>(endpoints.projets.base);
        return response.data;
    } catch (error: unknown) {
        console.error("Erreur lors de la récupération des projets :", error);
        return [];
    }
}