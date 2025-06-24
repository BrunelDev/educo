import { Sender } from "../api/message";
import { MessageType } from "../types";

export interface MessageSender {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WebSocketMessage {
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

export enum ConnectionState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}
