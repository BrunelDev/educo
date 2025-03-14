"use client"
import { Project, ProjectStatus } from "@/lib/types";
import { Ellipsis } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectCard({ project }: Project) {
  const router = useRouter();
  return (
    <div className="bg-[#ffffff] w-[300px] h-[120px] rounded-[12px] py-4 px-3 flex flex-col justify-between text-sm cursor-pointer" onClick={()=> router.push("/gestion/details")}>
      <div className="flex justify-between">
        <h6 className="truncate font-bold">{project.title}</h6>
        <Ellipsis size={18}/>
      </div>
      <h6 className="text-xs">{project.description}</h6>
      <div className="flex justify-between">
        <div className={`w-fit h-[22px] p-2 rounded-[8px] flex items-center justify-center  ${project.status === ProjectStatus.Completed ? "bg-white" : "bg-crimson-400 text-white"}`}>
          <h6 className="text-xs">{project.status}</h6>
        </div>
      </div>
    </div>
  );
}
