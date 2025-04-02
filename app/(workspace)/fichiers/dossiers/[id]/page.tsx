"use client";

import { DialogComponent } from "@/app/_components/dialogComponent";
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
import { use, useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await getOneDossiers(id);
        setFolderContent(response);
        console.log(response);
      } catch (error: unknown) {
        console.error("Error fetching dossier", error);
        throw error;
      }
    };

    fetchFolder();
  }, [id]);

  return (
    <div className="p-4 flex flex-col gap-10">
      
        <div className="">

      <div className="flex justify-between items-center mb-6">
        <h6>Les fichiers</h6>
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
        <ul className="flex gap-5 flex-wrap">
          {folderContent?.fichiers.map((file) => (
            <li key={file.id}>
              <FileCard file={file} />
            </li>
          ))}
        </ul>
      </div>
      <div>
      <div className="w-full flex justify-between mb-6">
        <h6>Les Sous dossiers</h6>
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

        <ul className="flex gap-5 flex-wrap">
          {folderContent?.sous_dossiers.map((folder) => (
            <li key={folder.id}>
              <Folder folder={folder} />
            </li>
          ))}
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
      console.log(res);
      toast.message("Dossier créé avec succès.");
    }
    console.log("Creating folder:", folderName);
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
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const fileName = formData.get("nom");
    const file = formData.get("media") as File;

    if (fileName && file) {
      try {
        // Upload file to S3
        const fileUrl = await uploadToS3([file]);
        console.log("S3 Upload response:", fileUrl);

        const fileData = {
          nom: fileName.toString(),
          type_fichier: "DOCUMENT",
          url: fileUrl[0],
          dossier: parseInt(folderId),
        };
        await createFile(fileData);
        toast.success("Fichier créé avec succès");
      } catch (error: unknown) {
        console.error("Error creating file", error);
        toast.error("Erreur lors de la création du fichier");
      }
    }
  };

  return (
    <form action="" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label htmlFor="fileName">Nom du fichier</label>
      <Input type="text" id="fileName" required name="nom" />

      <label htmlFor="fileUrl">URL du fichier</label>
      <div>
        <label className="font-medium text-white-800 text-xs">Fichier</label>
        <div className="relative rounded-[8px] overflow-hidden border border-dashed border-white-300">
          <Input
            name="media"
            type="file"
            className="w-full h-[136px] bg-white-50 cursor-pointer"
          />
          <div className="absolute top-0 left-0 w-full h-[135px] bg-white-50 flex flex-col gap-2 justify-center items-center pointer-events-none">
            <CirclePlus />
            <h6>Glissez et déposez ou cliquez ici pour choisir un fichier</h6>
            <div>Taille maximale 10MB</div>
          </div>
        </div>
      </div>

      <Button type="submit">Créer</Button>
    </form>
  );
};
