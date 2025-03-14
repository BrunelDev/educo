import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ConsultationProps, ConsultationType } from "@/lib/types";


const consultations: ConsultationProps[] = [
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
];

export default function History() {
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
        {consultations.map((consultation) => (
          <TableRow key={consultation.id + consultation.date}>
            <TableCell className="font-medium">
              {consultation.consultationType}
            </TableCell>
            <TableCell>{consultation.createdOn}</TableCell>
            <TableCell className="text-left">
              {consultation.documentReceived}
            </TableCell>
            <TableCell className="text-right">{consultation.date}</TableCell>
            <TableCell className="w-full flex justify-end">
              <div
                className={`${
                  consultation.status === "En attente"
                    ? "bg-crimson-400"
                    : "bg-white-50"
                } w-fit py-1 px-2 flex justify-center items-center rounded-full place-self-end`}
              >
                <h6
                  className={`${
                    consultation.status === "En attente" ? "text-white" : ""
                  }`}
                >
                  {consultation.status}
                </h6>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
