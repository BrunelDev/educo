"use client";
import { ScrollArea } from "@src/components/ui/scroll-area";
import { useWebSocket } from "@/hooks/useWebSocket";
import { WebSocketMessage } from "@/services/websocket/WebSocketService";
import { useMessageStore } from "@/store/message";
import { Loader2 } from "lucide-react";
import { useEffect, useRef } from "react";
import MessageBox from "./messageBox";
import { MessageInput } from "./messageInput";
//import { sendMessage, getMessages, getMentor } from "@/lib/functions";
//import { useReceiver } from "@/lib/context";

export default function MessageList() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { activeConversation } = useMessageStore();

  // Utilisation du WebSocket avec l'ID de la conversation active
  const { isConnected, messages, sendMessage } = useWebSocket(
    activeConversation?.id?.toString() || ""
  );

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-gray-500">Connexion à la conversation en cours...</p>
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-214px)]">
      <ScrollArea className="flex flex-col h-[calc(100vh-290.8px)] px-4 overflow-hidden">
        {activeConversation?.messages.length === 0 && messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Aucun message</p>
          </div>
        ) : (
          <>
            {/* Afficher les messages existants */}
            {activeConversation?.messages?.map((message) => (
              <MessageBox
                key={message.id}
                message={message}
                className={`${message.is_deleted ? "opacity-50" : ""}`}
              />
            ))}

            {/* Afficher les nouveaux messages du WebSocket */}
            {messages.map((message: WebSocketMessage, index: number) => (
              <div
                key={`ws-${index}`}
                className={`flex flex-col ${
                  message.sender?.username === "vous"
                    ? "items-end"
                    : "items-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender?.username === "vous"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  <p className="text-sm font-semibold mb-1">
                    {message.sender?.username || "Anonyme"}
                  </p>
                  <p>{message.message}</p>
                  {message.timestamp && (
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>
      <div className="">
        <MessageInput onSendMessage={(content) => sendMessage(content)} />
      </div>
    </div>
  );
}
