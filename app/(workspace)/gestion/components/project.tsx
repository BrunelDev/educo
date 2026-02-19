"use client";
import { Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverTrigger,
    PopoverContent as ShadcnPopoverContent,
} from "@/components/ui/popover";
import { Popover as CustomPopover } from "../../components/popover";

import {
    deleteProject,
    Project,
    ProjectStatus,
    updateProject,
} from "@/lib/api/projets";

interface ProjectCardProps {
  project: Project;
  onSubmitProject: () => void;
}

export default function ProjectCard({
  project,
  onSubmitProject,
}: ProjectCardProps) {
  const [open, setOpen] = useState(false);
  const [openStatus, setOpenStatus] = useState(false);

  const handleUpdateStatus = async (status: ProjectStatus) => {
    try {
      await updateProject(project.id, { status });
      toast.success("Statut du projet mis à jour avec succès");
      setOpenStatus(false);
      onSubmitProject();
    } catch (error) {
console.error(error)
      ;
      toast.error("Erreur lors de la mise à jour du statut du projet");
    }
  };

  return (
    <div className="sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.666rem)] xl:w-[calc(25%-0.75rem)] h-fit relative">
      <Link
        href={`/gestion/details/${project.id}`}
        className="gap-3 text-sm relative bg-white w-full h-[180px] rounded-[12px] py-4 px-3 flex flex-col cursor-pointer hover:bg-gray-100 duration-200"
      >
        <div className="flex justify-between">
          <h6 className="truncate font-bold">{project.title}</h6>
        </div>
        {/* description can go to 5 lines before truncate*/}
        <h6 className="text-xs text-gray-500 overflow-hidden [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4]">
          {project.description}
        </h6>
      </Link>
      <div className="flex justify-between absolute bottom-5 left-4">
        <Popover open={openStatus} onOpenChange={setOpenStatus}>
          <PopoverTrigger asChild>
            <Badge
              className={`cursor-pointer
                  ${
                    project.status === "termine"
                      ? "bg-green-100 text-green-800"
                      : ""
                  }
                  ${
                    project.status === "en_cours"
                      ? "bg-blue-100 text-blue-800"
                      : ""
                  }
                  ${
                    project.status === "a_faire"
                      ? "bg-yellow-100 text-yellow-800"
                      : ""
                  }
                `}
            >
              {project.status_display}
            </Badge>
          </PopoverTrigger>
          <ShadcnPopoverContent className="w-auto p-0">
            <div className="flex flex-col gap-y-1 p-0">
              <div
                onClick={() => {
                  handleUpdateStatus("a_faire");
                }}
                className="py-1 px-2 text-center text-sm cursor-pointer w-full hover:bg-accent rounded"
              >
                À faire
              </div>
              <div
                onClick={() => handleUpdateStatus("en_cours")}
                className="py-1 px-2 text-center text-sm hover:bg-accent rounded cursor-pointer"
              >
                En cours
              </div>
              <div
                onClick={() => handleUpdateStatus("termine")}
                className="py-1 px-2 text-center text-sm hover:bg-accent rounded cursor-pointer"
              >
                Terminé
              </div>
            </div>
          </ShadcnPopoverContent>
        </Popover>
      </div>
      <CustomPopover
        open={open}
        onOpenChange={setOpen}
        PopoverContent={
          <PopoverMenuContent
            project={project}
            onSubmit={() => {
              setOpen(false);
              onSubmitProject();
            }}
          />
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

const PopoverMenuContent = ({ project, onSubmit }: PopoverContentProps) => {
  const [updatedName, setUpdatedName] = useState(project.title);

  const handleDeleteProject = async () => {
    try {
      await deleteProject(project.id);
      toast.success("Projet supprimé avec succès");
      onSubmit();
    } catch (error: unknown) {
      ;
      toast.error("Erreur lors de la suppression du projet");
    }
  };

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
      ;
      toast.error("Erreur lors de la mise à jour du projet");
    }
  };

  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
      <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1">
        <FilePenLine size={18} />
        <CustomPopover
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
