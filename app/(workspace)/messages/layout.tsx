"use client";

import { useEffect, useState } from "react";
import {
  Conversation,
  getConversationList,
  Group,
  getGroups,
} from "@/lib/api/message";
import { useMessageStore } from "@/store/message";
import { useGroupMessageStore } from "@/store/group-message";
import ConversationsList from "./components/conversationsList";

export default function MessageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { setActiveConversation, activeConversation } = useMessageStore();
  const { setActiveGroup, activeGroup, isLoading } = useGroupMessageStore();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [view, setView] = useState<"conversations" | "groups">("conversations");
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const convResponse = await getConversationList();
        setConversations(convResponse?.results || []);
        const groupResponse = await getGroups();
        console.log(groupResponse);
        setGroups(groupResponse?.results || []);
      } catch (error) {
        console.error("Failed to fetch conversations or groups:", error);
      }
    };
    fetchData();
  }, [isLoading]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Set initial value
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectConversation = (conversation: Conversation) => {
    setActiveConversation(conversation);
    setActiveGroup(null);
  };

  const handleSelectGroup = (group: Group) => {
    setActiveGroup(group);
    setActiveConversation(null);
  };

  const selectedItem =
    view === "conversations" ? activeConversation : activeGroup;

  return (
    <main className="flex w-full dark:bg-gray-900 h-[calc(100vh-5rem)]">
      <div
        className={`w-full md:w-[350px]  dark:border-gray-700 flex flex-col ${
          isMobileView && selectedItem ? "hidden" : "block"
        }
          ${isMobileView ? "w-full" : "w-[calc(100%-150px)]"}`}
      >
        <div className="p-7 pb-[30px] border-b dark:border-gray-700">
          <h1 className="text-xl font-bold">Messages</h1>
        </div>

        <ConversationsList
          conversations={conversations}
          groups={groups}
          selectedItem={selectedItem}
          onSelectConversation={handleSelectConversation}
          onSelectGroup={handleSelectGroup}
          view={view}
          setView={setView}
        />
      </div>
      <div
        className={`
          bg-[#ffffff78] py-5 px-4 rounded-[12px] h-[calc(100vh-5rem)]
          ${isMobileView && !selectedItem ? "hidden" : "block"}
          ${isMobileView ? "w-full" : "w-[calc(100%-350px)]"} 
          
        `}
      >
        {children}
      </div>
    </main>
  );
}
