"use client";

import { getCookies } from "@/lib/utils/cookies";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { WebSocketMessage, ConnectionState } from "@/lib/types/websocket";

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
  const isConnectedRef = useRef(false);
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
      const wsUrl = `${process.env.NEXT_PUBLIC_GROUP_WEBSOCKET_URL}${groupId}/?token=${token}`;
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
        isConnectedRef.current = true;
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
          console.log("Received group message from consumer:", data);

          // Based on ClosedGroupConsumer, the structure is flat: { auteur, message, timestamp }
          if (data.message && data.auteur && data.timestamp) {
            const receivedMessage: WebSocketMessage = {
              // WS messages from group consumer don't have an ID. Use timestamp + content as a temporary key.
              id: Date.parse(data.timestamp) + Math.random(), // Or generate a more robust client-side ID
              content: data.message,
              type_message: "text",
              sender: {
                id: 0, // Placeholder ID, real ID might be found by matching email to a user list
                email: data.auteur,
                first_name: data.auteur.split("@")[0], // Best effort display name
                last_name: "",
              },
              timestamp: data.timestamp,
              is_read: true, // For groups, read status is complex. Default to true for incoming.
              status: "received",
              // Add fields from shared WebSocketMessage, defaulting them as they are not in group WS messages
              room: `group_${groupId}`, // Can add a room identifier for context if needed
              is_deleted: false,
              fichier: null,
              image: null,
              audio: null,
            };

            setMessages((prevMessages) => {
              if (!Array.isArray(prevMessages)) return [receivedMessage];
              // Avoid duplicates based on timestamp and content, as ID is not reliable
              if (
                prevMessages.some(
                  (msg) =>
                    msg.timestamp === receivedMessage.timestamp &&
                    msg.content === receivedMessage.content
                )
              ) {
                return prevMessages;
              }
              return [...prevMessages, receivedMessage];
            });
          } else if (data.error) {
            console.error(`Error from group websocket: ${data.error}`);
            toast.error(`Erreur: ${data.error}`);
          } else {
            console.warn("Received unknown group message format:", data);
          }
        } catch (error) {
          console.error("Failed to parse group message:", error);
        }
      };

      ws.onerror = (error) => {
        console.error(`Group WebSocket Error for URL: ${ws.url}`, error);
        setConnectionError("Connection error. Please try again later.");
        setConnectionState(ConnectionState.ERROR);
      };

      ws.onclose = (event) => {
        console.log(
          `Group WebSocket Disconnected: Code=${event.code}, Reason=${event.reason}`,
          event
        );
        const wasConnected = isConnectedRef.current;
        isConnectedRef.current = false;
        setIsConnected(false);
        setMessages((prevMessages) =>
          prevMessages.map((msg) => ({ ...msg, status: "stale" }))
        );

        // Only attempt to reconnect if the connection was previously established
        if (
          wasConnected &&
          !event.wasClean &&
          reconnectAttempts < maxReconnectAttempts &&
          groupId
        ) {
          setConnectionState(ConnectionState.RECONNECTING);
          const timeout = Math.min(
            1000 * Math.pow(2, reconnectAttempts),
            30000
          );
          console.log(
            `Attempting to reconnect group WS in ${timeout}ms... (Attempt ${
              reconnectAttempts + 1
            }/${maxReconnectAttempts})`
          );
          reconnectTimeoutRef.current = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connectWebSocket();
          }, timeout);
        } else if (
          !wasConnected ||
          event.wasClean ||
          reconnectAttempts >= maxReconnectAttempts
        ) {
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
    if (groupId) {
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
  }, [groupId, connectWebSocket]);
  /**
 * 
 * type: string;
    message: string;
    type_message?: string;
    file_url?: string;
 */
  // Function to send a message
  const sendMessage = ({
    type,
    message,
    type_message,
    file_url,
  }: {
    type: string;
    message: string;
    type_message?: string;
    file_url?: string;
  }) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      try {
        // Format for group message sending as per API docs
        const messagePayload = JSON.stringify({
          message: message,
          type_message: type_message,
          file_url: file_url,
          type: type,
        });
        socketRef.current.send(messagePayload);
        console.log("Sent group message:", messagePayload);
        // Optionally, add the sent message to local state immediately with 'sent' status
        // This requires knowing the sender's details (current user) and generating a temporary ID
      } catch (error) {
        console.error("Error sending group message:", error);
        toast.error("Erreur lors de l'envoi du message.");
      }
    } else {
      console.error("Group WebSocket is not connected. Message not sent.");
      toast.error("Non connecté. Message non envoyé.");
    }
  };

  return {
    messages,
    setMessages, // Exporting setMessages to be used in components
    isConnected,
    connectionState,
    connectionError,
    sendMessage,
    connectWebSocket, // Expose connect for manual reconnection if needed
  };
};
