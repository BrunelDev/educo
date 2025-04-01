import { useAuth } from "@/hooks/useAuth";
import {
  WebSocketMessage,
  WebSocketService,
} from "@/services/websocket/WebSocketService";
import { useEffect, useRef, useState } from "react";

export function useWebSocket(roomId: string) {
  const { token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const wsRef = useRef<WebSocketService | null>(null);

  useEffect(() => {
    if (!token || !roomId) return;

    // Initialiser le service WebSocket
    const baseUrl = process.env.NEXT_PUBLIC_WS_URL || "ws://localhost:8000";
    wsRef.current = new WebSocketService(baseUrl);

    // Gérer les messages
    const unsubscribeMessage = wsRef.current.onMessage((message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Gérer les changements de connexion
    const unsubscribeConnection = wsRef.current.onConnectionChange(
      (connected) => {
        setIsConnected(connected);
      }
    );

    // Se connecter au WebSocket
    wsRef.current.connect(roomId, token);

    // Nettoyer lors du démontage
    return () => {
      unsubscribeMessage();
      unsubscribeConnection();
      wsRef.current?.disconnect();
    };
  }, [roomId, token]);

  const sendMessage = (message: string) => {
    if (!wsRef.current) return;
    wsRef.current.send(message);
  };

  return {
    isConnected,
    messages,
    sendMessage,
  };
}
