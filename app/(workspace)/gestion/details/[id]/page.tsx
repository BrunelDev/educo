"use client";
import { getProjectById, Project } from "@/lib/api/projets";
import { use, useEffect, useState } from "react";
import ProjectsTodo from "../components/projectsTodo";

export default function Detail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [projectDetails, setProjectDetails] = useState<Project>(); // Renamed for clarity
  const [refresh, setRefresh] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getProjectById(parseInt(id));
        setProjectDetails(response);
        console.log("Project Details:", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (id) { // Ensure id is available before fetching
      fetchData();
    }
  }, [id,refresh]); // Removed tasks from dependency array as it causes re-fetch on tasks update by child


  return (
    <div className="flex flex-col gap-5 p-4 md:p-6"> {/* Added padding */}
      <h6 className="text-xl font-bold mb-2"> {/* Adjusted size and margin */}
        {projectDetails ? projectDetails.title : "Chargement du titre..."}
      </h6>
      <h6 className="font-medium text-base mb-6"> {/* Adjusted size and margin */}
        {projectDetails ? projectDetails.description : "Chargement de la description..."}
      </h6>
      {projectDetails ? (
        <div className="flex flex-col lg:flex-row gap-6"> {/* Responsive flex and adjusted gap */}
          <ProjectsTodo tasks={projectDetails} filterBy="a_faire" setRefresh={()=>setRefresh((v:boolean)=>{return !v})}/>
          <ProjectsTodo tasks={projectDetails} filterBy="en_cours" setRefresh={()=>setRefresh((v:boolean)=>{return !v})}/>
          <ProjectsTodo tasks={projectDetails} filterBy="termine" setRefresh={()=>setRefresh((v:boolean)=>{return !v})}/>
        </div>
      ) : (
        <div className="text-center py-10">Chargement des tâches...</div> // Loading state for tasks
      )}
    </div>
  );
}
