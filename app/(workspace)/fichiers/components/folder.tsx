import { FolderClosed, MoreVertical } from "lucide-react";

interface FolderProps {
    name: "";
    id: number;
}
interface Folder {
    
  folder: FolderProps;
}
export default function Folder({folder} : Folder) {
  return (
    <div
      className="flex items-center justify-between p-3 bg-white rounded-lg hover:bg-gray-50"
    >
      <div className="flex items-center gap-3">
      <FolderClosed />
        <span className="text-sm">{folder.name}</span>
      </div>
      <MoreVertical className="w-5 h-5 text-gray-400" />
    </div>
  );
}
