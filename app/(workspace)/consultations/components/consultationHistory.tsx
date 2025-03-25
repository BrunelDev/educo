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
  updateConsultationStatus,
} from "@/lib/api/consultation";
import { Ellipsis } from "lucide-react";

import { useEffect, useState } from "react";
import { Popover } from "../../components/popover";
import { useRouter } from "next/navigation";
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

export default function History() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  useEffect(() => {
    const fetchConsultations = async () => {
      const response = await getConsultations();
      setConsultations(response);
    };
    fetchConsultations();
  }, []);
  return (
    <Table>
      <TableHeader>
        <TableRow className="border rounded-2xl">
          <TableHead className="w-[400px]">Consultation</TableHead>
          <TableHead>Créé le</TableHead>
          <TableHead>Document recu</TableHead>
          <TableHead className="text-right">Date</TableHead>
          <TableHead className="text-right">Status</TableHead>
          <TableHead className="text-right">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {consultations && consultations?.length >= 1
          ? consultations?.map((consultation) => (
            
              <TableRow className="hover:bg-white cursor-pointer" onClick={() => {
                router.push(`/consultations/details/${consultation.id}`)
            }} key={consultation.id + consultation.date_creation}>
                <TableCell className="font-medium">
                  {consultation.type_consultation}
                </TableCell>
                <TableCell>{consultation.date_modification}</TableCell>
                <TableCell className="text-left">
                  {`${consultation.documents.length}/3`}
                </TableCell>
                <TableCell className="text-right">
                  {consultation.date_requise}
                </TableCell>
                <TableCell className="w-full flex justify-end">
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
                <TableCell className="text-left"></TableCell>
                <Popover
                  PopoverTrigger={<Ellipsis />}
                  PopoverContent={<PopoverContent id={consultation.id} />}
                />
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
  );
}

const PopoverContent = ({ id }: { id: number }) => {
  return (
    <div className="p-2 flex flex-col gap-2 text-sm">
      <button
        onClick={() => {
          updateConsultationStatus(id, "En cours");
          window.location.reload();

        }}
      >
        En cours
      </button>{" "}
      <button
        onClick={() => {
          updateConsultationStatus(id, "En attente");
          window.location.reload();
        }}
      >
        En attente
      </button>{" "}
      <button
        onClick={() => {
          updateConsultationStatus(id, "Terminé");
          window.location.reload();

        }}
      >
        Terminé
      </button>
    </div>
  );
};
