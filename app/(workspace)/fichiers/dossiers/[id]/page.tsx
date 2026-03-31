"use client";

import { DialogComponent } from "@/app/_components/dialogComponent";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createFile,
  createFolder,
  Dossier,
  getOneDossiers,
} from "@/lib/api/fichiers";
import { uploadToS3 } from "@/lib/s3-upload";
import { CirclePlus } from "lucide-react";
import { Fragment, use, useEffect, useState } from "react";
import { toast } from "sonner";
import FileCard from "../../components/file";
import Folder from "../../components/folder";

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
        const dossierData = await getOneDossiers(id);
        setFolderContent(dossierData);
      } catch (error) {
        console.error(error);
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
          const parentFolder = await getOneDossiers(parentIdToFetch.toString());
          path.unshift(parentFolder); // Add parent to the beginning of the path
          parentIdToFetch = parentFolder.parent;
        } catch (err) {
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

  const fetchDossiers = async () => {
    const response = await getOneDossiers(id);
    setFolderContent(response);
  };

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
                {index === breadcrumbPath.length - 1 ?
                  <BreadcrumbPage>{folder.nom}</BreadcrumbPage>
                : <BreadcrumbLink href={`/fichiers/dossiers/${folder.id}`}>
                    {folder.nom}
                  </BreadcrumbLink>
                }
              </BreadcrumbItem>
            </Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
      <div className="w-full">
        <div className="flex w-full justify-between items-center mb-6">
          <h6>Les fichiers</h6>
          <div>
            <DialogComponent
              dialogContent={<CreateFile folderId={id} />}
              dialoTrigger={
                <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-fit">
                  Nouveau Fichier
                </Button>
              }
              dialogTitle={null}
            />
          </div>
        </div>
        <ul className="flex gap-5 flex-wrap">
          {folderContent && folderContent?.fichiers.length > 0 ?
            folderContent?.fichiers.map((file) => (
              <li key={file.id}>
                <FileCard file={file} />
              </li>
            ))
          : <div className="w-full flex justify-center items-center">
              <EmptyState
                title={"Aucun fichier pour le moment."}
                description={"Veuillez créez un fihier."}
              />
            </div>
          }
        </ul>
      </div>
      <div>
        <div className="w-full flex justify-between mb-6">
          <h6>Les Sous dossiers</h6>
          <div>
            <DialogComponent
              dialogContent={<CreateFolder folderId={id} />}
              dialoTrigger={
                <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-fit">
                  Nouveau Dossier
                </Button>
              }
              dialogTitle={null}
            />
          </div>
        </div>

        <ul className="flex gap-5 flex-wrap">
          {folderContent && folderContent?.sous_dossiers.length > 0 ?
            folderContent?.sous_dossiers.map((folder) => (
              <li key={folder.id}>
                <Folder folder={folder} fetchDossiers={fetchDossiers} />
              </li>
            ))
          : <div className="w-full flex justify-center items-center">
              <EmptyState
                title={"Aucun dossier pour le moment."}
                description={"Veuillez créez un dossier."}
              />
            </div>
          }
        </ul>
      </div>
    </div>
  );
}

const CreateFolder = ({ folderId }: { folderId: string }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const folderName = formData.get("nom");
    if (folderName) {
      const res = createFolder(folderName?.toString(), folderId);
      toast.message("Dossier créé avec succès.");
      window.location.reload();
    }
  };

  return (
    <form action="" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label htmlFor="folderName">Nom du dossier</label>
      <Input type="text" id="folderName" required name="nom" />
      <Button type="submit">Créer</Button>
    </form>
  );
};

const CreateFile = ({ folderId }: { folderId: string }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("media") as File;
    const fileName = file.name;

    if (fileName && file) {
      try {
        // Upload file to S3
        const fileUrl = await uploadToS3([file]);
        //the name should be the same as the file name

        const fileData = {
          nom: fileName.toString(),
          type_fichier: "DOCUMENT",
          url: fileUrl[0],
          dossier: parseInt(folderId),
        };
        await createFile(fileData);
        toast.success("Fichier créé avec succès");
        window.location.reload();
      } catch (error: unknown) {
        toast.error("Erreur lors de la création du fichier");
      }
    }
  };

  return (
    <form action="" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <div>
        <label className="font-medium text-white-800 text-xs">Fichier</label>
        <div className="relative rounded-[8px] overflow-hidden border border-dashed border-white-300">
          <Input
            name="media"
            type="file"
            className="w-full h-[136px] bg-white-50 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const result = event.target?.result;
                  if (result) {
                    setFileUrl(result as string);
                  }
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <div className="absolute top-0 left-0 w-full h-[135px] bg-white-50 flex flex-col gap-2 justify-center items-center pointer-events-none">
            <CirclePlus />
            <h6>Glissez et déposez ou cliquez ici pour choisir un fichier</h6>
            <div>Taille maximale 10MB</div>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center">
        {fileUrl && (
          <div className="flex justify-center w-1/2 items-center">
            {
              // sImple and basic UI and modern for name of file preview
              <p className="text-sm font-medium text-center mb-2 truncate w-[200px]">
                {fileUrl}
              </p>
            }
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="bg-gradient-to-r from-[#FE6539] to-crimson-400"
      >
        Créer
      </Button>
    </form>
  );
};
