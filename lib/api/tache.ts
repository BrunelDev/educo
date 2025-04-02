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



export const getTasks = async (): Promise<Task[]>=> {
    try {
        const response = await api.get(endpoints.taches.base);
        return response.data;
        
    } catch (error: unknown) {
        console.error("Error fetching tasks", (error as Error).message);
        throw error;
        
    }
}

export const getTaskById = async (id: number): Promise<Task> => {
    try {
        const response = await api.get<Task>(`${endpoints.taches.base}${id}/`);
        return response.data;
        
    } catch (error) {
        console.error("Error fetching task", (error as Error).message);
        throw error;
        
    }
}

export interface CreateTaskDto {
  project: number;
  title: string;
  description: string;
  task_type: TaskType | null;
  file_url?: string;
  assigned_members: number[];
}

export const createTask = async (data: CreateTaskDto): Promise<Task> => {
  try {
    

    const response = await api.post<Task>(
      endpoints.taches.base,
      data,
      
    );
    
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};