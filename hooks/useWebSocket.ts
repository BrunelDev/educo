"use client";

import { getCookies } from "@/lib/utils/cookies";
import { useCallback, useEffect, useRef, useState } from "react";

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
}

interface WebSocketSendMessage {
  type: string;
  message: string;
}

export const useWebSocket = (conversationId: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]); // Initialize as empty array
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!conversationId) return;

    const token = getCookies("access_token");
    console.log("Token", token);
    const ws = new WebSocket(
      `wss://impact-cse-backend-0-5.onrender.com/ws/chat/${conversationId}/?token=${token}`
    );

    ws.onopen = () => {
      console.log("WebSocket Connected");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received message:", data);

        if (data.type === "message") {
          const receivedMessage: WebSocketMessage = {
            id: data.message.id,
            content: data.message.content,
            type_message: "text", // default to text for now
            sender: {
              id: data.message.sender.id,
              email: data.message.sender.email,
              first_name: data.message.sender.first_name || "",
              last_name: data.message.sender.last_name || "",
            },
            timestamp: data.message.timestamp,
            is_read: data.message.is_read,
            fichier: null,
            image: null,
            audio: null,
          };

          setMessages((prevMessages) => {
            if (!Array.isArray(prevMessages)) {
              return [receivedMessage];
            }
            return [...prevMessages, receivedMessage];
          });
        }
      } catch (error) {
        console.error("Failed to parse message:", error);
      }
    };

    ws.onclose = () => {
      console.log("WebSocket Disconnected");
      setIsConnected(false);
    };

    socketRef.current = ws;

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [conversationId]);

  const sendMessage = useCallback((messageData: WebSocketSendMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      try {
        // Format message to match server expectations
        const formattedMessage = {
          type: messageData.type,
          message: messageData.message,
        };

        console.log("Sending message:", formattedMessage);
        socketRef.current.send(JSON.stringify(formattedMessage));
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    } else {
      console.warn("WebSocket is not connected");
    }
  }, []);

  return {
    isConnected,
    messages,
    sendMessage,
    setMessages,
  };
};
