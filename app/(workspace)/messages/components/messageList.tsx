/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useGroupWebSocket } from "@/hooks/useGroupWebSocket";
import {
  getMessages,
  getGroupMessages,
} from "@/lib/api/message";
import { WebSocketMessage } from "@/lib/types/websocket";
import { useMessageStore } from "@/store/message";
import { useIntersection } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./messageBox";
import { MessageInput } from "./messageInput";
import { Loader2 } from "lucide-react";
import { useGroupMessageStore } from "@/store/group-message";

export default function MessageList() {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeConversation } = useMessageStore();
  const { activeGroup } = useGroupMessageStore();
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref, entry } = useIntersection({
    root: scrollAreaRef.current,
    threshold: 0.5,
  });

  const isGroup =
    activeGroup &&
    "nom" in activeGroup &&
    activeGroup.nom !== null &&
    activeGroup.nom !== undefined;

  const directConversationId =
    !isGroup && activeConversation?.id ? activeConversation.id.toString() : "";
  const directWs = useWebSocket(directConversationId);

  const groupConversationId =
    isGroup && activeGroup?.id ? activeGroup.id.toString() : "";
  const groupWs = useGroupWebSocket(groupConversationId);

  const { isConnected, messages: messagesFromHook } = isGroup
    ? groupWs
    : directWs;

  const setMessages = isGroup ? groupWs.setMessages : directWs.setMessages;
  /**
   * 
   * @param messageData {
  "recipient_id": "123",
  "content": "Voici une image",
  "type_message": "image",
  "file_url": "https://example.com/image.jpg"
}
   */

  const handleSendMessage = (messageData: {
    type: string;
    message: string;
    type_message?: string;
    file_url?: string;
  }) => {
    if (isGroup) {
      groupWs.sendMessage(messageData);
    } else {
      directWs.sendMessage(messageData);
    }
  };



 /* const normalizeApiMessage = (
    msg: Message
  ): WebSocketMessage => {
    // Use a type guard to safely distinguish between message types
    if ("auteur" in msg) {
      // This is an ApiGroupMessage
      return {
        id: msg.id,
        room: activeGroup!.id, // Group messages from API don't have a room, so we use the active group's ID
        sender: msg.sender,
        content: msg.content,
        timestamp: msg.timestamp,
        type_message: "text", // Group messages are currently text-only from the API
        is_read: true, // Assume incoming group messages are read
        is_deleted: false,
        fichier: msg.fichier,
        image: msg.image,
        audio: msg.audio,
      };
    } else {
      // This is an ApiDirectMessage
      return {
        id: msg.id,
        room: msg.room,
        sender: msg.sender,
        content: msg.content,
        type_message: msg.type_message,
        fichier: msg.fichier,
        image: msg.image,
        audio: msg.audio,
        timestamp: msg.timestamp,
        is_read: msg.is_read,
        is_deleted: msg.is_deleted,
      };
    }
  };*/

  const messages: WebSocketMessage[] = messagesFromHook || [];
  const lastMessageId =
    messages.length > 0 ? messages[messages.length - 1].id : null;

  const fetchMessages = useCallback(
    async (pageNumber: number) => {
      if ((!activeConversation?.id && !activeGroup?.id) || isLoading) {
        return;
      }
      setIsLoading(true);
      try {
        if (isGroup) {
          const groupMessagesResponse = await getGroupMessages(activeGroup.id);
          const normalized = groupMessagesResponse.results;
          const reversed = normalized.slice().reverse();
          setMessages(reversed);
          setHasMore(false);
        } else {
          if (!activeConversation?.id) return;
          const response = await getMessages(activeConversation.id, pageNumber);
          const normalized = response.results;
          setMessages((prev) => {
            const current = Array.isArray(prev) ? prev : [];
            const reversedNew = normalized.slice().reverse();
            return pageNumber === 1
              ? reversedNew
              : [...reversedNew, ...current];
          });
          setHasMore(!!response.next);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversation?.id, activeGroup?.id, hasMore, isLoading, isGroup]
  );

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    if (activeConversation?.id) {
      fetchMessages(1);
    }
  }, [activeConversation?.id]);

  useEffect(() => {
    setMessages([]);
    setPage(1);
    setHasMore(true);
    if (activeGroup?.id) {
      fetchMessages(1);
    }
  }, [activeGroup?.id]);

  useEffect(() => {
    const shouldLoadMore =
      entry?.isIntersecting && hasMore && !isLoading && !isGroup;
    if (shouldLoadMore) {
      setPage((p) => p + 1);
      fetchMessages(page + 1);
    }
  }, [entry?.isIntersecting]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [lastMessageId]);

  if (!activeConversation && !activeGroup) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">
          Sélectionnez une conversation pour commencer
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[calc(100vh-5rem)]">
      <div className="flex-grow">
        <ScrollArea className="h-[calc(100vh-20rem)]" ref={scrollAreaRef} scrollHideDelay={0}>
          {hasMore && !isGroup && (
            <div ref={ref} className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
          )}
          <div className="w-full">
            {messages.map((message, index) => {
              console.log("message-------------", message);
              return (
                <MessageBox
                  key={`${message.timestamp}-${index}`}
                  message={message}
                  isLast={index === messages.length - 1}
                  isGroup={!!isGroup}
                />
              );
            })}
          </div>
          <div ref={messagesEndRef} />
        </ScrollArea>
      </div>
      <div className="flex w-full items-center place-items-end">
        <MessageInput
          onSendMessage={handleSendMessage}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}
