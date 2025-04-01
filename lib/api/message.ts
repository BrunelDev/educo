import { WebSocketMessage } from "@/hooks/useWebSocket";
import api, { endpoints } from "../api";

export interface Sender {
  id: number;
  email: string;
  type_utilisateur: "EMPLOYE" | "ADMIN" | "MEMBRE_CSE";
  telephone: string;
  date_creation: string;
  date_modification: string;
  is_active: boolean;
}

export interface Participant {
  _id: number;
  name: string;
  avatar: string | null;
}

export interface Message {
  id: number;
  room: number;
  sender: Sender;
  content: string;
  type_message: "text" | "file" | "image" | "audio";
  fichier: string | null;
  image: string | null;
  audio: string | null;
  timestamp: string;
  is_read: boolean;
  is_deleted: boolean;
}

export interface Conversation {
  id: number;
  user1: number;
  user2: number;
  title: string;
  messages: Message[];
  unread_count: number;
  derniere_activite: string;
  participants: Participant[];
}

export interface ConversationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Conversation[];
}

export const getConversationList = async (): Promise<ConversationResponse> => {
  try {
    const response = await api.get(endpoints.messagerie.base);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching conversation list", (error as Error).message);
    throw error;
  }
};

export const getConversationById = async (
  id: number
): Promise<Conversation> => {
  try {
    const response = await api.get(`${endpoints.messagerie.base}${id}/`);
    return response.data;
  } catch (error: unknown) {
    console.error("Error fetching conversation", (error as Error).message);
    throw error;
  }
};

export const createConversation = async (
  id_1: number,
  id_2: number
): Promise<Conversation> => {
  try {
    const response = await api.post(endpoints.messagerie.base, {
      user1: id_1,
      user2: id_2,
    });
    return response.data;
  } catch (error: unknown) {
    console.error("Error creating conversation", (error as Error).message);
    throw error;
  }
};

export interface MessageApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: WebSocketMessage[];
}

export const getMessages = async (
  roomId: number,
  page: number = 1,
): Promise<MessageApiResponse> => {
  try {
    const response = await api.get<MessageApiResponse>(
      `${endpoints.messagerie.base}${roomId}/messages/?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
