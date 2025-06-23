import { api } from "../api";

export interface Actuality {
  id: number;
  title: string;
  description: string;
  content: string; // Assuming 'content' holds the main detailed article body
  source: string;
  source_url: string;
  publication_date: string;
  image_url: string;
  is_from_rss: boolean;
  created_at: string;
  updated_at: string;
}

export const getActualiteById = async (id: number | string): Promise<Actuality> => {
  try {
    const response = await api.get<Actuality>(`actualites/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching actuality with id ${id}:`, error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
