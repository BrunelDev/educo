import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  deleteDossier,
  Dossier,
  editDossier,
  FoldersList,
  getFoldersList,
  moveFolderToFolder,
} from "@/lib/api/fichiers";
import { useFolderStore } from "@/store/folders";
import { FilePenLine, Folder, MoreHorizontal, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Popover } from "../../components/popover";

export default function FolderCard({
  folder,
  fetchDossiers,
}: {
  folder: Dossier;
  fetchDossiers: () => void;
}) {
  if (folder.type_dossier === "DEFAULT")
    return (
      <Link href={`/fichiers/dossiers/${folder.id}`}>
        <div className="w-[186px] flex flex-col gap-2 justify-center items-center group hover:bg-[#ffffffdf] duration-200 rounded-[8px] relative">
          <Image
            src={"/folder-icon.svg"}
            width={100}
            height={100}
            alt="document icon"
          />
          <h6 className="text-center">{folder.nom}</h6>
        </div>
      </Link>
    );
  else {
    return (
      <div className="relative hover:bg-white duration-200 rounded-[8px]">
        {" "}
        <Link
          href={`/fichiers/dossiers/${folder.id}`}
          className="flex gap-3 w-[90%]"
        >
          <div className="w-[186px] flex flex-col gap-2 justify-center items-center group">
            <Image
              src={"/folder-icon.svg"}
              width={100}
              height={100}
              alt="document icon"
            />
            <h6 className="text-center">{folder.nom}</h6>
          </div>
        </Link>
        <div className="absolute top-2 right-2">
          <Popover
            PopoverContent={
              <PopoverContent folder={folder} fetchDossiers={fetchDossiers} />
            }
            PopoverTrigger={
              <div className="w-6 h-6 flex justify-center rounded-sm cursor-pointer hover:bg-coral-50  duration-200">
                <MoreHorizontal className="" size={18} />
              </div>
            }
          />
        </div>
      </div>
    );
  }
}

const PopoverContent = ({
  folder,
  fetchDossiers,
}: {
  folder: Dossier;
  fetchDossiers: () => void;
}) => {
  const removeFolder = useFolderStore((state) => state.removeFolder);

  const deleteFolder = async () => {
    try {
      await deleteDossier(folder.id);
      removeFolder(folder.id);
      fetchDossiers();
    } catch (error: unknown) {
      console.error("Error deleting folder", error);
      // You might want to add toast notification here
    }
  };
  const [updatedName, setUpdatedName] = useState(folder.nom);
  const [open, setOpen] = useState(false);
  const [folders, setFolders] = useState<FoldersList | null>(null);

  useEffect(() => {
    const fetchAllFolders = async () => {
      try {
        let allFolders: Dossier[] = [];
        let page = 1;
        let hasMore = true;

        while (hasMore) {
          const response = await getFoldersList(page);
          if (response?.results) {
            allFolders = allFolders.concat(response.results);
          }
          if (response?.next) {
            page++;
          } else {
            hasMore = false;
          }
        }

        setFolders({
          count: allFolders.length,
          next: null,
          previous: null,
          results: allFolders,
        });
      } catch (error) {
        console.error("Error fetching all folders:", error);
        toast.error("Erreur lors de la récupération des dossiers");
      }
    };

    fetchAllFolders();
  }, []);

  const handleMoveFolderToFolder = async (folderId: number) => {
    try {
      await moveFolderToFolder(folder.id, folderId);
      toast.success("Dossier déplacé avec succès");
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error moving file:", error);
      toast.error("Erreur lors du déplacement du fichier");
    }
  };

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
          open={open}
          onOpenChange={setOpen}
          PopoverContent={
            <div>
              <Input
                placeholder="Nom du dossier"
                value={updatedName}
                onChange={(e) => {
                  setUpdatedName(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    console.log("Key Enter down");
                    try {
                      editDossier(folder.id, updatedName);
                      fetchDossiers();
                      setOpen(false);
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

      <Popover
        PopoverContent={
          <div>
            {/* List of folders getFoldersList */}

            <Select
              value={folder.parent?.toString()}
              onValueChange={(value) => {
                handleMoveFolderToFolder(Number(value));
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select a folder" />
              </SelectTrigger>
              <SelectContent>
                {folders?.results.map((folder) => (
                  <SelectItem key={folder.id} value={folder.id.toString()}>
                    {folder.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        }
        PopoverTrigger={
          <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1">
            <Folder size={18} />
            <h6>Déplacer</h6>
          </div>
        }
      />
      <div
        className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1 text-red-600"
        onClick={() => {
          deleteFolder();
        }}
      >
        <Trash2 size={18} />
        <h6>Supprimer</h6>
      </div>
    </div>
  );
};
