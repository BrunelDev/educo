import { Input } from "@/components/ui/input";
import { deleteDossier, Dossier, editDossier } from "@/lib/api/fichiers";
import { useFolderStore } from "@/store/folders";
import { FilePenLine, FolderClosed, MoreVertical, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Popover } from "../../components/popover";


export default function FolderCard({ folder, fetchDossiers }: {folder :Dossier, fetchDossiers : ()=>Promise<void>}) {
  return (
    <div className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 w-[237px] h-12">
      <Link
        href={`/fichiers/dossiers/${folder.id}`}
        className="flex items-center gap-3 w-[90%]"
      >
        <FolderClosed />
        <h6 className="text-sm truncate w-full">{folder.nom}</h6>
      </Link>
      <Popover
        PopoverContent={<PopoverContent folder={folder} fetchDossiers={fetchDossiers} />}
        PopoverTrigger={
          <div className="w-6 h-6 justify-center items-center rounded-sm cursor-pointer flex hover:bg-coral-50  duration-200">
            <MoreVertical className="" size={18} />
          </div>
        }
      />
    </div>
  );
}

const PopoverContent = ({ folder, fetchDossiers }: {folder :Dossier, fetchDossiers : ()=>Promise<void>}) => {

  const removeFolder = useFolderStore((state) => state.removeFolder);

  const deleteFolder = async () => {
    try {
      await deleteDossier(folder.id);
      removeFolder(folder.id);
      fetchDossiers()
    } catch (error: unknown) {
      console.error("Error deleting folder", error);
      // You might want to add toast notification here
    }
  };
  const [updatedName, setUpdatedName] = useState(folder.nom);

  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
      {/*<Link
        href={folder.}
        className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex  items-center justify-around py-1"
        onClick={() => {}}
      >
        <Download size={18} />
        <h6>Télécharger</h6>
      </Link>*/}
      <div
        className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex  items-center justify-around py-1"
        onClick={() => {}}
      >
        <FilePenLine size={18} />
        <Popover
          PopoverContent={
            <div>
              <Input
                placeholder="Nom du fichier"
                value={updatedName}
                onChange={(e) => {
                  setUpdatedName(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    console.log("Key Enter down");
                    try {
                      editDossier(
                        folder.id,
                        updatedName
                      );
                      setUpdatedName("");
                      
                      window.location.reload()
                      //router.refresh();
                    } catch (error) {
                      console.error("Error editing folder", error);
                    }
                  }
                }}
              />
            </div>
          }
          PopoverTrigger={<h6>Renommer</h6>}
        />
      </div>
      <div
        className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1 text-red-600"
        onClick={() => {
          deleteFolder()
        }
        }
      >
        <Trash2 size={18} />
        <h6>Supprimer</h6>
      </div>
    </div>
  );
};
