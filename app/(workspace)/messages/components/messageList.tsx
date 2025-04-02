/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useWebSocket } from "@/hooks/useWebSocket";
import { getMessages } from "@/lib/api/message";
import { useMessageStore } from "@/store/message";
import { useIntersection } from "@mantine/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import MessageBox from "./messageBox";
import { MessageInput } from "./messageInput";

export default function MessageList() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeConversation } = useMessageStore();
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const { ref: loadMoreRef, entry } = useIntersection({
    threshold: 0.5,
    rootMargin: "100px",
  });

  const { isConnected, messages, sendMessage, setMessages } = useWebSocket(
    activeConversation?.id?.toString() || ""
  );

  const fetchMessages = useCallback(
    async (pageNumber: number) => {
      if (!activeConversation?.id || isLoading || !hasMore) return;

      try {
        setIsLoading(true);
        const response = await getMessages(activeConversation.id, pageNumber);

        setMessages((prev) => {
          const currentMessages = Array.isArray(prev) ? prev : [];
          const newMessages = response.results || [];
          console.log("nex", newMessages);

          return pageNumber === 1
            ? newMessages
            : [...currentMessages, ...newMessages];
        });

        setHasMore(!!response.next);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setConnectionError("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    },
    [activeConversation?.id, hasMore, isLoading]
  );

  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchMessages(1);
  }, [activeConversation?.id]);

  useEffect(() => {
    const shouldLoadMore = entry?.isIntersecting && hasMore && !isLoading;
    if (shouldLoadMore) {
      fetchMessages(page + 1);
      setPage((prev) => prev + 1);
    }
  }, [entry?.isIntersecting]);

  // Add scroll to bottom effect for new messages
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      }
    };

    // Scroll on new messages or initial load
    if (messages.length > 0) {
      scrollToBottom();
    }
  }, [messages]); // This will trigger on every message update

  // Keep your existing scroll effect for pagination
  useEffect(() => {
    if (messagesEndRef.current && page === 1) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  if (!activeConversation) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Sélectionnez une conversation</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-214px)]">
      {connectionError && (
        <div className="bg-red-100 p-2 text-red-600 text-center">
          {connectionError}
        </div>
      )}

      <ScrollArea className="h-[calc(100vh-290.8px)] px-4">
        <div className="flex flex-col gap-4">
          <div
            ref={loadMoreRef}
            className="h-8 flex items-center justify-center"
          >
            {isLoading && (
              <div className="text-sm text-gray-500">Loading messages...</div>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {messages && messages.length > 0 ? (
              messages.map((message) => (
                <MessageBox
                  key={message.id}
                  message={message}
                  className={
                    message.sender.id === activeConversation?.id
                      ? "ml-auto"
                      : ""
                  }
                />
              ))
            ) : (
              <div className="text-center text-gray-500">No messages yet</div>
            )}
          </div>

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <MessageInput
        onSendMessage={sendMessage}
        isConnected={isConnected}
        isLoading={isLoading}
      />
    </div>
  );
}
