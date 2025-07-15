import { MeetingFormState } from "@/store/meetingForm";
import api, { endpoints } from "../api";
import { Meeting, MeetingType } from "../types";
const endpoint = endpoints.meetings;

// Interface for partial meeting updates
export interface UpdateMeetingDto {
  // Include fields from MeetingFormState but make them optional
  compte_rendu?: string;
  type_reunion?: MeetingType;
  titre?: string;
  objet?: string;
  emplacement?: string;
  lien_reunion?: string;
  date_heure?: string;
  frequence?: string;
  documents?: Array<{
    fichier: string;
    nom_fichier: string;
    type_document: string;
  }>;
  ordre_du_jour?: Array<{
    description: string;
  }>;
  // Override participants with the format used in API calls
  participants?: number[];
  id?: number;
}

interface MeetingsApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Meeting[];
}
export const getMeetings = async (
  page: number = 1
): Promise<MeetingsApiResponse> => {
  try {
    const response = await api.get(endpoint.list, {
      params: {
        page,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching meetings", error);
    throw error;
  }
};

export const getOneMeting = async (id: number): Promise<Meeting> => {
  try {
    const response = await api.get(`${endpoint.list}${id}/`);
    console.log("---TEST---", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching meeting", error);
    throw error;
  }
};

export const createMeeting = async (meeting: MeetingFormState) => {
  try {
    const response = await api.post(endpoint.create, meeting);
    return response.data;
  } catch (error) {
    console.error("Error creating meeting", error);
    throw error;
  }
};

/**
 * Update an existing meeting with partial data
 * @param id The ID of the meeting to update
 * @param updateData The partial data to update the meeting with
 * @returns The updated meeting data
 */
export const updateMeeting = async (
  id: number,
  updateData: UpdateMeetingDto
): Promise<Meeting> => {
  try {
    const response = await api.patch<Meeting>(
      `${endpoint.list}${id}/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating meeting", error);
    throw error;
  }
};

/**
 * Delete a meeting by ID
 * @param id The ID of the meeting to delete
 * @returns The response from the server
 */
export const deleteMeeting = async (id: number): Promise<void> => {
  try {
    await api.delete(`${endpoint.list}${id}/`);
  } catch (error) {
    console.error("Error deleting meeting", error);
    throw error;
  }
};

/**
 * Interface for document data when adding to a meeting using POST
 */
export interface DocumentPostDto {
  reunion: number;
  nom_fichier: string;
  fichier: string;
  type_document: string;
}

/**
 * Interface for document response
 */
export interface DocumentResponse {
  id: number;
  reunion: number;
  nom_fichier: string;
  fichier: string;
  type_document: string;
  date_creation: string;
  date_modification: string;
}

/**
 * Add a document to a meeting using a POST request
 * @param document Document data containing meeting ID, filename, file URL, and document type
 * @returns The created document data
 */
export const addDocument = async (
  document: DocumentPostDto
): Promise<DocumentResponse> => {
  try {
    const response = await api.post<DocumentResponse>(
      endpoint.documents,
      document
    );
    return response.data;
  } catch (error) {
    console.error("Error adding document to meeting:", error);
    throw error;
  }
};

export const removeDocumentFromMeeting = async (
  document_id: number
): Promise<DocumentResponse> => {
  try {
    const response = await api.delete<DocumentResponse>(
      `reunion/documents/${document_id}/`
      
    );
    return response.data;
  } catch (error) {
    console.error("Error removing document from meeting:", error);
    throw error;
  }
};

export const addMemberToMeeting = async (
  meeting_id: number,
  user_id: number[]
): Promise<Meeting  > => {
  try {
    const response = await api.post<Meeting>(
      `reunion/reunions/${meeting_id}/participants/`,
      {
        participants: user_id,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding member to meeting:", error);
    throw error;
  }
};
