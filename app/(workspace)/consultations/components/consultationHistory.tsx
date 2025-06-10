"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Consultation,
  getConsultations,
  deleteConsultation,
  updateConsultation,
} from "@/lib/api/consultation";
import { Ellipsis, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Popover } from "../../components/popover";
import { formatDateToFrench } from "@/lib/functions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
/*const consultations: ConsultationProps[] = [
  {
    consultationType: ConsultationType.Orientation,
    createdOn: "2022-01-01",
    documentReceived: "Oui",
    date: "2022-01-15",
    status: "Terminé",
    id: "1",
  },
  {
    consultationType: ConsultationType.Situation,
    createdOn: "2022-02-01",
    documentReceived: "Non",
    date: "2022-02-10",
    status: "En attente",
    id: "2",
  },
  {
    consultationType: ConsultationType.Politique,
    createdOn: "2022-03-01",
    documentReceived: "Oui",
    date: "2022-03-15",
    status: "Terminé",
    id: "3",
  },
  {
    consultationType: ConsultationType.Gestion,
    createdOn: "2022-04-01",
    documentReceived: "Oui",
    date: "2022-04-15",
    status: "Terminé",
    id: "4",
  },
];*/

export default function History({refresh}: {refresh: boolean}) {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [consultationToDeleteId, setConsultationToDeleteId] = useState<number | null>(null);

  const updateConsultations = async () => {
    const response = await getConsultations();
    setConsultations(response);
  };
  useEffect(() => {
    const fetchConsultations = async () => {
      const response = await getConsultations();
      setConsultations(response);
    };
    fetchConsultations();
  }, [refresh]);

  const openDeleteDialog = (id: number) => {
    setConsultationToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConsultation = async () => {
    if (consultationToDeleteId === null) return;

    const loadingToast = toast.loading("Suppression de la consultation...");
    try {
      await deleteConsultation(consultationToDeleteId);
      setConsultations((prevConsultations) =>
        prevConsultations.filter((c) => c.id !== consultationToDeleteId)
      );
      toast.dismiss(loadingToast);
      toast.success("Consultation supprimée avec succès.");
    } catch (error) {
      console.error("Error deleting consultation:", error);
      toast.dismiss(loadingToast);
      toast.error("Erreur lors de la suppression de la consultation.");
    } finally {
      setIsDeleteDialogOpen(false);
      setConsultationToDeleteId(null);
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="border rounded-2xl">
            <TableHead>Consultation</TableHead>
            <TableHead>Créé le</TableHead>
            <TableHead>Document recu</TableHead>
            <TableHead className="text-right">Date</TableHead>
            <TableHead className="text-right">Status</TableHead>
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consultations && consultations?.length >= 1
            ? consultations?.map((consultation) => (
                <TableRow
                  className="hover:bg-white"
                  key={consultation.id + consultation.date_creation}
                >
                  <TableCell
                    className="font-medium cursor-pointer"
                    onClick={() => {
                      router.push(`/consultations/details/${consultation.id}`);
                    }}
                  >
                    {consultation.type_consultation}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(`/consultations/details/${consultation.id}`);
                    }}
                  >
                    {formatDateToFrench(consultation.date_modification)}
                  </TableCell>
                  <TableCell
                    className="text-left cursor-pointer"
                    onClick={() => {
                      router.push(`/consultations/details/${consultation.id}`);
                    }}
                  >
                    {`${consultation.documents.length}`}
                  </TableCell>
                  <TableCell
                    className="text-right cursor-pointer"
                    onClick={() => {
                      router.push(`/consultations/details/${consultation.id}`);
                    }}
                  >
                    {formatDateToFrench(consultation.date_requise)}
                  </TableCell>
                  <TableCell
                    className="w-full flex justify-end cursor-pointer"
                    onClick={() => {
                      router.push(`/consultations/details/${consultation.id}`);
                    }}
                  >
                    <div
                      className={`${
                        consultation.statut === "En attente"
                          ? "bg-crimson-400"
                          : "bg-white-50"
                      } w-fit py-1 px-2 flex justify-center items-center rounded-full place-self-end`}
                    >
                      <h6
                        className={`${
                          consultation.statut === "En attente" ? "text-white" : ""
                        }`}
                      >
                        {consultation.statut}
                      </h6>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <Popover
                        PopoverTrigger={<Ellipsis className="cursor-pointer" />}
                        PopoverContent={
                          <PopoverContent
                            id={consultation.id}
                            updateConsultations={updateConsultations}
                          />
                        }
                      />
                      <Trash2
                        className="cursor-pointer text-red-500 hover:text-red-700"
                        size={20}
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click navigation
                          openDeleteDialog(consultation.id);
                        }}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette consultation ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Annuler</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDeleteConsultation}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const PopoverContent = ({
  id,
  updateConsultations,
}: {
  id: number;
  updateConsultations: () => Promise<void>;
}) => {
  return (
    <div className="p-2 flex flex-col gap-2 text-sm">
      <span
      className="cursor-pointer"
        onClick={async () => {
          await updateConsultation(id, { statut: "En cours" });
          await updateConsultations();
        }}
      >
        <h6>En cours</h6>
      </span>{" "}
      <span
      className="cursor-pointer"

        onClick={async () => {
            await updateConsultation(id, { statut: "En attente" });
          await updateConsultations();
        }}
      >
        <h6>En attente</h6>
      </span>{" "}
      <span
      className="cursor-pointer"
        onClick={async () => {
          await updateConsultation(id, { statut: "Terminé" });
          await updateConsultations();
        }}
      >
        <h6>Terminé</h6>
      </span>
    </div>
  );
};
