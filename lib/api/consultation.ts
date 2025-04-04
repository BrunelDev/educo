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
  fichier: string;
  nom_fichier: string;
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
  participants: {
    id: number;
    email: string;
    nom_complet: string;
    photo: string;
}[];
  documents: Document[];
  commentaires: Comment[];
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

export const updateConsultationStatus = async (
  id: number,
  statut: ConsultationStatus
) => {
  try {
    const response = await api.patch(`${endpoints.consultations.base}${id}/`, {
      statut,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error updating consultation", (error as Error).message);
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
