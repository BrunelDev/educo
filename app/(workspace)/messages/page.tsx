"use client";

import { MessageHeaderProps } from "@/lib/types";
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
  // DialogFooter, // Removed as it's no longer used directly here
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import CreateGroupForm from "./components/CreateGroupForm";

export default function MessagePage() {
  const [isCreateGroupDialogOpen, setIsCreateGroupDialogOpen] = useState(false);
  const messageHeader: MessageHeaderProps = {
    conversationName: "Nouvelle conversation",
    speakers: [
      "Victoria",
      "John DOE",
      "Jane SMITH",
      "Sarah Johnson",
      "Emily BROWN",
      "William TAYLOR",
      "Olivia MARTIN",
    ],
    conversationImageUrl: "/enterprise-image.png",
  };
 





  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4 px-4 pt-4 sm:px-6">
        {/* Placeholder for potential future header elements or title */}
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Messages</h1>
        <Dialog open={isCreateGroupDialogOpen} onOpenChange={setIsCreateGroupDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">
              <PlusCircle className="mr-2 h-4 w-4" /> Create Group
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Créer une Nouvelle Conversation de groupe</DialogTitle>
              <DialogDescription>
                Sélectionnez les membres de votre équipe pour les ajouter au nouveau groupe.
              </DialogDescription>
            </DialogHeader>
            <CreateGroupForm 
              onGroupCreated={() => setIsCreateGroupDialogOpen(false)}
              currentUserId={1} // TODO: Replace with actual current user ID from auth/context
            />
            {/* DialogFooter can be removed if CreateGroupForm handles its own cancel/submit buttons internally */}
            {/* Or keep it if you want global Cancel button outside the form */}
            {/* For now, CreateGroupForm has its own submit, so we might not need a footer submit here */}
          </DialogContent>
        </Dialog>
      </div>
      <MessageHeader {...messageHeader} />
      <MessageList />
    </div>
  );
}
