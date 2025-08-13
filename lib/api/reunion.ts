import { MeetingFormState } from "@/store/meetingForm";
import api, { endpoints } from "../api";
import { Meeting, MeetingType } from "../types";

// Comment-related interfaces
export interface CommentAuthor {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  nom_complet: string;
}

export interface Comment {
  id: number;
  reunion: number;
  auteur: CommentAuthor;
  contenu: string;
  date_creation: string;
  date_modification: string;
  parent: number | null;
  reponses: Comment[];
  est_reponse: boolean;
  niveau_profondeur: number;
}

export interface CreateCommentDto {
  reunion: number;
  contenu: string;
  parent?: number | null;
}

export interface UpdateCommentDto {
  contenu: string;
}

export interface CommentsListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Comment[];
}
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
 * Delete a meeting by ID
 * @param id The ID of the meeting to delete
 * @param participant_id The ID of the participant to delete
 * @returns The response from the server
 */
export const deleteParticipantFromMeeting = async (
  id: number,
  participant_id: number
): Promise<void> => {
  try {
    await api.delete(`${endpoint.list}${id}/`, {
      data: {
        participant_id,
      },
    });
  } catch (error) {
    console.error("Error deleting participant from meeting", error);
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
): Promise<Meeting> => {
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

// ====================================================================
//                           COMMENT FUNCTIONS
// ====================================================================

/**
 * Create a new comment for a meeting
 * @param commentData The comment data to create
 * @returns The created comment
 */
export const createComment = async (
  commentData: CreateCommentDto
): Promise<Comment> => {
  try {
    const response = await api.post("/reunion/commentaires/creer/", commentData);
    return response.data;
  } catch (error) {
    console.error("Error creating comment:", error);
    throw error;
  }
};

/**
 * Get all comments for a specific meeting
 * @param reunionId The ID of the meeting
 * @returns List of comments for the meeting
 */
export const getMeetingComments = async (
  reunionId: number
): Promise<CommentsListResponse> => {
  try {
    const response = await api.get(`/reunion/reunions/${reunionId}/commentaires/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meeting comments:", error);
    throw error;
  }
};

/**
 * Get a specific comment by ID
 * @param commentId The ID of the comment
 * @returns The comment data with replies
 */
export const getComment = async (commentId: number): Promise<Comment> => {
  try {
    const response = await api.get(`/reunion/commentaires/${commentId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comment:", error);
    throw error;
  }
};

/**
 * Update a comment's content
 * @param commentId The ID of the comment to update
 * @param updateData The new content for the comment
 * @returns The updated comment content
 */
export const updateComment = async (
  commentId: number,
  updateData: UpdateCommentDto
): Promise<{ contenu: string }> => {
  try {
    const response = await api.patch(
      `/reunion/commentaires/${commentId}/`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating comment:", error);
    throw error;
  }
};

/**
 * Delete a comment
 * @param commentId The ID of the comment to delete
 * @returns Promise that resolves when comment is deleted
 */
export const deleteComment = async (commentId: number): Promise<void> => {
  try {
    await api.delete(`/reunion/commentaires/${commentId}/`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};

/**
 * Get a meeting with its comments (using the meeting endpoint that includes comments)
 * @param reunionId The ID of the meeting
 * @returns The meeting data including comments
 */
export const getMeetingWithComments = async (reunionId: number): Promise<Meeting> => {
  try {
    const response = await api.get(`/reunion/reunions/${reunionId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching meeting with comments:", error);
    throw error;
  }
};
