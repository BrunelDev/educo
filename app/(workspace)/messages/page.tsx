"use client";

import MessageHeader from "./components/messageHeader";
import MessageList from "./components/messageList";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { PlusCircle, MessageCircle } from "lucide-react";
import { useState } from "react";
import CreateGroupForm from "./components/CreateGroupForm";
import { getCookies } from "@/lib/utils/cookies";
import { User } from "@/lib/api/users";
import { useMessageStore } from "@/store/message";
import { useGroupMessageStore } from "@/store/group-message";

export default function MessagePage() {
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const { activeConversation } = useMessageStore();
  const { activeGroup, setLoading, isLoading } = useGroupMessageStore();
  const user: User = JSON.parse(getCookies("userInfo") || "{}");

  // Determine if we are showing a conversation, a group, or a placeholder
  const showConversation = !!activeConversation;
  const showGroup = !!activeGroup;
  const showPlaceholder = !showConversation && !showGroup;


  return (
    <div className="w-full h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex justify-end items-center mb-4 px-4 pt-4 sm:px-6 border-b pb-4 dark:border-gray-700">
        <Dialog
          open={isCreateGroupDialogOpen}
          onOpenChange={setIsCreateGroupDialogOpen}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="flex">
              <PlusCircle className="mr-2 h-4 w-4" /> Créer un groupe
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>
                Créer une Nouvelle Conversation de groupe
              </DialogTitle>
              <DialogDescription>
                Sélectionnez les membres de votre groupe pour les ajouter au
                nouveau groupe.
              </DialogDescription>
            </DialogHeader>
            <CreateGroupForm
              onGroupCreated={() => {
                setLoading(!isLoading);
                setIsCreateGroupDialogOpen(false);
              }}
              currentUserId={user.id}
            />
          </DialogContent>
        </Dialog>
      </div>

      {showPlaceholder && (
        <div className="flex-grow flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
          <MessageCircle className="w-16 h-16 mb-4" />
          <p className="text-lg">
            Sélectionnez une conversation ou un groupe pour commencer.
          </p>
          <p className="text-sm">
            Ou créez un nouveau groupe pour discuter avec votre équipe.
          </p>
        </div>
      )}

      {(showConversation || showGroup) && (
        <>
          <MessageHeader />
          <MessageList />
        </>
      )}
    </div>
  );
}
