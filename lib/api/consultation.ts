import api, { endpoints } from "../api";

export type ConsultationType =
  | "Orientations stratégiques de l'entreprise"
  | "Situation économique et financière"
  | "Politique sociale";

export type ConsultationStatus = "En attente" | "En cours" | "Terminé";

export interface Creator {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Document {
  id: number;
  url: string;
  nom: string;
}

export interface Comment {
  id: number;
  contenu: string;
  date_creation: string;
  utilisateur: Creator;
}

export interface Consultation {
  id: number;
  type_consultation: ConsultationType;
  type_consultation_display: string;
  description: string;
  date_creation: string;
  date_requise: string;
  date_modification: string;
  statut: ConsultationStatus;
  statut_display: string;
  createur: Creator;
  participants_details: {
    utilisateur_details: {
      id: number;
      email: string;
      nom_complet: string;
      photo: string;
    };
  }[];
  documents: Document[];
  commentaires: Comment[];
  compte_rendu?: string;
}

/*export interface ConsultationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Consultation[];
}*/

export const getConsultations = async (): Promise<Consultation[]> => {
  try {
    const response = await api.get(endpoints.consultations.base);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching consultations", (error as Error).message);
    throw error;
  }
};

/**
 * Interface for document data when adding to a consultation
 */
export interface AddDocumentDto {
  fichier: string;
  nom_fichier: string;
}

/**
 * Interface for updating a consultation
 * All fields are optional to allow partial updates
 */
export interface UpdateConsultationDto {
  type_consultation?: ConsultationType;
  description?: string;
  date_requise?: string;
  statut?: ConsultationStatus;
  participants?: number[];
  documents?: AddDocumentDto[]; // Add documents to the consultation
  compte_rendu?: string;
}

/**
 * Updates a consultation with the provided data
 * @param id - The ID of the consultation to update
 * @param data - The data to update the consultation with
 * @returns The updated consultation data
 */
export const updateConsultation = async (
  id: number,
  data: UpdateConsultationDto
): Promise<Consultation> => {
  try {
    const response = await api.patch<Consultation>(
      `${endpoints.consultations.base}${id}/`,
      data
    );
    console.log("res", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating consultation", (error as Error).message);
    throw error;
  }
};

/**
 * @deprecated Use updateConsultation instead
 * Updates only the status of a consultation
 */
export const updateConsultationStatus = async (
  id: number,
  statut: ConsultationStatus
): Promise<Consultation> => {
  console.warn(
    "updateConsultationStatus is deprecated. Use updateConsultation instead."
  );
  return updateConsultation(id, { statut });
};

/**
 * Adds multiple documents to a consultation
 * @param id - The ID of the consultation to update
 * @param documents - Array of documents to add
 * @returns The updated consultation data
 */
export const addDocumentsToConsultation = async (
  id: number,
  documents: AddDocumentDto[]
): Promise<Consultation> => {
  return updateConsultation(id, { documents });
};

/**
 * Interface for document data when adding to a consultation using the new POST endpoint
 */
export interface DocumentPostDto {
  nom: string;
  url: string;
  consultation: number;
}

/**
 * Adds a single document to a consultation using the new POST endpoint
 * @param document - Document data containing name, url, and consultation ID
 * @returns The created document data
 */
export const addDocument = async (
  document: DocumentPostDto
): Promise<Document> => {
  try {
    const response = await api.post<Document>(
      `${endpoints.consultations.base}documents/`,
      document
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      "Error adding document to consultation",
      (error as Error).message
    );
    throw error;
  }
};



/**
 * Removes a document from a consultation by its ID
 * @param documentId - The ID of the document to remove
 * @returns The updated consultation data
 */
export const removeDocumentFromConsultation = async (
  documentId: number
): Promise<Consultation> => {
  try {
    const response = await api.delete<Consultation>(
      `/consultations/documents/${documentId}/`
    );
    return response.data;
  } catch (error: unknown) {
    console.error(
      "Error removing document from consultation",
      (error as Error).message
    );
    throw error;
  }
};

export interface Creator {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface Document {
  id: number;
  fichier: string;
  nom_fichier: string;
}

export interface Comment {
  id: number;
  contenu: string;
  date_creation: string;
  utilisateur: Creator;
}

export const getOneConsultation = async (id: number): Promise<Consultation> => {
  try {
    const response = await api.get(`${endpoints.consultations.base}${id}/`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching consultation", (error as Error).message);
    throw error;
  }
};

export interface CreateConsultationDto {
  type_consultation: string;
  description: string;
  date_requise: string;
  statut: string;
  participants: number[];
}

export const createConsultation = async (
  data: CreateConsultationDto
): Promise<Consultation> => {
  try {
    const response = await api.post<Consultation>(
      `${endpoints.consultations.base}`,
      {
        ...data,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating consultation", error);
    throw error;
  }
};

export const deleteConsultation = async (id: number): Promise<void> => {
  try {
    await api.delete(`${endpoints.consultations.base}${id}/`);
    // Successful deletion (e.g., 204 No Content) will not return data.
    // Axios delete method typically resolves for 2xx status codes and rejects for others.
  } catch (error) {
    // Log the error with context for easier debugging
    console.error(`Error deleting consultation with ID ${id}:`, error);
    throw error; // Re-throw the error so it can be caught and handled by the calling component (e.g., to show a toast notification)
  }
};

export const removeMemberFromConsultation = async (consultation_id: number, user_id: number): Promise<void> => {
  try {
    await api.delete(`consultations/${consultation_id}/participants/${user_id}/`);
    // Successful deletion (e.g., 204 No Content) will not return data.
    // Axios delete method typically resolves for 2xx status codes and rejects for others.
  } catch (error) {
    // Log the error with context for easier debugging
    console.error(`Error deleting consultation with ID ${consultation_id}:`, error);
    throw error; // Re-throw the error so it can be caught and handled by the calling component (e.g., to show a toast notification)
  }
};
