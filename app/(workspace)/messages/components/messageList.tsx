"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Message, MessageType } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import MessageBox from "./messageBox";
import { MessageInput } from "./messageInput";
//import { sendMessage, getMessages, getMentor } from "@/lib/functions";
//import { useReceiver } from "@/lib/context";

interface MessageListProps {
  messages: Message[];
  onMessageRead?: (messageId: number) => void;
  onMessageDelete?: (messageId: number) => void;
}

export default function MessageList({
  messages,
  onMessageRead,
  onMessageDelete,
}: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /*const { receiverData, changeReceiver } = useReceiver();
  const [message, setMessage] = useState("");
  const [messagesList, setMessagesList] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);*/
  

  return (
    <div className="relative h-[calc(100vh-214px)]">
      <ScrollArea className="flex flex-col h-[calc(100vh-290.8px)] px-4 overflow-hidden">
        {messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Aucun message</p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <MessageBox
                key={message.id}
                message={message}
                onRead={onMessageRead}
                onDelete={onMessageDelete}
                className={`${message.is_deleted ? "opacity-50" : ""}`}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>
      <div className="">
        <MessageInput
          onSendMessage={function (
            content: string,
            type: MessageType,
            file?: File
          ): void {
            throw new Error("Function not implemented.");
          }}
        />
      </div>
    </div>
  );
}
