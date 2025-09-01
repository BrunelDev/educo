"use client";
import { Conversation, Group } from "@/lib/api/message";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCookies } from "@/lib/utils/cookies";
import { User } from "@/lib/api/users";
import {
  markLastMessageAsRead,
  markGroupLastMessageAsRead,
} from "@/lib/api/message";
interface ConversationsListProps {
  conversations: Conversation[];
  groups: Group[];
  selectedItem: Conversation | Group | null;
  onSelectConversation: (conversation: Conversation) => void;
  onSelectGroup: (group: Group) => void;
  view: "conversations" | "groups";
  setView: (view: "conversations" | "groups") => void;
}

export function ConversationsList({
  conversations,
  groups,
  selectedItem,
  onSelectConversation,
  onSelectGroup,
  setView,
  view,
}: ConversationsListProps) {
  const user: User = JSON.parse(getCookies("userInfo") || "{}");
  console.log("---test---", groups);

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="flex flex-col gap-2 p-2">
        <h6>Groupes</h6>
        {groups?.length > 0 && groups ? (
          groups?.map((group) => (
            <div
              key={`group-${group.id}`}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-crimson-100 relative",
                selectedItem?.id === group.id &&
                  view === "groups" &&
                  "bg-crimson-100"
              )}
              onClick={async () => {
                if (
                  !group?.is_last_message_read &&
                  group?.last_message?.sender?.id !== user.id
                ) {
                  await markGroupLastMessageAsRead(group.id, true);
                }
                onSelectGroup(group);
                setView("groups");
              }}
            >
              {!group?.is_last_message_read &&
                group?.last_message?.sender?.id !== user.id && (
                  <div className="w-2 h-2 bg-gradient-to-r from-coral-400 to-crimson-400 rounded-full absolute right-2 top-1/2" />
                )}
              <Avatar>
                {/* Assuming groups don't have images for now */}
                <AvatarFallback className="bg-gradient-to-r from-coral-400 to-crimson-400 text-white text-sm font-medium">
                  {group.nom.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">{group.nom}</p>
                <p className="text-xs text-gray-500 truncate">
                  {group.last_message?.content || ""}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun groupe</p>
        )}
        <h6>Conversations</h6>
        {conversations?.length > 0 && conversations ? (
          conversations?.map((conversation) => (
            <div
              key={`conv-${conversation.id}`}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg cursor-pointer hover:bg-crimson-100 relative",
                selectedItem?.id === conversation.id &&
                  view === "conversations" &&
                  "bg-crimson-100"
              )}
              onClick={async () => {
                if (
                  conversation.messages[0]?.sender?.id !== user.id &&
                  !conversation.is_last_message_read
                ) {
                  await markLastMessageAsRead(conversation.id, true);
                }
                onSelectConversation(conversation);
                setView("conversations");
              }}
            >
              {!conversation?.is_last_message_read &&
                conversation?.messages[0]?.sender?.id !== user.id && (
                  <div className="w-2 h-2 bg-gradient-to-r from-coral-400 to-crimson-400 rounded-full absolute right-2 top-1/2" />
                )}
              <Avatar>
                <AvatarImage
                  src={
                    conversation.participants?.filter(
                      (participant) => participant.id !== user.id
                    )[0]?.image || undefined
                  }
                  alt={conversation.participants?.[0]?.name}
                />
                <AvatarFallback className="bg-gradient-to-r from-coral-400 to-crimson-400 text-white text-sm font-medium">
                  {conversation.participants
                    ?.filter((participant) => participant.id !== user.id)[0]
                    ?.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {
                    conversation.participants?.filter(
                      (participant) => participant.id !== user.id
                    )[0]?.name
                  }
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {conversation.messages?.[0]?.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucune conversation</p>
        )}
      </div>
    </ScrollArea>
  );
}
