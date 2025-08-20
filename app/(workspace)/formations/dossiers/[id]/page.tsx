"use client";
import { getRessources, RessourcesResponse } from "@/lib/api/formations";
import { useEffect, useState } from "react";
import { RessourceCard } from "../../components/RessourceCards";
import EmptyState from "@/app/_components/EmptyState";
import {
  getDossiers as getFileDossiers,
  Dossier as FileDossier,
} from "@/lib/api/formations";
export default function ResourceContent() {
  const [ressources, setRessources] = useState<RessourcesResponse>();
  const [, setFolders] = useState<FileDossier[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const [resData, foldersData] = await Promise.all([
        getRessources(),
        getFileDossiers(),
      ]);
      console.log("Les dossiers", foldersData);
      setRessources(resData);
      setFolders(foldersData.results);
    };
    fetchData();
  }, []);

  if (ressources?.results.length === 0) {
    return <EmptyState title="Aucune ressource trouvée" description="" />;
  }
  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {ressources?.results.map((ressource, index) => (
          <RessourceCard ressource={ressource} key={ressource.id + index} />
        ))}
      </div>
    </div>
  );
}
