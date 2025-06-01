import { Project } from "@/lib/api/projets";
import TaskCard from "./project";

import ProjectGroup from "./projectGroup";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ProjectTodoProps {
  tasks: Project;
  filterBy?: string;
}

export default function ProjectsTodo({ tasks, filterBy = "a_faire" }: ProjectTodoProps) {
  const categoryLabel = filterBy === "a_faire" ? "A faire" : filterBy === "en_cours" ? "En cours" : "Terminée"
  return (
    <ScrollArea className="w-full lg:w-1/3 px-4 sm:h-[70vh]">
      <div className="flex flex-col gap-4">
      <ProjectGroup categoryLabel={categoryLabel} ProjectId={tasks.id} />
      {tasks.taches ? tasks.taches.filter((task)=>task.task_type === filterBy).map((task, index) => (
        <TaskCard
          id={task.id}
          participant={task.assigned_members}
          key={index}
          title={task.title}
          description={task.description}
        />
      )) : null}
      </div>
      
    </ScrollArea>
  );
}
