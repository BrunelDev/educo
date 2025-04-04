"use client";
import { Input } from "@/components/ui/input";
import { createFolder, DossierResponse, getDossiers } from "@/lib/api/fichiers";
import { DocumentProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentCard from "./components/document";
import FolderCard from "./components/folder";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { AxiosError } from "axios";
import EmptyState from "@/app/_components/EmptyState";

export default function FichiersPage() {
 
  /*const folders: FolderProps[] = [
    {
      name: "Documents CSE 2024",
      id: 1,
    },
    {
      name: "Procès-verbaux",
      id: 2,
    },
    {
      name: "Formations & Webinaires",
      id: 3,
    },
    {
      name: "Budgets et Finances",
      id: 4,
    },
    {
      name: "Réglementations & Accords",
      id: 5,
    },
    {
      name: "Élections CSE",
      id: 6,
    },
    {
      name: "Sécurité & CSSCT",
      id: 7,
    },
    {
      name: "Communications",
      id: 8,
    },
    {
      name: "Archives 2023",
      id: 9,
    },
    {
      name: "Archives 2025",
      id: 10,
    },
  ];*/
  const [folders, setFolders] = useState<DossierResponse>();
  const documents: DocumentProps[] = [
    {
      name: "Procès-verbal réunion CSE Janvier 2024",
      id: 1,
    },
    {
      name: "Rapport annuel CSSCT 2023",
      id: 2,
    },
    {
      name: "Convention collective mise à jour",
      id: 3,
    },
    {
      name: "Plan de formation 2024",
      id: 4,
    },
    {
      name: "Bilan social 2023",
      id: 5,
    },
  ];
  const fetchDossiers = async () => {
    const response = await getDossiers();
      setFolders(response);
    
  }
  useEffect(() => {
    const fun = async () => {
      const response = await getDossiers();
      setFolders(response);
    };
    fun();
  }, []);
  return (
    <div className="flex flex-col gap-10 bg-[#FFFFFF99] rounded-[12px] py-5 px-4 min-h-[690px] relative">
      <DialogComponent
        className=""
        dialogContent={<CreateFolder />}
        dialoTrigger={
          <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-fit absolute right-6 -top-11">
            Nouveau
          </Button>
        }
        dialogTitle={null}
      />
      <div className="flex flex-wrap justify-between gap-y-5">
        {documents.map((document, index) => (
          <DocumentCard key={document.id + index} document={document} />
        ))}
      </div>
      <div className="flex flex-wrap gap-5">
        {folders && folders.results?.length > 0 ? folders?.results.map((folder, index) => (
          <FolderCard key={folder.id + index} folder={folder} fetchDossiers={fetchDossiers} />
        )) : <div className="w-full flex justify-center items-center">
        <EmptyState title={"Aucun dossier pour le moment."} description={"Veuillez créez un dossier."}/></div>}
      </div>
      {/*<div className="flex flex-wrap justify-between gap-y-5">
        {files.map((file, index) => (
          <FileCard key={file.id + index} file={file} />
        ))}
      </div>*/}
    </div>
  );
}

const CreateFolder = () => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const folderName = formData.get("nom");
    try {
      if (folderName) {
        await createFolder(folderName?.toString(), null)
        toast.message("Dossier créé avec succès.")
      }
      window.location.reload();
      console.log("Creating folder:", folderName);
      
      
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data?.detail);
        throw error
      }
      
    }
  }
    

  return (
    <form action="" className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label htmlFor="folderName">Nom du dossier</label>
      <Input type="text" id="folderName" required name="nom" />
      <Button type="submit">Créer</Button>
    </form>
  )
}
