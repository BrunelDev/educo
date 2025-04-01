export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  AUDIO = "audio",
  FILE = "file",
}

export interface Message {
  id: number;
  content: string;
  type: MessageType;
  timestamp: string;
  sender_id: number;
  receiver_id: number;
  is_deleted: boolean;
}

export interface WebSocketMessage {
  type: string;
  message: string;
  timestamp?: string;
  sender?: {
    id: number;
    username: string;
  };
  messageType?: MessageType;
  fileData?: {
    type: MessageType;
    content: string;
    filename: string;
  };
}
