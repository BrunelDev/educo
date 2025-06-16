/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/hooks/useWebSocket";
import { useGroupWebSocket } from "@/hooks/useGroupWebSocket";
import {
  getMessages,
  getGroupMessages,
  Message as ApiDirectMessage,
  GroupMessage as ApiGroupMessage,
  Sender as ApiSenderType,
} from "@/lib/api/message";
import { WebSocketMessage, MessageSender } from "@/lib/types/websocket";
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

  const {
    isConnected,
    messages: messagesFromHook,
  } = isGroup ? groupWs : directWs;

  const setMessages = isGroup ? groupWs.setMessages : directWs.setMessages;

  const handleSendMessage = (messageData: {
    type: string;
    message: string;
    messageType?: string;
  }) => {
    if (isGroup) {
      groupWs.sendMessage(messageData.message);
    } else {
      directWs.sendMessage({
        type: "message",
        message: messageData.message,
        messageType: messageData.messageType || "text",
      });
    }
  };

  const mapApiSenderToHookSender = (
    apiSender: ApiSenderType & {
      first_name?: string;
      last_name?: string;
      image?: string;
    }
  ): MessageSender => {
    return {
      id: apiSender.id,
      email: apiSender.email,
      first_name: apiSender.first_name || "",
      last_name: apiSender.last_name || "",
    };
  };

  const normalizeApiMessage = (
    msg: ApiDirectMessage | ApiGroupMessage
  ): WebSocketMessage => {
    if (isGroup) {
      // ApiGroupMessage
      console.log("msg", msg);
      const apiGroupMessage = msg as ApiGroupMessage;
      return {
        id: apiGroupMessage.id,
        content: apiGroupMessage.contenu,
        sender: mapApiSenderToHookSender(apiGroupMessage.auteur),
        timestamp: apiGroupMessage.timestamp,
        type_message: "text",
        is_read: true,
        status: "received",
        fichier: null,
        image: null,
        audio: null,
      };
    } else {
      // ApiDirectMessage
      const apiDirectMessage = msg as ApiDirectMessage;
      return {
        id: apiDirectMessage.id,
        content: apiDirectMessage.content,
        sender: mapApiSenderToHookSender(apiDirectMessage.sender),
        timestamp: apiDirectMessage.timestamp,
        type_message: apiDirectMessage.type_message,
        is_read: apiDirectMessage.is_read,
        status: "received",
        fichier: apiDirectMessage.fichier,
        image: apiDirectMessage.image,
        audio: apiDirectMessage.audio,
      };
    }
  };

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
          const normalized =
            groupMessagesResponse.results.map(normalizeApiMessage);
          setMessages(normalized);
          setHasMore(false);
        } else {
          if (!activeConversation?.id) return;
          const response = await getMessages(activeConversation.id, pageNumber);
          const normalized = response.results.map(normalizeApiMessage);
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
    <div className="flex flex-col h-[calc(100vh-5rem)]">
      <div className="flex-grow overflow-hidden">
        <ScrollArea className="h-[calc(100vh-24rem)]" ref={scrollAreaRef}>
          {hasMore && !isGroup && (
            <div ref={ref} className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 text-gray-400 animate-spin" />
            </div>
          )}
          <div className="p-4">
            {messages.map((message, index) => (
              <MessageBox
                key={`${message.id}-${index}`}
                message={message}
                isLast={index === messages.length - 1}
                isGroup={!!isGroup}
              />
            ))}
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
