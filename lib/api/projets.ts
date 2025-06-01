import api, { endpoints } from "../api";
import { Task } from "./tache";

export type ProjectStatus = "en_cours" | "termine" | "a_faire";

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
};
interface createProjectParams {
  title: string;
  description: string;
  status: string;
  participants: number[];
  team: number;
}
export const createProject = async (
  project: createProjectParams
): Promise<Project> => {
  try {
    const response = await api.post<Project>(endpoints.projets.base, {
      ...project,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur lors de la création du projet :", error);
    throw error;
  }
};

export const getProjectById = async (id: number) => {
  try {
    const response = await api.get<Project>(`${endpoints.projets.base}${id}/`);
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur lors de la récupération du projet :", error);
    throw error;
  }
};

/**
 * Deletes a project by its ID
 * @param id - The ID of the project to delete
 * @returns A promise that resolves when the project is deleted
 */
export const deleteProject = async (id: number): Promise<void> => {
  try {
    await api.delete(`${endpoints.projets.base}${id}/`);
  } catch (error: unknown) {
    console.error("Erreur lors de la suppression du projet :", error);
    throw error;
  }
};

/**
 * Interface for updating a project
 * All fields are optional to allow partial updates
 */
export interface UpdateProjectDto {
  title?: string;
  description?: string;
  status?: ProjectStatus;
  participants?: number[];
  team?: number;
}

/**
 * Updates a project with the provided data
 * @param id - The ID of the project to update
 * @param data - The data to update the project with
 * @returns The updated project data
 */
export const updateProject = async (
  id: number,
  data: UpdateProjectDto
): Promise<Project> => {
  try {
    const response = await api.patch<Project>(
      `${endpoints.projets.base}${id}/`,
      data
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Erreur lors de la mise à jour du projet :", error);
    throw error;
  }
};
