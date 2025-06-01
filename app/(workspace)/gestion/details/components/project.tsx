import { Popover } from "@/app/(workspace)/components/popover";
import { Input } from "@/components/ui/input";
import { deleteTask, TaskUser, updateTask } from "@/lib/api/tache";
import { Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function TaskCard({
  title,
  description,
  id,
  participant,
}: {
  title: string;
  description: string;
  id: number;
  participant: TaskUser[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div
      className="py-2 px-3 rounded-[8px] flex flex-col gap-3 bg-[#FFFFFF99] cursor-pointer hover:bg-gray-100"
      onClick={() => router.push(pathname + `/detailsTaches/${id}`)}
    >
      <div className="flex justify-between items-center">
        <h6>{title}</h6>

        <div onClick={(e) => e.stopPropagation()}>
          <Popover
            PopoverTrigger={<Ellipsis />}
            PopoverContent={<PopoverContent taskId={id} taskTitle={title} />}
          />
        </div>
      </div>
      <p>{description}</p>
      <div className="w-full border-b"></div>
      <div className="flex justify-between">
        <h6>Nombre de participant</h6>
        <div className="flex gap-1">
          <h6>{participant.length}</h6>
        </div>
      </div>
    </div>
  );
}

interface PopoverContentProps {
  taskId: number;
  taskTitle: string;
}

const PopoverContent = ({ taskId, taskTitle }: PopoverContentProps) => {
  const [updatedName, setUpdatedName] = useState(taskTitle);

  // Function to delete the task
  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId);
      toast.success("Tâche supprimée avec succès");
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error deleting task:", error);
      toast.error("Erreur lors de la suppression de la tâche");
    }
  };

  // Function to update the task name
  const handleUpdateTaskName = async () => {
    if (!updatedName.trim()) {
      toast.error("Le nom de la tâche ne peut pas être vide");
      return;
    }

    try {
      await updateTask(taskId, { title: updatedName });
      toast.success("Tâche renommée avec succès");
      window.location.reload();
    } catch (error: unknown) {
      console.error("Error updating task:", error);
      toast.error("Erreur lors de la mise à jour de la tâche");
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
                placeholder="Nom de la tâche"
                value={updatedName}
                onChange={(e) => {
                  setUpdatedName(e.target.value);
                }}
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    handleUpdateTaskName();
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
        onClick={handleDeleteTask}
      >
        <Trash2 size={18} />
        <h6>Supprimer</h6>
      </div>
    </div>
  );
};
