"use client";
import { getProjectById, Project } from "@/lib/api/projets";
import { use, useEffect, useState } from "react";
import ProjectsTodo from "../components/projectsTodo";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { TaskType, updateTask } from "@/lib/api/tache";
import { toast } from "sonner";
import TaskCard from "../components/project";

// Define a cleaner type for a single task, based on the Project type
type Task = Project["taches"][0];

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [projectDetails, setProjectDetails] = useState<Project>();
  const [refresh, setRefresh] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null); // State for the dragged item

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectById(parseInt(id));
        setProjectDetails(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id, refresh]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    // Find the full task object from the project details using the id from dnd-kit
    const task = projectDetails?.taches.find(
      (t) => `task-${t.id}` === active.id
    );
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.data.current?.task_type !== over.id) {
      const taskId = active.data.current?.id;
      const newStatus = over.id as TaskType;

      try {
        await updateTask(taskId, { task_type: newStatus });
        toast.success("Tâche déplacée avec succès !");
        setRefresh((v) => !v);
      } catch (error) {
        toast.error("Erreur lors du déplacement de la tâche.");
        console.error("Failed to update task:", error);
      }
    }
    setActiveTask(null); // Clear the active task on drag end
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col gap-5 p-4 md:p-6">
        <h6 className="text-xl font-bold mb-2">
          {projectDetails ? projectDetails.title : "Chargement du titre..."}
        </h6>
        <h6 className="font-medium text-base mb-6">
          {projectDetails
            ? projectDetails.description
            : "Chargement de la description..."}
        </h6>
        {projectDetails ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <ProjectsTodo
              tasks={projectDetails}
              filterBy="a_faire"
              setRefresh={() => setRefresh((v: boolean) => !v)}
            />
            <ProjectsTodo
              tasks={projectDetails}
              filterBy="en_cours"
              setRefresh={() => setRefresh((v: boolean) => !v)}
            />
            <ProjectsTodo
              tasks={projectDetails}
              filterBy="termine"
              setRefresh={() => setRefresh((v: boolean) => !v)}
            />
          </div>
        ) : (
          <div className="text-center py-10">Chargement des tâches...</div>
        )}
      </div>
      <DragOverlay>
        {activeTask ? (
          <TaskCard
            id={activeTask.id}
            title={activeTask.title}
            description={activeTask.description}
            participant={activeTask.assigned_members}
            task_type={activeTask.task_type}
            onTaskUpdate={() => {}} // Dummy function for the overlay clone
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
