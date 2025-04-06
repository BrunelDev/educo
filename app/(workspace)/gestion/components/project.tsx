"use client"
import { Project } from "@/lib/api/projets";
import { Ellipsis, FilePenLine, LucideIcon, Trash2 } from "lucide-react";
import { Popover } from "../../components/popover";
import Link from "next/link";
interface ProjectCardProps {
  project : Project
}
export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <div className= "relative bg-[#ffffff] w-[300px] h-[120px] rounded-[12px] py-4 px-3">
      <Link href={`/gestion/details/${project.id}`} className= "flex flex-col gap-3 justify-between text-sm cursor-pointer" >
      <div className="flex justify-between">
        <h6 className="truncate font-bold">{project.title}</h6>
        
      </div>
      <h6 className="text-xs">{project.description}</h6>
      <div className="flex justify-between">
        <div className={`w-fit h-[22px] p-2 rounded-[8px] flex items-center justify-center  ${project.status === "termine" ? "bg-white" : "bg-crimson-400 text-white"}`}>
          <h6 className="text-xs">{project.status_display}</h6>
        </div>
      </div>
      
      </Link>
      <Popover
                PopoverContent={<PopoverContent />}
                PopoverTrigger={
                  <div className="p-1 absolute right-2 top-3 z-50 hover:bg-white-100 flex justify-center items-center rounded-[8px]">
                    <Ellipsis size={20} />
                  </div>
                }
              />
    </div>
    
  );
}



interface PopoverContent {
  label: string;
  handleClick: () => void;
  icon?: LucideIcon;
}

const deleteItem = () => {
  console.log("delete");
};

const rename = () => {
  console.log("delete");
};

const PopoverContent = () => {
  const content = [
    {
      label: "Renommer",
      icon: FilePenLine,
      handleClick: rename,
    },
    {
      label: "Supprimer",
      icon: Trash2,
      handleClick: deleteItem,
    },
  ];
  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
      {content.map((content, i) => {
        const Icon = content.icon;
        return (
          <div
            key={content.label + i}
            className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex  items-center justify-around py-1"
            onClick={() => {
              content.handleClick();
            }}
          >
            {Icon ? <Icon size={18} /> : null}
            <h6>{content.label}</h6>
          </div>
        );
      })}
    </div>
  );
};
