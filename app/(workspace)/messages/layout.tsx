"use client";

import { useMessageStore } from "@/store/message";
import ConversationsList from "./components/conversationsList";
import { useEffect, useState } from "react";

export default function MessageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { activeConversation } = useMessageStore();
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Handle responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return (
    <main className="flex w-full">
      {/* Conversations list - hidden on mobile when a conversation is selected */}
      <div className={`${isMobileView && activeConversation ? 'hidden' : 'block'} w-full md:w-[300px]`}>
        <ConversationsList />
      </div>
      
      {/* Message content - hidden on mobile when no conversation is selected */}
      <div 
        className={`
          bg-[#ffffff78] py-5 px-4 rounded-[12px] 
          ${isMobileView && !activeConversation ? 'hidden' : 'block'}
          ${isMobileView ? 'w-full' : 'w-[calc(100%-280px)]'} 
          h-[calc(100vh-50px)]
        `}
      >
        {children}
      </div>
    </main>
  );
}
