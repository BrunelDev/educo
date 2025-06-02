"use client";

import { getCookies } from "@/lib/utils/cookies";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export interface MessageSender {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface WebSocketMessage {
  id: number; // Assuming group messages also have a unique ID
  content: string;
  type_message: "text" | "file" | "image" | "audio"; // Kept for consistency, but group might be text-only via WS
  sender: MessageSender;
  timestamp: string;
  is_read?: boolean; // May not be applicable or handled differently for groups
  fichier?: string | null;
  image?: string | null;
  audio?: string | null;
  status?: "sent" | "received" | "stale";
}

// WebSocket connection states
export enum ConnectionState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}

export const useGroupWebSocket = (groupId: string | number | null) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const maxReconnectAttempts = 5;
  const connectionTimeoutMs = 10000; // 10 seconds

  const connectWebSocket = useCallback(() => {
    if (!groupId) {
      setConnectionState(ConnectionState.DISCONNECTED);
      return;
    }

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

    setConnectionState(ConnectionState.CONNECTING);
    setConnectionError(null);

    const token = getCookies("access_token");
    if (!token) {
      setConnectionError("Authentication token missing");
      setConnectionState(ConnectionState.ERROR);
      return;
    }

    try {
      // IMPORTANT: URL changed for group WebSockets
      const wsUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}groupes-fermes/${groupId}/?token=${token}`;
      console.log("Connecting to Group WebSocket:", wsUrl);
      const ws = new WebSocket(wsUrl);

      connectionTimeoutRef.current = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.error("Group WebSocket connection timeout");
          setConnectionError("Connection timeout. Please try again later.");
          setConnectionState(ConnectionState.ERROR);
          ws.close();
        }
      }, connectionTimeoutMs);

      ws.onopen = () => {
        console.log("Group WebSocket Connected");
        setIsConnected(true);
        setConnectionState(ConnectionState.CONNECTED);
        setReconnectAttempts(0);

        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received group message:", data);

          // TODO: CRITICAL - Confirm the structure of incoming group messages from the backend.
          // The current parsing assumes a structure like: data.message.content, data.message.sender, etc.
          // This might be different for group messages (e.g., data.content, data.sender directly).
          
          // Assuming the message content is nested under a 'message' key, similar to individual chats but potentially simpler.
          // If the structure is flat (e.g. data.content, data.sender), this needs adjustment.
          if (data.message && data.message.content && data.message.sender) { 
            const receivedMessage: WebSocketMessage = {
              id: data.message.id, // Ensure group messages have an ID
              content: data.message.content,
              type_message: "text", // Assuming group WS messages are text for now
              sender: {
                id: data.message.sender.id,
                email: data.message.sender.email,
                first_name: data.message.sender.first_name || "",
                last_name: data.message.sender.last_name || "",
              },
              timestamp: data.message.timestamp, // Ensure timestamp is provided
              // is_read might not be directly applicable or handled differently
              status: "received",
            };

            setMessages((prevMessages) => {
              if (!Array.isArray(prevMessages)) return [receivedMessage];
              // Prevent duplicate messages by ID if messages can be re-fetched or resent
              if (prevMessages.some(msg => msg.id === receivedMessage.id)) return prevMessages;
              return [...prevMessages, receivedMessage];
            });
          } else if (data.content && data.sender) { // Fallback for a flatter structure
            const receivedMessage: WebSocketMessage = {
              id: data.id, 
              content: data.content,
              type_message: "text", 
              sender: {
                id: data.sender.id,
                email: data.sender.email,
                first_name: data.sender.first_name || "",
                last_name: data.sender.last_name || "",
              },
              timestamp: data.timestamp, 
              status: "received",
            };
            setMessages((prevMessages) => {
              if (!Array.isArray(prevMessages)) return [receivedMessage];
              if (prevMessages.some(msg => msg.id === receivedMessage.id)) return prevMessages;
              return [...prevMessages, receivedMessage];
            });
          } else {
            console.warn("Received unknown group message format:", data);
          }
        } catch (error) {
          console.error("Failed to parse group message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error("Group WebSocket Error:", error);
        setConnectionError("Connection error. Please try again later.");
        setConnectionState(ConnectionState.ERROR);
      };

      ws.onclose = (event) => {
        console.log("Group WebSocket Disconnected", event);
        setIsConnected(false);
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, status: "stale" }))
        );

        if (!event.wasClean && reconnectAttempts < maxReconnectAttempts && groupId) { // Added groupId check
          setConnectionState(ConnectionState.RECONNECTING);
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
          console.log(
            `Attempting to reconnect group WS in ${timeout}ms... (Attempt ${reconnectAttempts + 1}/${maxReconnectAttempts})`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connectWebSocket();
          }, timeout);
        } else if (event.wasClean || reconnectAttempts >= maxReconnectAttempts) {
          setConnectionState(ConnectionState.DISCONNECTED);
        }
      };

      socketRef.current = ws;
    } catch (error) {
      console.error("Failed to create Group WebSocket:", error);
      setConnectionError("Failed to initialize connection.");
      setConnectionState(ConnectionState.ERROR);
    }
  }, [groupId, reconnectAttempts]);

  // Effect to connect and disconnect WebSocket
  useEffect(() => {
    if (groupId && connectionState === ConnectionState.DISCONNECTED && reconnectAttempts === 0) {
      connectWebSocket();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current);
      }
      if (socketRef.current) {
        console.log("Closing Group WebSocket connection (useEffect cleanup)");
        socketRef.current.close(1000, "Component unmounting"); // 1000 is normal closure
        socketRef.current = null;
        setIsConnected(false);
        setConnectionState(ConnectionState.DISCONNECTED);
      }
    };
  }, [groupId, connectWebSocket, connectionState, reconnectAttempts]);

  // Function to send a message
  const sendMessage = (text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        // Format for group message sending as per API docs
        const messagePayload = JSON.stringify({ message: text });
        socketRef.current.send(messagePayload);
        console.log("Sent group message:", messagePayload);
        // Optionally, add the sent message to local state immediately with 'sent' status
        // This requires knowing the sender's details (current user) and generating a temporary ID
      } catch (error) {
        console.error("Error sending group message:", error);
        toast.error("Failed to send message.");
      }
    } else {
      console.error("Group WebSocket is not connected. Message not sent.");
      toast.error("Not connected. Message not sent.");
    }
  };

  return {
    messages,
    isConnected,
    connectionState,
    connectionError,
    sendMessage,
    connectWebSocket, // Expose connect for manual reconnection if needed
  };
};
