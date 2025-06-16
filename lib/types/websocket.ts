export interface MessageSender {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WebSocketMessage {
  id: number;
  content: string;
  type_message: "text" | "file" | "image" | "audio";
  sender: MessageSender;
  timestamp: string;
  is_read: boolean;
  fichier?: string | null;
  image?: string | null;
  audio?: string | null;
  status?: "sent" | "received" | "stale";
  room?: string; // from direct messages
  is_deleted?: boolean; // from direct messages
}

export enum ConnectionState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}
