"use client";

import EmptyState from "@/app/_components/EmptyState";
import GoBack from "@/app/_components/goback";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Dossier, getDossierById } from "@/lib/api/formations";
import { Fragment, use, useEffect, useState } from "react";
import { toast } from "sonner";
import Folder from "../../components/folder";
import { RessourceCard } from "../../components/RessourceCards";

export default function DossierPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [folderContent, setFolderContent] = useState<Dossier>();
  const [breadcrumbPath, setBreadcrumbPath] = useState<Dossier[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDossier = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const dossierData = await getDossierById(parseInt(id));
        setFolderContent(dossierData);
      } catch (error) {
console.error(error)
        ;
        setError("Impossible de charger le dossier.");
      } finally {
        setLoading(false);
      }
    };
    fetchDossier();
  }, [id]);

  useEffect(() => {
    const buildBreadcrumbPath = async (currentFolder: Dossier | null) => {
      if (!currentFolder) return [];

      const path: Dossier[] = [];
      let parentIdToFetch: number | null = currentFolder.parent;

      path.unshift(currentFolder); // Add current folder first

      while (parentIdToFetch) {
        try {
          const parentFolder = await getDossierById(parentIdToFetch);
          path.unshift(parentFolder); // Add parent to the beginning of the path
          parentIdToFetch = parentFolder.parent;
        } catch (err) {
          ;
          toast.error("Erreur lors de la construction du fil d'Ariane.");
          parentIdToFetch = null; // Stop if there's an error
        }
      }
      return path;
    };

    if (folderContent) {
      buildBreadcrumbPath(folderContent).then(setBreadcrumbPath);
    }
  }, [folderContent]);

  if (loading) {
    return <div className="p-4">Chargement du dossier...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  if (!folderContent) {
    return <div className="p-4">Dossier non trouvé.</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-10">
      <GoBack title="Retour" />
      <Breadcrumb className="mb-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/fichiers">Fichiers</BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbPath.map((folder, index) => (
            <Fragment key={folder.id}>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {index === breadcrumbPath.length - 1 ? (
                  <BreadcrumbPage>{folder.nom}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={`/fichiers/dossiers/${folder.id}`}>
                    {folder.nom}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full">
        <div className="flex w-full justify-between items-center mb-6">
          <h6>Les fichiers</h6>
        </div>
        <ul className="flex gap-5 flex-wrap">
          {folderContent && folderContent?.ressources.length > 0 ? (
            folderContent.ressources.map((file) => (
              <li key={file.id}>
                <RessourceCard
                  ressource={{
                    ...file,
                    date_modification: file.date_modification ?? "",
                  }}
                />
              </li>
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <EmptyState
                title={"Aucun fichier pour le moment."}
                description={"Veuillez créez un fihier."}
              />
            </div>
          )}
        </ul>
      </div>
      <div>
        <div className="w-full flex justify-between mb-6">
          <h6>Les Sous dossiers</h6>
        </div>

        <ul className="flex gap-5 flex-wrap">
          {folderContent && folderContent?.sous_dossiers.length > 0 ? (
            folderContent?.sous_dossiers.map((folder) => (
              <li key={folder.id}>
                <Folder folder={folder} />
              </li>
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <EmptyState
                title={"Aucun dossier pour le moment."}
                description={"Veuillez créez un dossier."}
              />
            </div>
          )}
        </ul>
      </div>
    </div>
  );
}
