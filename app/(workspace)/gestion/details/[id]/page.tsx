"use client";
import { getProjectById, Project } from "@/lib/api/projets";
import { use, useEffect, useState } from "react";
import ProjectsTodo from "../components/projectsTodo";

export default function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [tasks, SetTasks] = useState<Project>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectById(parseInt(id));
        SetTasks(response);
        console.log("Tasks:", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);

  return (
    <div className="flex flex-col gap-5">
      <h6 className="text-lg font-bold">{tasks ? tasks.title : null}</h6>
      <h6 className="font-medium text-[16px]">{tasks ? tasks.description : null}</h6>
      {tasks ? (
        <div className="flex gap-5">
          <ProjectsTodo tasks={{ ...tasks }} filterBy="a_faire"/>
          <ProjectsTodo tasks={tasks} filterBy="termine"/>
          <ProjectsTodo tasks={tasks} filterBy="en_cours"/>
        </div>
      ) : null}
    </div>
  );
}
