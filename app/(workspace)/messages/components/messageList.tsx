"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import MessageBox from "./messageBox";
import { MessageInput } from "./messageInput";
import { useMessageStore } from "@/store/message";
//import { sendMessage, getMessages, getMentor } from "@/lib/functions";
//import { useReceiver } from "@/lib/context";



export default function MessageList() {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const { 
    activeConversation, 
    //setConversations, 
    //isLoading, 
    //setLoading, 
    //setError 
  } = useMessageStore()

  useEffect(() => {
    scrollToBottom();
  }, [onmessage]);


  
  

  return (
    <div className="relative h-[calc(100vh-214px)]">
      <ScrollArea className="flex flex-col h-[calc(100vh-290.8px)] px-4 overflow-hidden">
        {activeConversation?.messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Aucun message</p>
          </div>
        ) : (
          <>
            {activeConversation?.messages?.map((message) => (
              <MessageBox
                key={message.id}
                message={message}
                className={`${message.is_deleted ? "opacity-50" : ""}`}
              />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </ScrollArea>
      <div className="">
        <MessageInput
          onSendMessage={()=>{}}
        />
      </div>
    </div>
  );
}
