"use client";

import { getCookies } from "@/lib/utils/cookies";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { WebSocketMessage, ConnectionState } from "@/lib/types/websocket";
/**
 * type: string;
    message: string;
    type_message?: string;
    file_url?: string;
 */
export interface WebSocketSendMessage {
  type: string;
  message: string;
  type_message?: string;
  file_url?: string;
}

export const useWebSocket = (conversationId: string) => {
  const [messages, setMessages] = useState<WebSocketMessage[]>([]); // Initialize as empty array
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.DISCONNECTED
  );
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
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
        reconnectAttemptsRef.current = 0; // Reset reconnect attempts on successful connection

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
            const receivedMessage: WebSocketMessage = {
              id: data.message.id,
              content: data.message.content,
              type_message: data.message.type_message,
              sender: data.message.sender,
              timestamp: data.message.timestamp,
              is_read: data.message.is_read,
              fichier: data.message.fichier,
              image: data.message.image,
              audio: data.message.audio,
              status: "received", // Mark incoming messages as received
              room: data.message.room, // Include room from direct messages
              is_deleted: data.message.is_deleted || false, // Add is_deleted, default to false
            };

            setMessages((prevMessages) => {
              if (!Array.isArray(prevMessages)) {
                return [receivedMessage];
              }
              // Prevent duplicates
              if (prevMessages.some((msg) => msg.id === receivedMessage.id)) {
                return prevMessages;
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
        if (
          !event.wasClean &&
          reconnectAttemptsRef.current < maxReconnectAttempts
        ) {
          setConnectionState(ConnectionState.RECONNECTING);

          // Exponential backoff for reconnection (1s, 2s, 4s, 8s, 16s)
          const timeout = Math.min(
            1000 * Math.pow(2, reconnectAttemptsRef.current),
            30000
          );
          console.log(
            `Attempting to reconnect in ${timeout}ms... (Attempt ${
              reconnectAttemptsRef.current + 1
            }/${maxReconnectAttempts})`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current += 1;
            connectWebSocket();
          }, timeout);
        } else {
          setConnectionState(ConnectionState.DISCONNECTED);
          if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
            setConnectionError(
              "Maximum reconnection attempts reached. Please refresh the page."
            );
            toast.error(
              "Connexion perdue. Veuillez rafraîchir la page pour vous reconnecter."
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
  }, [conversationId]);

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
          const formattedMessage = messageData;

          console.log("Sending message:", formattedMessage);
          socketRef.current.send(JSON.stringify(formattedMessage));

          // Optionally add the sent message to the local state with a "sent" status
          // This depends on your server's behavior - if it echoes back messages, you might not need this
        } catch (error) {
          console.error("Failed to send message:", error);
          toast.error("Erreur lors de l'envoi du message. Veuillez réessayer.");
        }
      } else {
        console.warn("WebSocket is not connected");
        toast.error("Non connecté. Message non envoyé.");

        // Attempt to reconnect if disconnected
        if (connectionState === ConnectionState.DISCONNECTED) {
          reconnectAttemptsRef.current = 0;
          connectWebSocket();
        }
      }
    },
    [connectionState, connectWebSocket]
  );

  // Function to manually reconnect
  const reconnect = useCallback(() => {
    closeWebSocket();
    reconnectAttemptsRef.current = 0;
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
