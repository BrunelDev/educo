import React from "react";
import Image from "next/image";
import { Minus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
interface ParticipantComponentProps {
  participant: {
    id: number;
    email: string;
    nom_complet: string;
    photo: string;
  };
  handleDelete?: () => Promise<void>;
}
export default function ParticipantComponent({
  participant,
  handleDelete,
}: ParticipantComponentProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  return (
    <div className="w-[320px] p-4 flex justify-between bg-[#FFFFFF99] rounded-[8px]">
      <Image
        src={participant.photo || "/userProfile-img.png"}
        width={36}
        height={36}
        style={{ objectFit: "cover", width: "36px", height: "36px" }}
        alt={`${participant.nom_complet} profile image`}
        className="rounded-full"
      />
      <h6 className="w-2/3 truncate">
        {participant.nom_complet !== " " && participant.nom_complet !== ""
          ? participant.nom_complet
          : participant.email}
      </h6>
      <div
        className="cursor-pointer hover:bg-gray-100 p-2 rounded-[4px]"
        onClick={() => setIsDeleteDialogOpen(true)}
      >
        <Minus />
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce participant ? Cette action
              est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={
                handleDelete
                  ? async () => {
                      await handleDelete();
                      toast.success("Participant supprimé avec succès");
                      setIsDeleteDialogOpen(false);
                    }
                  : () => {
                      console.log("handleDelete not defined");
                      setIsDeleteDialogOpen(false);
                    }
              }
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
