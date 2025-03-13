import { Popover } from "@/app/(workspace)/components/popover";
import { Document } from "@/lib/types";
import { Download, Ellipsis, FilePenLine, Trash2 } from "lucide-react";
import Image from "next/image";

export default function DocumentCard({ document }: Document) {
  return (
    <div className="w-[186px] flex flex-col gap-2 justify-center items-center group hover:bg-[#ffffffdc] duration-200 rounded-[8px] relative">
      <Image
        src={"/folder-icon.svg"}
        width={100}
        height={100}
        alt="document icon"
      />
      <h6 className="text-center">{document.name}</h6>
      <Popover
        PopoverContent={<PopoverContent />}
        PopoverTrigger={
          <div className="w-6 h-6 justify-center items-center rounded-sm cursor-pointer flex hover:bg-coral-50 absolute top-2 right-2 duration-200">
            <Ellipsis className="" size={18} />
          </div>
        }
      />
    </div>
  );
}

const PopoverContent = () => {
  return (
    <div className="py-2 px-1 text-sm w-[125px] flex flex-col gap-[6px]">
      <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] px-2 flex  items-center justify-around py-1">
        <Download size={18}/>
        <h6>Télécharger</h6>
      </div>
      <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] flex items-center justify-around px-2 py-1">
        <FilePenLine size={18}/>
        <h6>Renommer</h6>
      </div>
      <div className="hover:bg-gray-100 cursor-pointer rounded-[4px] flex justify-around items-center text-red-500 px-2 py-1">
        <Trash2 size={18}/>
        <h6>Supprimer</h6>
      </div>
    </div>
  );
};
