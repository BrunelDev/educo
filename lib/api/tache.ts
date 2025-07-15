import api, { endpoints } from "../api";

export type TaskType = "a_faire" | "en_cours" | "termine";

export interface TaskUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image?: string;
}

export interface ProjectDetails {
  id: number;
  title: string;
}
export interface File {
  id: number;
  nom: string;
  url: string;
  type_fichier: string;
}

export interface Task {
  id: number;
  project: number;
  project_details: ProjectDetails;
  fichiers_urls: File[];
  title: string;
  description: string;
  task_type: TaskType;
  task_type_display: string;
  assigned_members: TaskUser[];
  creator: TaskUser;
  date_creation: string;
  date_modification: string;
  compte_rendu?: string; // Added for task report
}

export interface TaskResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Task[];
}

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get(endpoints.taches.base);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching tasks", (error as Error).message);
    throw error;
  }
};

export const getTaskById = async (id: number): Promise<Task> => {
  try {
    const response = await api.get<Task>(`${endpoints.taches.base}${id}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching task", (error as Error).message);
    throw error;
  }
};

export interface CreateTaskDto {
  project: number;
  title: string;
  description: string;
  task_type: TaskType;
  fichiers_urls?: string[];
  assigned_member_ids: number[];
}

export const createTask = async (data: CreateTaskDto): Promise<Task> => {
  try {
    const response = await api.post<Task>(endpoints.taches.base, data);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  task_type?: TaskType;
  fichiers_urls?: string[];
  assigned_member_ids?: number[];
  compte_rendu?: string; // Added for task report
}

/**
 * Updates a task with the provided data
 * @param id - The ID of the task to update
 * @param data - The data to update the task with
 * @returns The updated task data
 */
export const updateTask = async (
  id: number,
  data: UpdateTaskDto
): Promise<Task> => {
  try {
    const response = await api.patch<Task>(
      `${endpoints.taches.base}${id}/`,
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

/**
 * Deletes a task by its ID
 * @param id - The ID of the task to delete
 * @returns A promise that resolves when the task is deleted
 */
export const deleteTask = async (id: number): Promise<void> => {
  try {
    await api.delete(`${endpoints.taches.base}${id}/`);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

/**
 * Interface for adding a participant to a task
 */
export interface AddParticipantDto {
  task_id: number;
  user_id: number;
}

/**
 * Adds a participant to a task using a PUT request
 * @param data - Object containing task_id and user_id
 * @returns The updated task data
 */
export const addParticipant = async (
  data: AddParticipantDto
): Promise<Task> => {
  try {
    // First get the current task data
    const taskData = await getTaskById(data.task_id);

    // Get the current assigned member IDs
    const currentMemberIds = taskData.assigned_members.map(
      (member) => member.id
    );

    // Add the new user ID if it's not already in the list
    if (!currentMemberIds.includes(data.user_id)) {
      currentMemberIds.push(data.user_id);
    }

    // Prepare the PUT request payload with all required fields
    const payload = {
      project: taskData.project,
      title: taskData.title,
      description: taskData.description,
      task_type: taskData.task_type,
      fichiers_urls: taskData.fichiers_urls,
      assigned_member_ids: currentMemberIds,
    };

    // Send the PUT request
    const response = await api.put<Task>(
      `${endpoints.taches.base}${data.task_id}/`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Error adding participant to task:", error);
    throw error;
  }
};

/**
 * Interface for adding a document to a task
 */
export interface AddDocumentDto {
  task_id: number;
  file_url: string;
  file_name?: string;
}

/**
 * Adds a document to a task using a PUT request
 * @param data - Object containing task_id and file_url
 * @returns The updated task data
 */
export const addDocument = async (data: AddDocumentDto): Promise<Task> => {
  try {
    const response = await api.patch<Task>(
      `${endpoints.taches.base}${data.task_id}/`,
      data
    );

    return response.data;
  } catch (error) {
    console.error("Error adding document to task:", error);
    throw error;
  }
};

export const removeMemberFromTask = async (
  task_id: number,
  user_id: number
): Promise<Task> => {
  try {
    const response = await api.delete<Task>(
      `tasks/taches/${task_id}/assigned_members/${user_id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing member from task:", error);
    throw error;
  }
};

export const removeDocumentFromTask = async (
  document_id: number,
  task_id: number
): Promise<Task> => {
  try {
    const response = await api.delete<Task>(
      `tasks/taches/${task_id}/fichiers/${document_id}/`
    );
    return response.data;
  } catch (error) {
    console.error("Error removing document from task:", error);
    throw error;
  }
};

export interface CompteRendu {
    id: number;
    project: number;
    project_details: ProjectDetails;
    title: string;
    description: string;
    compte_rendu: string | null;
    task_type: string;
    task_type_display: string;
    file_url: string | null;
    fichiers_urls: string[];
    assigned_members: TaskUser[];
    creator: TaskUser;
    date_creation: string;
    date_modification: string;
}

/**
 * Fetches tasks that are considered "compte-rendus"
 * @returns A promise that resolves to an array of CompteRendu tasks
 */
export const getCompteRendus = async (): Promise<CompteRendu[]> => {
  try {
    const response = await api.get<CompteRendu[]>(`${endpoints.taches.base}compte-rendu/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching compte rendus", (error as Error).message);
    throw error;
  }
};

/**
 * Updates the compte rendu of a task
 * @param taskId - The ID of the task to update
 * @param compteRendu - The new compte rendu content
 * @returns The updated task data
 */
export const updateCompteRendu = async (
  taskId: number,
  compteRendu: string
): Promise<Task> => {
  try {
    const response = await api.patch<Task>(
      `${endpoints.taches.base}${taskId}/`,
      { compte_rendu: compteRendu }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating compte rendu:", error);
    throw error;
  }
};




