"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import {
  clearChatHistory,
  getChatHistory,
  streamChatMessage,
} from "@/lib/api/chatbot";
import { Message, MessageType } from "@/lib/types";
import { getCookies } from "@/lib/utils/cookies";
import { Bot, MessageSquare, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import MessageBox from "../messages/components/messageBox";
import { MessageInput } from "../messages/components/messageInput";

const BOT_SENDER = {
  id: 0,
  name: "Assistant Educo",
  email: "assistant@educo.com",
  first_name: "Assistant",
  last_name: "Educo",
  image: null,
};

// Parse le format SSE : "data: {...}\n\n"
// Retourne le texte extrait, "[DONE]" si terminé, ou null si ligne ignorée
function parseSSEChunk(raw: string): string | null {
  const lines = raw.split("\n");
  let result = "";

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;

    const payload = trimmed.slice(5).trim();

    if (payload === "[DONE]") return "[DONE]";

    try {
      const parsed = JSON.parse(payload);
      if (parsed.text) result += parsed.text;
      if (parsed.error) return `[ERROR] ${parsed.error}`;
    } catch {
      // ligne malformée, on ignore
    }
  }

  return result || null;
}

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userInfo = JSON.parse(getCookies("userInfo") || "{}");
  const userSender = {
    id: userInfo.id || 1,
    name: userInfo.name || "Vous",
    email: userInfo.email || "",
    first_name: userInfo.first_name || "",
    last_name: userInfo.last_name || "",
    image: userInfo.image || null,
  };

  // Cleanup du stream si le composant est démonté pendant un stream actif
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // Chargement de l'historique
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const historyData = await getChatHistory();
        const historyArray =
          Array.isArray(historyData) ? historyData : (
            historyData.results ||
            historyData.messages ||
            historyData.history ||
            []
          );

        if (historyArray.length > 0) {
          const formattedHistory: Message[] = [];

          historyArray.forEach((pair: any, index: number) => {
            if (pair.user_message) {
              formattedHistory.push({
                id: pair.user_message.id ?? `u-${index}`,
                room: 0,
                sender: userSender,
                content: pair.user_message.content || "",
                type_message: MessageType.TEXT,
                timestamp:
                  pair.user_message.timestamp ?
                    new Date(pair.user_message.timestamp)
                  : new Date(),
                is_read: true,
                is_deleted: false,
              });
            } else if (pair.content && !pair.is_ai_response) {
              formattedHistory.push({
                id: pair.id ?? `u-${index}`,
                room: 0,
                sender: userSender,
                content: pair.content || "",
                type_message: MessageType.TEXT,
                timestamp:
                  pair.timestamp ? new Date(pair.timestamp) : new Date(),
                is_read: true,
                is_deleted: false,
              });
            }

            if (pair.ai_message) {
              formattedHistory.push({
                id: pair.ai_message.id ?? `b-${index}`,
                room: 0,
                sender: BOT_SENDER,
                content: pair.ai_message.content || "",
                type_message: MessageType.TEXT,
                timestamp:
                  pair.ai_message.timestamp ?
                    new Date(pair.ai_message.timestamp)
                  : new Date(),
                is_read: true,
                is_deleted: false,
              });
            } else if (pair.content && pair.is_ai_response) {
              formattedHistory.push({
                id: pair.id ?? `b-${index}`,
                room: 0,
                sender: BOT_SENDER,
                content: pair.content || "",
                type_message: MessageType.TEXT,
                timestamp:
                  pair.timestamp ? new Date(pair.timestamp) : new Date(),
                is_read: true,
                is_deleted: false,
              });
            }
          });

          if (formattedHistory.length > 0) {
            formattedHistory.sort(
              (a, b) => a.timestamp.getTime() - b.timestamp.getTime(),
            );
            setMessages(formattedHistory);
            return;
          }
        }
      } catch (error) {
        console.error("Erreur chargement historique:", error);
      }

      // Message de bienvenue par défaut
      setMessages([
        {
          id: "welcome",
          room: 0,
          sender: BOT_SENDER,
          content:
            "Bonjour ! Je suis votre assistant Educo. Comment puis-je vous aider aujourd'hui ?",
          type_message: MessageType.TEXT,
          timestamp: new Date(),
          is_read: true,
          is_deleted: false,
        },
      ]);
    };

    fetchHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (messageData: {
    type: string;
    message: string;
    type_message?: string;
    file_url?: string;
  }) => {
    if (isStreaming) return;

    const userMsgId = `user-${Date.now()}`;
    const botMsgId = `bot-${Date.now()}`;

    // Ajout du message utilisateur
    const userMessage: Message = {
      id: userMsgId,
      room: 0,
      sender: userSender,
      content: messageData.message,
      type_message:
        (messageData.type_message as MessageType) || MessageType.TEXT,
      timestamp: new Date(),
      is_read: true,
      is_deleted: false,
    };

    // Placeholder bot avec indicateur de frappe
    const initialBotReply: Message = {
      id: botMsgId,
      room: 0,
      sender: BOT_SENDER,
      content: "",
      type_message: MessageType.TEXT,
      timestamp: new Date(),
      is_read: true,
      is_deleted: false,
      is_typing: true,
    };

    setMessages((prev) => [...prev, userMessage, initialBotReply]);
    setIsStreaming(true);

    // AbortController pour pouvoir annuler si démontage
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const stream = await streamChatMessage(
        messageData.message,
        controller.signal,
      );
      console.log("✅ 1. Stream reçu :", stream);

      if (!stream) throw new Error("Aucun stream reçu du serveur");

      const reader = stream.getReader();
      const decoder = new TextDecoder();
      let fullContent = "";
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        const raw = value ? decoder.decode(value, { stream: true }) : "";
        console.log(
          "📦 2. Chunk brut — done:",
          done,
          "| raw:",
          JSON.stringify(raw),
        );

        if (done) break;

        buffer += raw;
        const parts = buffer.split("\n\n");
        buffer = parts.pop() ?? "";

        console.log("🔍 3. Parts à parser:", parts);

        for (const part of parts) {
          if (!part.trim()) continue;
          const parsed = parseSSEChunk(part);
          console.log("🧩 4. Résultat parseSSEChunk:", JSON.stringify(parsed));

          if (parsed === "[DONE]") break;
          if (parsed?.startsWith("[ERROR]")) {
            fullContent += "\n⚠️ " + parsed.slice(8);
          } else if (parsed) {
            fullContent += parsed;
          }

          console.log(
            "📝 5. fullContent jusqu'ici:",
            JSON.stringify(fullContent),
          );

          setMessages((prev) => {
            const updated = [...prev];
            const idx = updated.findIndex((m) => m.id === botMsgId);
            console.log("🔄 6. Index bot dans messages:", idx);
            if (idx !== -1) {
              updated[idx] = {
                ...updated[idx],
                content: fullContent,
                is_typing: false,
              };
            }
            return updated;
          });
        }
      }
    } catch (error: any) {
      if (error?.name === "AbortError") return; // démontage du composant, on ignore

      console.error("Erreur streaming:", error);

      setMessages((prev) => {
        const updated = [...prev];
        const idx = updated.findIndex((m) => m.id === botMsgId);
        if (idx !== -1) {
          updated[idx] = {
            ...updated[idx],
            content:
              "Désolé, une erreur s'est produite lors de la communication avec le serveur.",
            is_typing: false,
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-5rem)] bg-white dark:bg-gray-900 rounded-[12px] overflow-hidden shadow-sm">
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-crimson-100 flex items-center justify-center text-crimson-600">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold">Assistant Educo</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {isStreaming ? "En train d'écrire..." : "En ligne"}
            </p>
          </div>
        </div>
        <button
          onClick={async () => {
            try {
              await clearChatHistory();
              setMessages([
                {
                  id: `welcome-${Date.now()}`,
                  room: 0,
                  sender: BOT_SENDER,
                  content: "Historique supprimé. Comment puis-je vous aider ?",
                  type_message: MessageType.TEXT,
                  timestamp: new Date(),
                  is_read: true,
                  is_deleted: false,
                },
              ]);
            } catch (error) {
              console.error("Erreur suppression historique:", error);
            }
          }}
          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
          title="Effacer l'historique"
        >
          <Trash2 size={20} />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow overflow-hidden">
        <ScrollArea
          className="h-full px-4"
          ref={scrollAreaRef}
          scrollHideDelay={0}
        >
          <div className="max-w-4xl mx-auto py-8">
            {messages.length === 0 ?
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <MessageSquare size={48} className="mb-4 opacity-20" />
                <p>Démarrez une discussion avec l&apos;assistant</p>
              </div>
            : messages.map((msg, index) => (
                <MessageBox
                  key={`${msg.id}-${index}`}
                  message={msg}
                  isLast={index === messages.length - 1}
                />
              ))
            }
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Input */}
      <div className="p-4 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <MessageInput
            onSendMessage={handleSendMessage}
            isConnected={true}
            disabled={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
