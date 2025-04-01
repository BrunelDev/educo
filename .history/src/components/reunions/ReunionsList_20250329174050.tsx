import { useReunions } from "@/hooks/useReunions";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, Eye, Trash2 } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

const STATUS_BADGES = {
  planifiee: "bg-blue-500",
  en_cours: "bg-green-500",
  terminee: "bg-gray-500",
  annulee: "bg-red-500",
} as const;

const TYPE_LABELS = {
  presentiel: "Présentiel",
  distanciel: "Distanciel",
  hybride: "Hybride",
} as const;

export function ReunionsList() {
  const {
    reunions,
    currentPage,
    isLoadingReunions,
    reunionsError,
    changePage,
    deleteReunion,
    isDeletingReunion,
  } = useReunions();

  if (isLoadingReunions) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (reunionsError) {
    return (
      <div className="text-center text-red-500">
        Une erreur est survenue lors du chargement des réunions
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Réunions</h1>
        <Link href="/reunions/nouvelle">
          <Button>Nouvelle réunion</Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Lieu</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reunions?.results.map((reunion) => (
            <TableRow key={reunion.id}>
              <TableCell className="font-medium">{reunion.titre}</TableCell>
              <TableCell>
                {format(new Date(reunion.date), "PPP 'à' HH:mm", { locale: fr })}
              </TableCell>
              <TableCell>{TYPE_LABELS[reunion.type]}</TableCell>
              <TableCell>{reunion.lieu}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={STATUS_BADGES[reunion.statut]}
                >
                  {reunion.statut.replace("_", " ").toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right space-x-2">
                <Link href={`/reunions/${reunion.id}`}>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-1" />
                    Voir
                  </Button>
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteReunion(reunion.id)}
                  disabled={isDeletingReunion}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-500">
          {reunions?.count} réunion{reunions?.count !== 1 ? "s" : ""} au total
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => changePage(currentPage - 1)}
            disabled={!reunions?.previous || isLoadingReunions}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            onClick={() => changePage(currentPage + 1)}
            disabled={!reunions?.next || isLoadingReunions}
          >
            Suivant
          </Button>
        </div>
      </div>
    </div>
  );
} 