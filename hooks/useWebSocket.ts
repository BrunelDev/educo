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
}

interface WebSocketSendMessage {
  type: string;
  message: string;
  messageType?: string;
}

// WebSocket connection states
export enum ConnectionState {
  CONNECTING = "connecting",
  CONNECTED = "connected",
  DISCONNECTED = "disconnected",
  RECONNECTING = "reconnecting",
  ERROR = "error",
}

export const useWebSocket = (conversationId: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]); // Initialize as empty array
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

  // Function to establish WebSocket connection
  const connectWebSocket = useCallback(() => {
    if (!conversationId) {
      setConnectionState(ConnectionState.DISCONNECTED);
      return;
    }

    // Clear any existing connection timeout
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
    }

    // Set connection state to connecting
    setConnectionState(ConnectionState.CONNECTING);
    setConnectionError(null);

    const token = getCookies("access_token");
    if (!token) {
      setConnectionError("Authentication token missing");
      setConnectionState(ConnectionState.ERROR);
      return;
    }

    try {
      const ws = new WebSocket(
        `${process.env.NEXT_PUBLIC_WEBSOCKET_URL}${conversationId}/?token=${token}`
      );

      // Set connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        if (ws.readyState !== WebSocket.OPEN) {
          console.error("WebSocket connection timeout");
          setConnectionError("Connection timeout. Please try again later.");
          setConnectionState(ConnectionState.ERROR);
          ws.close();
        }
      }, connectionTimeoutMs);

      ws.onopen = () => {
        console.log("WebSocket Connected");
        setIsConnected(true);
        setConnectionState(ConnectionState.CONNECTED);
        setReconnectAttempts(0); // Reset reconnect attempts on successful connection

        // Clear connection timeout
        if (connectionTimeoutRef.current) {
          clearTimeout(connectionTimeoutRef.current);
          connectionTimeoutRef.current = null;
        }
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("Received message:", data);

          if (data.type === "message") {
            // Determine message type and content
            let type_message: "text" | "file" | "image" | "audio" = "text";
            let fichier: string | null = null;
            let image: string | null = null;
            let audio: string | null = null;

            // If messageType is provided, use it to set the correct type and content
            if (data.message.messageType) {
              switch (data.message.messageType) {
                case "image":
                  type_message = "image";
                  image = data.message.content;
                  break;
                case "audio":
                  type_message = "audio";
                  audio = data.message.content;
                  break;
                case "file":
                  type_message = "file";
                  fichier = data.message.content;
                  break;
                default:
                  type_message = "text";
              }
            }

            const receivedMessage: WebSocketMessage = {
              id: data.message.id,
              content: data.message.content,
              type_message: type_message,
              sender: {
                id: data.message.sender.id,
                email: data.message.sender.email,
                first_name: data.message.sender.first_name || "",
                last_name: data.message.sender.last_name || "",
              },
              timestamp: data.message.timestamp,
              is_read: data.message.is_read,
              fichier: fichier,
              image: image,
              audio: audio,
              status: "received",
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

      ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
        setConnectionError("Connection error. Please try again later.");
        setConnectionState(ConnectionState.ERROR);
      };

      ws.onclose = (event) => {
        console.log("WebSocket Disconnected", event);
        setIsConnected(false);

        // Mark messages as stale
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, status: "stale" }))
        );

        // Attempt to reconnect if not closed cleanly and we haven't exceeded max attempts
        if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
          setConnectionState(ConnectionState.RECONNECTING);

          // Exponential backoff for reconnection (1s, 2s, 4s, 8s, 16s)
          const timeout = Math.min(
            1000 * Math.pow(2, reconnectAttempts),
            30000
          );
          console.log(
            `Attempting to reconnect in ${timeout}ms... (Attempt ${
              reconnectAttempts + 1
            }/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connectWebSocket();
          }, timeout);
        } else {
          setConnectionState(ConnectionState.DISCONNECTED);
          if (reconnectAttempts >= maxReconnectAttempts) {
            setConnectionError(
              "Maximum reconnection attempts reached. Please refresh the page."
            );
            toast.error(
              "Connection lost. Please refresh the page to reconnect."
            );
          }
        }
      };

      socketRef.current = ws;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      setConnectionError("Failed to create WebSocket connection");
      setConnectionState(ConnectionState.ERROR);
    }
  }, [conversationId, reconnectAttempts]);

  // Function to gracefully close the WebSocket connection
  const closeWebSocket = useCallback(() => {
    if (socketRef.current) {
      try {
        // Only send a close message if the connection is open
        if (socketRef.current.readyState === WebSocket.OPEN) {
          // Send a disconnect message if needed by your server
          socketRef.current.send(
            JSON.stringify({
              type: "disconnect",
              message: "User navigated away",
            })
          );

          // Close with a normal closure code and reason
          socketRef.current.close(1000, "User navigated away");
        } else {
          // If not open, just close it
          socketRef.current.close();
        }
      } catch (error) {
        console.error("Error closing WebSocket:", error);
      }
    }

    // Clear any pending timeouts
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current);
      connectionTimeoutRef.current = null;
    }

    setIsConnected(false);
    setConnectionState(ConnectionState.DISCONNECTED);
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    connectWebSocket();

    // Cleanup function to close WebSocket when component unmounts
    return () => {
      closeWebSocket();
    };
  }, [connectWebSocket, closeWebSocket]);

  // Function to send messages
  const sendMessage = useCallback(
    (messageData: WebSocketSendMessage) => {
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        try {
          // Format message to match server expectations
          const formattedMessage = {
            type: messageData.type,
            message: messageData.message,
            messageType: messageData.messageType || "text", // Include messageType if provided
          };

          console.log("Sending message:", formattedMessage);
          socketRef.current.send(JSON.stringify(formattedMessage));

          // Optionally add the sent message to the local state with a "sent" status
          // This depends on your server's behavior - if it echoes back messages, you might not need this
        } catch (error) {
          console.error("Failed to send message:", error);
          toast.error("Failed to send message. Please try again.");
        }
      } else {
        console.warn("WebSocket is not connected");
        toast.error("You are currently offline. Please wait for reconnection.");

        // Attempt to reconnect if disconnected
        if (connectionState === ConnectionState.DISCONNECTED) {
          setReconnectAttempts(0);
          connectWebSocket();
        }
      }
    },
    [connectionState, connectWebSocket]
  );

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    closeWebSocket();
    setReconnectAttempts(0);
    setConnectionError(null);
    connectWebSocket();
  }, [closeWebSocket, connectWebSocket]);

  return {
    isConnected,
    connectionState,
    connectionError,
    messages,
    sendMessage,
    setMessages,
    reconnect,
  };
};
