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

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Popover } from "../../components/popover";
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
  }, [consultations]);
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
              <TableRow
                className="hover:bg-white cursor-pointer"
                key={consultation.id + consultation.date_creation}
              >
                <TableCell
                  className="font-medium"
                  onClick={() => {
                    router.push(`/consultations/details/${consultation.id}`);
                  }}
                >
                  {consultation.type_consultation}
                </TableCell>
                <TableCell
                  onClick={() => {
                    router.push(`/consultations/details/${consultation.id}`);
                  }}
                >
                  {consultation.date_modification}
                </TableCell>
                <TableCell
                  className="text-left"
                  onClick={() => {
                    router.push(`/consultations/details/${consultation.id}`);
                  }}
                >
                  {`${consultation.documents.length}/3`}
                </TableCell>
                <TableCell
                  className="text-right"
                  onClick={() => {
                    router.push(`/consultations/details/${consultation.id}`);
                  }}
                >
                  {consultation.date_requise}
                </TableCell>
                <TableCell
                  className="w-full flex justify-end"
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
                <TableCell className="text-left"></TableCell>
                <Popover
                  PopoverTrigger={<Ellipsis />}
                  PopoverContent={
                    <PopoverContent
                      id={consultation.id}
                      updateConsultations={updateConsultations}
                    />
                  }
                />
              </TableRow>
            ))
          : null}
      </TableBody>
    </Table>
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
      <button
        onClick={async () => {
          updateConsultationStatus(id, "En cours");
          await updateConsultations();
        }}
      >
        En cours
      </button>{" "}
      <button
        onClick={async () => {
          updateConsultationStatus(id, "En attente");
          await updateConsultations();
        }}
      >
        En attente
      </button>{" "}
      <button
        onClick={async () => {
          updateConsultationStatus(id, "Terminé");
          await updateConsultations();
        }}
      >
        Terminé
      </button>
    </div>
  );
};
