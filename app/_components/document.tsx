import { MeetingDocument } from "@/lib/types";
import { File, Trash2 } from "lucide-react";
import Link from "next/link";

export default function DocumentComponent({
  document,
  handleDelete,
}: {
  document: MeetingDocument;
  handleDelete?: () => Promise<void>;
}) {
  return (
    <div className="bg-[#FFFFFF99] flex justify-around items-center rounded-[8px] p-3 w-[300px]">
      <Link href={document.fichier} target="blank">
        <div className="flex gap-5 items-center">
          <div className="p-2 rounded-lg bg-coral-100 ">
            <File className="text-coral-400" size={20} />

          </div>
          <h6 className="truncate w-[200px] cursor-pointer hover:underline">{document.nom_fichier}</h6>
        </div>
      </Link>
      {handleDelete && (
        <div className="h-5 w-5 rounded-sm flex justify-center items-center hover:bg-coral-50 cursor-pointer">
          <Trash2 className="text-coral-400" size={20} onClick={async () => await handleDelete()} />
        </div>
      )}
    </div>
  );
}
