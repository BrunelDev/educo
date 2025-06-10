"use client";
import { Input } from "@/components/ui/input";
import { deleteProject, Project, updateProject } from "@/lib/api/projets";
import { Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Popover } from "../../components/popover";
interface ProjectCardProps {
  project: Project;
  onSubmitProject: () => void;
}
export default function ProjectCard({ project, onSubmitProject }: ProjectCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative bg-[#ffffff] w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] xl:w-[calc(25%-0.75rem)] h-[120px] rounded-[12px] py-4 px-3 flex flex-col justify-between">
      <Link
        href={`/gestion/details/${project.id}`}
        className="flex flex-col gap-3 justify-between text-sm cursor-pointer h-full"
      >
        <div className="flex justify-between">
          <h6 className="truncate font-bold">{project.title}</h6>
        </div>
        <h6 className="text-xs truncate">{project.description}</h6>
        <div className="flex justify-between">
          <div
            className={`w-fit h-[22px] p-2 rounded-[8px] flex items-center justify-center  ${
              project.status === "termine"
                ? "bg-white"
                : "bg-crimson-400 text-white"
            }`}
          >
            <h6 className="text-xs">{project.status_display}</h6>
          </div>
        </div>
      </Link>
      <Popover
        open={open}
        onOpenChange={setOpen}
        PopoverContent={<PopoverContent project={project} onSubmit={() => {
          setOpen(false)
      onSubmitProject()
          }}/>
        }
        PopoverTrigger={
          <div className="w-6 h-6 justify-center items-center rounded-sm cursor-pointer flex hover:bg-coral-50 duration-200 absolute right-2 top-3 z-50">
            <Ellipsis className="" size={18} />
          </div>
        }
      />
    </div>
  );
}

interface PopoverContentProps {
  project: Project;
  onSubmit: () => void;
}

const PopoverContent = ({ project, onSubmit }: PopoverContentProps) => {
  const [updatedName, setUpdatedName] = useState(project.title);

  // Function to delete the project
  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id);
      toast.success("Projet supprimé avec succès");
      onSubmit();
    } catch (error: unknown) {
      console.error("Error deleting project:", error);
      toast.error("Erreur lors de la suppression du projet");
    }
  };

  // Function to update the project name
  const handleUpdateProjectName = async () => {
    if (!updatedName.trim()) {
      toast.error("Le nom du projet ne peut pas être vide");
      return;
    }

    try {
      await updateProject(project.id, { title: updatedName });
      toast.success("Projet renommé avec succès");
      onSubmit();
    } catch (error: unknown) {
      console.error("Error updating project:", error);
      toast.error("Erreur lors de la mise à jour du projet");
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
                placeholder="Nom du projet"
                value={updatedName}
                onChange={(e) => {
                  setUpdatedName(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    handleUpdateProjectName();
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
        onClick={handleDeleteProject}
      >
        <Trash2 size={18} />
        <h6>Supprimer</h6>
      </div>
    </div>
  );
};
