import api, { endpoints } from "../api";

export type TaskType = "a_faire" | "en_cours" | "termine";

export interface TaskUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface ProjectDetails {
  id: number;
  title: string;
}

export interface Task {
  id: number;
  project: number;
  project_details: ProjectDetails;
  title: string;
  description: string;
  task_type: TaskType;
  task_type_display: string;
  file_url: string | null;
  assigned_members: TaskUser[];
  creator: TaskUser;
  date_creation: string;
  date_modification: string;
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
  file_url?: string;
  assigned_member_ids: number[];
}

export const createTask = async (data: CreateTaskDto): Promise<Task> => {
  try {
    console.error(data);
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
  file_url?: string;
  assigned_members?: number[];
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
      file_url: taskData.file_url || "",
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
    // First get the current task data
    const taskData = await getTaskById(data.task_id);

    // Prepare the PUT request payload with all required fields
    const payload = {
      project: taskData.project,
      title: taskData.title,
      description: taskData.description,
      task_type: taskData.task_type,
      file_url: data.file_url,
      assigned_member_ids: taskData.assigned_members.map((member) => member.id),
    };

    // Send the PUT request
    const response = await api.put<Task>(
      `${endpoints.taches.base}${data.task_id}/`,
      payload
    );

    return response.data;
  } catch (error) {
    console.error("Error adding document to task:", error);
    throw error;
  }
};
