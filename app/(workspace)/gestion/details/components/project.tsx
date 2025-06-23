import { Popover } from "@/app/(workspace)/components/popover";
import { Input } from "@/components/ui/input";
import { deleteTask, TaskType, TaskUser, updateTask } from "@/lib/api/tache";
import { Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  title: string;
  description: string;
  id: number;
  participant: TaskUser[];
  onTaskUpdate: () => void;
  task_type: TaskType;
}

export default function TaskCard({
  title,
  description,
  id,
  participant,
  onTaskUpdate,
  task_type,
}: TaskCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `task-${id}`,
    data: { id, title, description, participant, task_type },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    touchAction: "none",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className="py-2 px-3 rounded-[8px] flex flex-col gap-3 bg-[#FFFFFF99] cursor-grab hover:bg-gray-100 active:cursor-grabbing"
      onDoubleClick={() => {
        router.push(pathname + `/detailsTaches/${id}`);
      }}
    >
      <div className="flex justify-between items-center">
        <h6
          className={
            task_type === "a_faire"
              ? "text-red-600"
              : task_type === "en_cours"
              ? "text-yellow-600"
              : "text-green-600"
          }
        >
          {title}
        </h6>

        <div
          className="cursor-pointer"
          onPointerDown={(e) => e.stopPropagation()}
        >
          <Popover
            open={open}
            onOpenChange={setOpen}
            PopoverTrigger={<Ellipsis />}
            PopoverContent={
              <PopoverContent
                taskId={id}
                taskTitle={title}
                onSubmit={() => {
                  onTaskUpdate();
                  setOpen(false);
                }}
              />
            }
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
  onSubmit: () => void;
}

const PopoverContent = ({
  taskId,
  taskTitle,
  onSubmit,
}: PopoverContentProps) => {
  const [updatedName, setUpdatedName] = useState(taskTitle);

  // Function to delete the task
  const handleDeleteTask = async () => {
    try {
      await deleteTask(taskId);
      toast.success("Tâche supprimée avec succès");
      onSubmit();
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
      onSubmit();
    } catch (error: unknown) {
      console.error("Error updating task:", error);
      toast.error("Erreur lors de la mise à jour de la tâche");
    }
  };
  const [open, setOpen] = useState(false);

  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
      <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex items-center justify-around py-1">
        <FilePenLine size={18} />
        <Popover
          open={open}
          onOpenChange={setOpen}
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
                    onSubmit();
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
