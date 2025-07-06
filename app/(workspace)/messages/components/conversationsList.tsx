"use client";

import { Conversation, Group } from "@/lib/api/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCookies } from "@/lib/utils/cookies";
import { User } from "@/lib/api/users";
interface ConversationsListProps {
  conversations: Conversation[];
  groups: Group[];
  selectedItem: Conversation | Group | null;
  onSelectConversation: (conversation: Conversation) => void;
  onSelectGroup: (group: Group) => void;
  view: 'conversations' | 'groups';
  setView: (view: 'conversations' | 'groups') => void;
}

export default function ConversationsList({
  conversations,
  groups,
  selectedItem,
  onSelectConversation,
  onSelectGroup,
  setView,
  view,
}: ConversationsListProps) {
  const user: User = JSON.parse(getCookies("userInfo") || "{}");
  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="flex flex-col gap-2 p-2">
        <h6>Groupes</h6>
      {(groups?.length > 0 && groups) ? groups?.map((group) => (
          <div
            key={`group-${group.id}`}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
              (selectedItem?.id === group.id) && view === 'groups' && "bg-gray-200 dark:bg-gray-700"
            )}
            onClick={() => {
              onSelectGroup(group);
              setView('groups');
            }}
          >
            <Avatar>
              {/* Assuming groups don't have images for now */}
              <AvatarFallback>{group.nom.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{group.nom}</p>
              <p className="text-xs text-gray-500 truncate">{group.dernier_message?.contenu || ""}</p>
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-500">Aucun groupe</p>
        )}
        <h6>Conversations</h6>
        {(conversations?.length > 0 && conversations) ? conversations?.map((conversation) => (
          <div
            key={`conv-${conversation.id}`}
            className={cn(
              "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800",
              selectedItem?.id === conversation.id && view === 'conversations' && "bg-gray-200 dark:bg-gray-700"
            )}
            onClick={() => {
              onSelectConversation(conversation);
              setView('conversations');
            }}
          >
            <Avatar>
              <AvatarImage src={conversation.participants?.[0]?.avatar || undefined} alt={conversation.participants?.[0]?.name} />
              <AvatarFallback>{conversation.participants?.filter((participant) => participant.id !== user.id)[0]?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold text-sm">{conversation.participants?.filter((participant) => participant.id !== user.id)[0]?.name}</p>
              <p className="text-xs text-gray-500 truncate">{conversation.messages?.[0]?.content}</p>
            </div>
          </div>
        )) : (
          <p className="text-center text-gray-500">Aucune conversation</p>
        )}

        
       
      </div>
    </ScrollArea>
  );
}



