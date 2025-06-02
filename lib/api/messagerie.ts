
import api from "../api";

export interface Group {
  id: number;
  nom: string;
  description?: string;
  membres: number[]; 
}

export interface CreateGroupPayload {
  nom: string;
  description?: string;
  membres: number[];
}

export interface GroupResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Group[];
}

export const getGroups = async (): Promise<GroupResponse> => {
  try {
    const response = await api.get(`messagerie/groupes-fermes/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching groups:", error);
    throw error;
  }
}


export const createGroup = async (payload: CreateGroupPayload): Promise<Group> => {
  try {
    const response = await api.post(`messagerie/groupes-fermes/`, payload);
    return response.data;
    
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};


export const addGroupMember = async (groupId: number, userId: number): Promise<void> => {
  try {
    const response = await api.post(`messagerie/groupes-fermes/${groupId}/add_member/`, { user_id: userId });
    return response.data;
  } catch (error) {
    console.error("Error adding member to group:", error);
    throw error;
  }
};

export const removeGroupMember = async (groupId: number, userId: number): Promise<void> => {
  try {
    const response = await api.delete(`messagerie/groupes-fermes/${groupId}/remove_member/`, { data: { user_id: userId }});
    return response.data;
  } catch (error) {
    console.error("Error removing member from group:", error);
    throw error;
  }
};

export interface SendMessagePayload {
  contenu: string;
}


import { WebSocketMessage } from '@/hooks/useWebSocket'; 


export const sendGroupMessageREST = async (groupId: number, payload: SendMessagePayload): Promise<WebSocketMessage> => {
  try {
    const response = await api.post(`messagerie/groupes-fermes/${groupId}/messages/`, payload);
    return response.data;
  } catch (error) {
    console.error("Error sending message to group:", error);
    throw error;
  }
};
