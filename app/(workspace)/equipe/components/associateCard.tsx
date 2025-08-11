import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { removeFromTeam, User } from "@/lib/api/equipe";
import { getCookies } from "@/lib/utils/cookies";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface AssociateCardProps {
  associate: User;
  teamId: number;
  refresh: () => void;
}
const userId = JSON.parse(getCookies("userInfo") || "{}")?.id;
export default function AssociateCard({
  associate,
  teamId,
  refresh,
}: AssociateCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div className="bg-[#FFFFFF99] w-[330px] h-[140px] p-3 rounded-[8px] flex flex-col justify-between">
      <div className="flex justify-between">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden relative">
          <Image
            src={associate.image || "/userProfile-img.png"}
            fill
            sizes="60px"
            className="object-cover"
            alt="user image"
          />
        </div>
        {associate.id === userId && <h6 className="font-semibold">(Vous)</h6>}
        {associate.id !== userId && (
          <button
            className="p-3 h-1 overflow-hidden hover:bg-gray-100 rounded-lg"
            onClick={async () => {
              setIsDeleteDialogOpen(true);
            }}
          >
            <Image
              src={"/dash-icon.svg"}
              width={9.3}
              height={1}
              alt="dash icon"
            />
          </button>
        )}
      </div>

      <h6 className="text-xl font-semibold text-white-800">
        {associate.first_name}
      </h6>
      <div className="flex justify-between">
        <h6 className="font-medium text-xs">{associate.email}</h6>
        {associate.id !== userId && (
          <Link
            href={"/messages"}
            className="rounded-[8px] flex items-center justify-center bg-white-100 text-white-800 text-xs font-semibold h-[28px] w-fit py[6px] px-[8px] p-x"
          >
            <h6>Message</h6>
          </Link>
        )}
      </div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer ce membre ? Cette action est
              irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={async () => {
                try {
                  const res = await removeFromTeam(teamId, associate.id);
                  console.log(res);
                  refresh();
                } catch (error: unknown) {
                  console.error("Failed to remove associate from team", error);
                }
              }}
            >
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
