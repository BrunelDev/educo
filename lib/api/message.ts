import api, { endpoints } from "../api";
import { MessageType} from "../types";

export interface Sender {
  id: number;
  email: string;
  name: string;
  image: string | null;
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
   content?: string;
   type_message: MessageType;
   fichier?: {
     url: string;
     name: string;
     type: string;
   };
   image?: {
     url: string;
     name: string;
     dimensions?: {
       width: number;
       height: number;
     };
   };
   audio?: {
     url: string;
     name: string;
     duration?: number;
   };
   timestamp: Date;
   is_read: boolean;
   is_deleted: boolean
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

export interface Group {
  id: number;
  nom: string;
  description: string | null;
  membres: Sender[];
  dernier_message: GroupMessage | null;
}

export interface GroupMessage {
  id: number;
  contenu: string;
  auteur: Sender;
  timestamp: string;
}

export interface ConversationResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Conversation[];
}

export interface GroupResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Group[];
}

export const getGroups = async (): Promise<GroupResponse> => {
  const response = await api.get<GroupResponse>(endpoints.messagerie.groupes);
  return response.data;
};

interface GroupMessageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Message[];
}

export const getGroupMessages = async (
  groupId: number
): Promise<GroupMessageResponse> => {
  const response = await api.get<GroupMessageResponse>(
    `${endpoints.messagerie.groupes}${groupId}/messages/`
  );
  return response.data;
};

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
  results: Message[];
}

export const getMessages = async (
  roomId: number,
  page: number = 1
): Promise<MessageApiResponse> => {
  try {
    //messagerie/room_id/messages/
    const response = await api.get<MessageApiResponse>(
      `${endpoints.messagerie.base}${roomId}/messages/?page=${page}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};
