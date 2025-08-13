import { getRessources, RessourcesResponse } from "@/lib/api/formations";
import { useEffect, useState } from "react";
import { RessourceCard } from "./RessourceCards";
import EmptyState from "@/app/_components/EmptyState";
import FolderCard from "../../fichiers/components/folder";
import {
  getDossiers as getFileDossiers,
  Dossier as FileDossier,
} from "@/lib/api/fichiers";
export default function ResourceContent() {
  const [ressources, setRessources] = useState<RessourcesResponse>();
  const [folders, setFolders] = useState<FileDossier[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const [resData, foldersData] = await Promise.all([
        getRessources(),
        getFileDossiers(),
      ]);
      setRessources(resData);
      setFolders(foldersData || []);
    };
    fetchData();
  }, []);
  const fetchFolders = async () => {
    try {
      const data = await getFileDossiers();
      setFolders(data || []);
    } catch (e) {
      // silent fail; could add a toast if desired
      console.error("Error fetching folders", e);
    }
  };
  if (ressources?.results.length === 0) {
    return <EmptyState title="Aucune ressource trouvée" description="" />;
  }
  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        {folders.map((folder) => (
          <FolderCard
            key={folder.id}
            folder={folder}
            fetchDossiers={fetchFolders}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        {ressources?.results.map((ressource, index) => (
          <RessourceCard ressource={ressource} key={ressource.id + index} />
        ))}
      </div>
    </div>
  );
}
