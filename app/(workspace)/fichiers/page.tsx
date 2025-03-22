"use client"
import { DocumentProps, FileProps, FileType, FolderProps } from "@/lib/types";
import DocumentCard, { PopoverContent }  from "./components/document";
import FolderCard from "./components/folder";
import FileCard from "./components/file";
import { useEffect, useState } from "react";
import { DossierResponse, getDossiers } from "@/lib/api/fichiers";
import { Popover } from "../components/popover";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FichiersPage() {
  const files: FileProps[] = [
    {
      name: "rapport-cse-2024.pdf",
      id: 1,
      type: FileType.other,
    },
    {
      name: "photo-reunion-janvier.jpg",
      id: 2,
      type: FileType.img,
    },
    {
      name: "presentation-budget.pdf",
      id: 3,
      type: FileType.other,
    },
    {
      name: "photo-formation-sst.jpg",
      id: 4,
      type: FileType.img,
    },
    {
      name: "compte-rendu-cssct.pdf",
      id: 5,
      type: FileType.other,
    },
  ];
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
  const [folders, setFolders] = useState<DossierResponse>()
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
  useEffect(() => {
    const fun = async () => {
      const response = await getDossiers()
      setFolders(response)
    }
    fun()
  }, [])
  return (
    <div className="flex flex-col gap-10 bg-[#FFFFFF99] rounded-[12px] py-5 px-4 min-h-[690px] relative">
      <Popover
        className="absolute right-6 -top-11"
        PopoverContent={<PopoverContent />}
        PopoverTrigger={
          <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400">Nouveau</Button>
        }
      />
      <div className="flex flex-wrap justify-between gap-y-5">
        {documents.map((document, index) => (
          <DocumentCard key={document.id + index} document={document} />
        ))}
      </div>
      <div className="flex flex-wrap gap-5">
        {folders?.results.map((folder, index) => (
          <FolderCard key={folder.id + index} folder={folder} />
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-y-5">
        {files.map((file, index) => (
          <FileCard key={file.id + index} file={file} />
        ))}
      </div>
    </div>
  );
}
