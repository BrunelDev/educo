import { useAuth } from "@/src/hooks/useAuth";
import { WebSocketMessage } from "@/src/services/websocket/WebSocketService";
import { useEffect, useRef, useState } from "react";

interface WebSocketMessage {
  type: string;
  message: string;
  timestamp?: string;
  sender?: {
    id: number;
    username: string;
  };
}

export function useWebSocket(roomId: string) {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!token || !roomId) return;

    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}/ws/chat/${roomId}/`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prev) => [...prev, message]);
    };

    ws.onclose = () => {
      setIsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [roomId, token]);

  const sendMessage = (message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "message",
          message,
        })
      );
    }
  };

  return {
    isConnected,
    messages,
    sendMessage,
  };
}
