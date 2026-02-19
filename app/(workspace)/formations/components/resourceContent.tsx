import EmptyState from "@/app/_components/EmptyState";
import { Dossier as FileDossier, getDossiers as getFileDossiers, getRessources, RessourcesResponse } from "@/lib/api/formations";
import { useEffect, useState } from "react";
import FolderCard from "./folder";
export default function ResourceContent() {
  const [ressources, setRessources] = useState<RessourcesResponse>();
  const [folders, setFolders] = useState<FileDossier[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const [resData, foldersData] = await Promise.all([
        getRessources(),
        getFileDossiers(),
      ]);
      ;
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
      <div className="flex flex-wrap gap-3 mb-4">
        {folders &&
          folders.length > 0 &&
          folders.map((folder) => (
            <FolderCard key={folder.id} folder={folder} />
          ))}
      </div>
    </div>
  );
}
