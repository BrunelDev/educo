"use client";
import { DialogComponent } from "@/app/_components/dialogComponent";
import EmptyState from "@/app/_components/EmptyState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createFolder, Dossier, getDossiers } from "@/lib/api/fichiers";
import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FolderCard from "./components/folder";

export default function FichiersPage() {
  const [isCreateFolderDialogOpen, setIsCreateFolderDialogOpen] = useState(false);
  const [folders, setFolders] = useState<Dossier[]>();
 
  const [refresh, setRefresh] = useState(false)
  useEffect(() => {
    const fun = async () => {
      const response = await getDossiers();
      
      setFolders(response);
    };
    fun();
  }, [refresh]);
  return (
    <div className="flex flex-col gap-10 bg-[#FFFFFF99] rounded-[12px] py-5 px-3 sm:px-6 min-h-[690px] relative w-full">
      <div className="flex justify-center items-center w-full">
      <DialogComponent
        open={isCreateFolderDialogOpen}
        onOpenChange={setIsCreateFolderDialogOpen}
        className=""
        dialogContent={<CreateFolder handleClose={() => { setIsCreateFolderDialogOpen(false); setRefresh(!refresh); }} />}
        dialoTrigger={
          <Button className="bg-gradient-to-r from-[#FE6539] to-crimson-400 w-2/3 sm:w-fit absolute right-8 sm:right-6 -top-11 sm:-top-11 text-sm sm:text-base">
            Nouveau
          </Button>
        }
        dialogTitle={null}
      />
      </div>
      
     
      {/* Folders grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {folders && folders.length > 0 ? folders.filter((folder) => folder.type_dossier === "DEFAULT").map((folder, index) => (
          <FolderCard key={folder.id + index} folder={folder} fetchDossiers={() => {setRefresh(!refresh)}} />
        )) : <div className="col-span-full flex justify-center items-center py-8">
        <EmptyState title={"Aucun dossier pour le moment."} description={"Veuillez créez un dossier."}/></div>}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
        {folders && folders.length > 0 ? folders.filter((folder) => folder.type_dossier !== "DEFAULT").map((folder, index) => (
          <FolderCard key={folder.id + index} folder={folder} fetchDossiers={() => {setRefresh(!refresh)}} />
        )) : <div className="col-span-full flex justify-center items-center py-8">
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

const CreateFolder = ({ handleClose }: { handleClose?: () => void }) => {
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const folderName = formData.get("nom");
    try {
      if (folderName) {
        await createFolder(folderName?.toString(), null)
        toast.message("Dossier créé avec succès.")
      }
      handleClose?.();
      ;
      
      
    } catch (error) {
console.error(error)
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
      <Button type="submit" className="rounded-[8px] bg-gradient-to-r from-[#FE6539] to-crimson-400">Créer</Button>
    </form>
  )
}
