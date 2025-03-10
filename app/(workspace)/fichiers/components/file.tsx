import { File, FileType } from "@/lib/types";
import { EllipsisVertical, FileText, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export default function FileCard({ file }: File) {
  return (
    <div className="py-3 px-2 w-[233px] bg-[#FFFFFF99] rounded-[8px] flex flex-col gap-2">
      <div className="flex justify-between">
        {file.type === FileType.img ? <ImageIcon /> : <FileText />}

        <h6 className="truncate w-[70%]">{file.name}</h6>
        <EllipsisVertical size={18} />
      </div>
      <Image
        src={"/checker.png"}
        width={217}
        height={180}
        alt="checker image"
      />
    </div>
  );
}
