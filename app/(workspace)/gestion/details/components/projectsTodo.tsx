import { Project } from "@/lib/api/projets";
import TaskCard from "./project";
import ProjectGroup from "./projectGroup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDroppable } from '@dnd-kit/core';

interface ProjectTodoProps {
  tasks: Project;
  filterBy?: string;
  setRefresh: (refresh: boolean) => void;
}

export default function ProjectsTodo({ tasks, filterBy = "a_faire", setRefresh }: ProjectTodoProps) {
  const categoryLabel = filterBy === "a_faire" ? "À faire" : filterBy === "en_cours" ? "En cours" : "Terminée";
  
  const { setNodeRef } = useDroppable({
    id: filterBy, // Use filterBy as the unique ID for the droppable area
  });

  return (
    <ScrollArea className="w-full lg:w-1/3 px-4 sm:h-[70vh]">
      <div ref={setNodeRef} className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg min-h-[200px]">
        <ProjectGroup categoryLabel={categoryLabel} ProjectId={tasks.id} onSubmitTask={() => {
          setRefresh(true)
        }}/>
        {tasks.taches ? tasks.taches.filter((task) => task.task_type === filterBy).map((task) => (
          <TaskCard
            id={task.id}
            participant={task.assigned_members}
            key={task.id} // Use task.id for a stable key
            title={task.title}
            description={task.description}
            onTaskUpdate={() => {
              setRefresh(true)
            }}
            task_type={task.task_type}
          />
        )) : <p className="text-center text-gray-500">No tasks in this category.</p>}
      </div>
    </ScrollArea>
  );
}
