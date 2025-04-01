export interface WebSocketMessage {
  type: string;
  message: string;
  timestamp?: string;
  sender?: {
    id: number;
    username: string;
  };
}
