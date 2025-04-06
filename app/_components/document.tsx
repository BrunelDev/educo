import { MeetingDocument } from "@/lib/types";
import { File } from "lucide-react";
import Link from "next/link";

export default function DocumentComponent({
  document,
}: {
  document: MeetingDocument;
}) {
  return (
    <div className="bg-[#FFFFFF99] flex gap-3 rounded-[8px] p-3 w-[450px]">
      <Link href={document.fichier} target="blank">
        <div className="flex gap-5 items-center">
          <div className="p-2 rounded-lg bg-coral-100 ">
            <File className="text-coral-400" size={20} />

          </div>
          <h6 className="w-[370px] truncate">{document.nom_fichier}</h6>
        </div>
      </Link>
    </div>
  );
}
