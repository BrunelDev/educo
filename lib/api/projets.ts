import api, { endpoints } from "../api";
import { Task } from "./tache";

export type ProjectStatus = "en_cours" | "termine" | "a_faire" ;

export interface ProjectCreator {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}
export interface ProjectUser {
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
  status_display: string;
  participants: ProjectUser[];
  creator: ProjectUser;
  team: number | null;
  date_creation: string;
  date_modification: string;
  taches: Task[];
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
interface createProjectParams {
  
  title: string;
  description: string;
  status: string;
  participants: number[];
    team: 0
  
}
export const createProject = async (project: createProjectParams): Promise<Project> => {
  try {
    const response = await api.post<Project>(endpoints.projets.base, {...project});
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur lors de la création du projet :", error);
    throw error;
  }
}

export const getProjectById = async (id: number) => {
  try {
    const response = await api.get<Project>(`${endpoints.projets.base}${id}/`);
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération du projet :", error);
    throw error;
  }
  
}