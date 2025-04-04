import { Popover } from "@/app/(workspace)/components/popover";
import { Document } from "@/lib/types";
import {
  Download,
  Ellipsis,
  FilePenLine,
  LucideIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DocumentCard({ document }: Document) {
  return (
    <div className="w-[186px] flex flex-col gap-2 justify-center items-center group hover:bg-[#ffffffdc] duration-200 rounded-[8px] relative">
      <Link href={"/fichiers/documents"}>
      <Image
        unoptimized
        src={"/folder-icon.svg"}
        width={100}
        height={100}
        alt="document icon"
      /></Link>
      
      <h6 className="text-center">{document.name}</h6>
      <Popover
        PopoverContent={<PopoverContent content={[]} />}
        PopoverTrigger={
          <div className="w-6 h-6 justify-center items-center rounded-sm cursor-pointer flex hover:bg-coral-50 absolute top-2 right-2 duration-200">
            <Ellipsis className="" size={18} />
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
interface PopoverContentProps {
  content: PopoverContent[];
}
const deleteItem = () => {
  console.log("delete");
};
const download = () => {
  console.log("delete");
};
const rename = () => {
  console.log("delete");
};
const defaultPopoverContent = [
  {
    label: "Télécharger",
    icon: Download,
    handleClick: download,
  },
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
export const PopoverContent = ({
  content = defaultPopoverContent,
}: PopoverContentProps) => {
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
