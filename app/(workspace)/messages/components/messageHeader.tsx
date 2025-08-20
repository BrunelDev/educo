"use client";
import { Button } from "@/components/ui/button";
import { useMessageStore } from "@/store/message";
import { useGroupMessageStore } from "@/store/group-message";
import { ChevronDown, ChevronLeft, Info, Trash2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import { User } from "@/lib/api/users";
import { getUser } from "@/lib/api/users";
import { Popover } from "../../components/popover";
import { Ellipsis } from "lucide-react";
import { deleteMessage, deleteGroupMessage } from "@/lib/api/message";
import { toast } from "sonner";

const MessageHeader = () => {
  const { activeConversation, setActiveConversation } = useMessageStore();
  const { activeGroup, setActiveGroup } = useGroupMessageStore();
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getUser();
        setUser(res);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  // Handle responsive layout
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

  // Handle back button click (mobile only)
  const handleBackClick = () => {
    setActiveConversation(null);
    setActiveGroup(null);
  };

  if (!activeConversation && !activeGroup) {
    return (
      <div className="flex justify-between items-center mx-6 py-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
            <Info className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex flex-col">
            <h6 className="text-sm font-semibold">
              Sélectionnez une conversation
            </h6>
            <p className="text-xs text-gray-500">
              Choisissez une conversation pour commencer
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get other participants (excluding current user)
  if (activeConversation) {
    const otherParticipants = activeConversation?.participants.filter(
      (participant) => participant.id !== user?.id
    );

    // Get conversation name - use the other participant's name for 1:1 chats
    const conversationName =
      activeConversation?.title ||
      (otherParticipants?.length === 1
        ? otherParticipants[0].name
        : `${
            otherParticipants.filter(
              (participant) => participant.id !== user?.id
            )[0].name
          }`);

    // Determine if this is a group conversation
    const isGroupConversation = otherParticipants.length > 1;

    return (
      <div className="flex justify-between items-center mx-2 sm:mx-6 py-4 border-b">
        {isMobileView && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="flex items-center gap-3">
          {/* Avatar/Image */}
          <div className="relative">
            <Image
              src={
                activeConversation.participants.filter(
                  (participant) => participant.id !== user?.id
                )[0].image || "/userProfile-img.png"
              }
              alt={conversationName}
              height={40}
              width={40}
              style={{ objectFit: "cover", width: "40px", height: "40px" }}
              className="rounded-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-avatar.png";
              }}
            />
          </div>

          {/* Conversation info */}
          <div className="flex flex-col">
            <h6 className="text-sm font-semibold">{conversationName}</h6>

            {/* Participants list */}
            {isGroupConversation && (
              <div className="flex items-center">
                <div className="flex flex-wrap gap-1 text-xs text-gray-500 max-w-[150px] xs:max-w-[200px] sm:max-w-[300px] md:max-w-none">
                  {(showAllParticipants
                    ? otherParticipants
                    : otherParticipants.slice(0, 2)
                  ).map((participant, index) => (
                    <span
                      key={participant.id + index}
                      className="whitespace-nowrap"
                    >
                      {participant.name}
                      {index <
                        (showAllParticipants
                          ? otherParticipants.length - 1
                          : Math.min(otherParticipants.length - 1, 1)) && ", "}
                    </span>
                  ))}
                  {!showAllParticipants && otherParticipants.length > 2 && (
                    <button
                      onClick={() => setShowAllParticipants(true)}
                      className="text-xs text-blue-500 hover:underline flex items-center"
                    >
                      +{otherParticipants.length - 2} autres
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  )}
                  {showAllParticipants && (
                    <button
                      onClick={() => setShowAllParticipants(false)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Voir moins
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Online status for 1:1 conversations */}
          </div>
        </div>

        {/* Action buttons */}

        <div className="flex items-center gap-2">
          <Popover
            PopoverContent={
              <PopoverDeleteAll
                isGroup={false}
                conversationId={activeConversation.id}
              />
            }
            PopoverTrigger={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Ellipsis />
              </Button>
            }
          />
        </div>
      </div>
    );
  }

  if (activeGroup) {
    const otherParticipants = activeGroup?.membres.filter(
      (participant) => participant.id !== user?.id
    );

    // Get conversation name - use the other participant's name for 1:1 chats
    const conversationName =
      activeGroup.nom ||
      (otherParticipants?.length === 1
        ? otherParticipants[0].email
        : `Groupe (${otherParticipants.length + 1} participants)`);

    // Determine if this is a group conversation
    const isGroupConversation = otherParticipants.length > 1;

    return (
      <div className="flex justify-between items-center mx-2 sm:mx-6 py-4 border-b">
        {isMobileView && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleBackClick}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div className="w-full flex items-center gap-3">
          {/* Avatar/Image */}
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-coral-400 to-crimson-400">
            <Avatar>
              <AvatarFallback className="text-white text-sm font-medium">
                {activeGroup.nom.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Conversation info */}
          <div className="flex flex-col">
            <h6 className="text-sm font-semibold">{conversationName}</h6>

            {/* Participants list */}
            {isGroupConversation && (
              <div className="flex items-center">
                <div className="flex flex-wrap gap-1 text-xs text-gray-500 max-w-[150px] xs:max-w-[200px] sm:max-w-[300px] md:max-w-none">
                  {(showAllParticipants
                    ? otherParticipants
                    : otherParticipants
                  ).map((participant, index) => (
                    <span
                      key={participant.id + index}
                      className="whitespace-nowrap"
                    >
                      {participant.email}
                      {index <
                        (showAllParticipants
                          ? otherParticipants.length - 1
                          : Math.min(otherParticipants.length - 1, 1)) && ", "}
                    </span>
                  ))}
                  {!showAllParticipants && otherParticipants.length > 2 && (
                    <button
                      onClick={() => setShowAllParticipants(true)}
                      className="text-xs text-blue-500 hover:underline flex items-center"
                    >
                      +{otherParticipants.length - 2} autres
                      <ChevronDown className="w-3 h-3 ml-1" />
                    </button>
                  )}
                  {showAllParticipants && (
                    <button
                      onClick={() => setShowAllParticipants(false)}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Voir moins
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Online status for 1:1 conversations */}
          </div>
          <span></span>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Popover
            PopoverContent={
              <PopoverDeleteAll isGroup={true} groupId={activeGroup.id} />
            }
            PopoverTrigger={
              <Button variant="ghost" size="icon" className="rounded-full">
                <Ellipsis />
              </Button>
            }
          />
        </div>
      </div>
    );
  }
};

export default MessageHeader;

const PopoverDeleteAll = ({
  isGroup,
  conversationId,
  groupId,
}: {
  isGroup: boolean;
  conversationId?: number;
  groupId?: number;
}) => {
  const [loading, setLoading] = useState(false);

  const handleDeleteAll = async () => {
    if (loading) return;
    const ok = window.confirm(
      "Voulez-vous supprimer tous les messages de cette conversation ?"
    );
    if (!ok) return;

    setLoading(true);
    try {
      if (isGroup && groupId) {
        await deleteGroupMessage(groupId);
      } else if (!isGroup && conversationId) {
        // Backend expects the conversation id to delete its messages in bulk
        await deleteMessage(conversationId);
      }
      toast.success("Tous les messages ont été supprimés");
      // Optionally notify other components to refresh
      try {
        window.dispatchEvent(new CustomEvent("refresh-messages"));
        window.location.reload();
      } catch {}
    } catch (error) {
      console.error("Error deleting all messages:", error);
      toast.error("Erreur lors de la suppression des messages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-2 px-1 text-sm w-[150px] flex flex-col gap-[6px]">
      <button
        className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-start gap-2 py-1 text-red-600 disabled:opacity-60"
        onClick={handleDeleteAll}
        disabled={loading}
      >
        <Trash2 size={18} />
        {loading ? "Suppression..." : "Supprimer tout"}
      </button>
    </div>
  );
};
