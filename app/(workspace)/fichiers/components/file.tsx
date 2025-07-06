import { Input } from "@/components/ui/input";
import {
  Dossier,
  Fichier,
  FoldersList,
  deleteFile,
  updateFile,
} from "@/lib/api/fichiers";
import {
  Download,
  EllipsisVertical,
  ExternalLink,
  FileAudio,
  FileImage,
  File as FilePdf,
  FilePenLine,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Popover } from "../../components/popover";
import { getFoldersList, moveFileToFolder } from "@/lib/api/fichiers";
import {
  Select,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";

interface FileCardProps {
  file: Fichier;
  onFileDeleted?: () => void;
  onFileUpdated?: () => void;
}

export default function FileCard({
  file,
  onFileDeleted,
  onFileUpdated,
}: FileCardProps) {
  const [imageError, setImageError] = useState(false);

  // Determine file type based on extension or content type
  const getFileInfo = () => {
    const fileName = file.nom;
    const fileExtension = fileName.split(".").pop()?.toLowerCase() || "";

    // Default values
    let IconComponent = FileText;
    let fileType = "Document";
    let bgColor = "bg-gray-100";
    let iconColor = "text-gray-500";

    // Check file type based on extension
    if (/pdf/.test(fileExtension)) {
      IconComponent = FilePdf;
      fileType = "PDF";
      bgColor = "bg-red-50";
      iconColor = "text-red-500";
    } else if (/doc|docx/.test(fileExtension)) {
      IconComponent = FileText;
      fileType = "Word";
      bgColor = "bg-blue-50";
      iconColor = "text-blue-500";
    } else if (/xls|xlsx|csv/.test(fileExtension)) {
      IconComponent = FileSpreadsheet;
      fileType = "Excel";
      bgColor = "bg-green-50";
      iconColor = "text-green-500";
    } else if (
      /jpg|jpeg|png|gif|webp|svg/.test(fileExtension) ||
      file.type_fichier === "IMAGE"
    ) {
      IconComponent = FileImage;
      fileType = "Image";
      bgColor = "bg-purple-50";
      iconColor = "text-purple-500";
    } else if (/mp3|wav|ogg|m4a/.test(fileExtension)) {
      IconComponent = FileAudio;
      fileType = "Audio";
      bgColor = "bg-yellow-50";
      iconColor = "text-yellow-500";
    } else if (/mp4|mov|avi|wmv|mkv/.test(fileExtension)) {
      IconComponent = FileVideo;
      fileType = "Vidéo";
      bgColor = "bg-pink-50";
      iconColor = "text-pink-500";
    }

    return { IconComponent, fileType, bgColor, iconColor };
  };

  const { IconComponent, fileType, bgColor, iconColor } = getFileInfo();

  // Check if file is an image and has a valid URL
  const isImage =
    (file.type_fichier === "IMAGE" ||
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.nom)) &&
    !!file.url;

  // Function to refresh the file list
  const refreshFiles = () => {
    if (onFileDeleted) {
      onFileDeleted();
    } else {
      // Fallback if no callback provided
      window.location.reload();
    }
  };

  // Function to update the file list
  const refreshAfterUpdate = () => {
    if (onFileUpdated) {
      onFileUpdated();
    } else {
      // Fallback if no callback provided
      window.location.reload();
    }
  };
  const handleDownload = async () => {
    const imageUrl = file.url; 
  
    const response = await fetch(imageUrl, {
      mode: 'cors',
    });
  
    if (!response.ok) {
      alert("Échec du téléchargement");
      return;
    }
  
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
  
    const link = document.createElement('a');
    link.href = url;
    link.download = file.nom; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="py-3 px-2 w-[233px] bg-[#FFFFFF99] rounded-[8px] flex flex-col gap-2 overflow-hidden">
      <div className="flex justify-between items-center">
        <div className={`${iconColor} p-1 rounded-md`}>
          <IconComponent size={18} />
        </div>
        <h6 className="truncate w-[70%]">{file.nom}</h6>
        <div onClick={(e) => e.stopPropagation()}>
          <Popover
            PopoverContent={
              <FilePopoverContent
                file={file}
                onDelete={refreshFiles}
                onUpdate={refreshAfterUpdate}
              />
            }
            PopoverTrigger={
              <div className="w-6 h-6 justify-center items-center rounded-sm cursor-pointer flex hover:bg-coral-50 duration-200">
                <EllipsisVertical className="" size={18} />
              </div>
            }
          />
        </div>
      </div>

      {isImage && !imageError ? (
        <Link href={file.url} target="_blank" className="relative group">
          <div className="w-full h-[180px] relative overflow-hidden rounded-md">
            <Image
              src={file.url}
              fill
              style={{ objectFit: "cover" }}
              alt={file.nom}
              onError={() => setImageError(true)}
              className="group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
          </div>
        </Link>
      ) : (
        <div
          className={`${bgColor} rounded-md p-4 flex flex-col items-center justify-center h-[180px]`}
        >
          <div className={`${iconColor} p-3 rounded-full mb-3`}>
            <IconComponent size={40} />
          </div>
          <p className="text-sm font-medium text-center mb-2 truncate w-full">
            {file.nom}
          </p>
          <p className="text-xs text-gray-500 mb-4">{fileType}</p>

          <div className="flex gap-2">
            <Link
              href={file.url}
              target="_blank"
              className="p-2 rounded-md hover:bg-white text-gray-600 transition-colors"
              title="Ouvrir"
            >
              <ExternalLink size={16} />
            </Link>
            <button
              onClick={async () => {
                await handleDownload();
              }}
              className="p-2 rounded-md hover:bg-white text-gray-600 transition-colors cursor-pointer"
              title="Télécharger"
            >
              <Download size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface FilePopoverContentProps {
  file: Fichier;
  onDelete: () => void;
  onUpdate: () => void;
}

const FilePopoverContent = ({ file }: FilePopoverContentProps) => {
  const [updatedName, setUpdatedName] = useState(file.nom);
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

  // Function to delete the file
  const handleDeleteFile = async () => {
    try {
      await deleteFile(file.id);
      toast.success("Fichier supprimé avec succès");
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error deleting file:", error);
      toast.error("Erreur lors de la suppression du fichier");
    }
  };

  // Function to update the file name
  const handleUpdateFileName = async () => {
    if (!updatedName.trim()) {
      toast.error("Le nom du fichier ne peut pas être vide");
      return;
    }

    try {
      await updateFile(file.id, { nom: updatedName });
      toast.success("Fichier renommé avec succès");
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error updating file:", error);
      toast.error("Erreur lors de la mise à jour du fichier");
    }
  };
  const handleMoveFileToFolder = async (folderId: number) => {
    try {
      await moveFileToFolder(file.id, folderId);
      toast.success("Fichier déplacé avec succès");
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error moving file:", error);
      toast.error("Erreur lors du déplacement du fichier");
    }
  };

  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
      <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1">
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
                    handleUpdateFileName();
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
        onClick={handleDeleteFile}
      >
        <Trash2 size={18} />
        <h6>Supprimer</h6>
      </div>
      <Popover
        PopoverContent={
          <div>
            {/* List of folders getFoldersList */}

            <Select
              value={file.dossier.toString()}
              onValueChange={(value) => {
                handleMoveFileToFolder(Number(value));
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
            <h6>Deplacer</h6>
          </div>
        }
      />
    </div>
  );
};
