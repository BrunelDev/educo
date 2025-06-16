"use client";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/api/users";
import { getCookies } from "@/lib/utils/cookies";
import { useMessageStore } from "@/store/message";
import { useGroupMessageStore } from "@/store/group-message";
import { ChevronDown, ChevronLeft, Info } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";

const MessageHeader = () => {
  const { activeConversation, setActiveConversation } = useMessageStore();
  const { activeGroup, setActiveGroup } = useGroupMessageStore();
  const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");
  const [showAllParticipants, setShowAllParticipants] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

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
      (participant) => participant._id !== userInfo.id
    );

    // Get conversation name - use the other participant's name for 1:1 chats
    const conversationName =
      activeConversation?.title ||
      (otherParticipants?.length === 1
        ? otherParticipants[0].name
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
        <div className="flex items-center gap-3">
          {/* Avatar/Image */}
          <div className="relative">
            <Image
              src={
                activeConversation.participants.filter(
                  (participant) => participant._id !== userInfo.id
                )[0].avatar || "/userProfile-img.png"
              }
              alt={conversationName}
              height={40}
              width={40}
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
                      key={participant._id + index}
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
          <Button variant="ghost" size="icon" className="rounded-full"></Button>
        </div>
      </div>
    );
  }

  if (activeGroup) {
    const otherParticipants = activeGroup?.membres.filter(
      (participant) => participant.id !== userInfo.id
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
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200">
            <Avatar>
              {/* Assuming groups don't have images for now */}
              <AvatarFallback>{activeGroup.nom.charAt(0)}</AvatarFallback>
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
          <Button variant="ghost" size="icon" className="rounded-full"></Button>
        </div>
      </div>
    );
  }
};

export default MessageHeader;
