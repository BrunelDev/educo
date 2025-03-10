import { FolderClosed, MoreVertical } from "lucide-react";
import { Folder } from "@/lib/types";

export default function FolderCard({folder} : Folder) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50 w-[237px] h-12"
    >
      <div className="flex items-center gap-3">
      <FolderClosed />
        <h6 className="text-sm truncate">{folder.name}</h6>
      </div>
      <MoreVertical className="w-5 h-5 text-gray-400" />
    </div>
  );
}
