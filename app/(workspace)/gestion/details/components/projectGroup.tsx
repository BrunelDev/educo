import { Plus } from "lucide-react";

export default function ProjectGroup() {
  return (
    <div className="flex items-center justify-between p-3 bg-[#ffffffc4] rounded-lg  w-full h-12">
      <div className="flex items-center gap-3">
        <h6 className="text-sm">A faire</h6>
      </div>
      <div className="w-6 h-6 bg-white-100 flex justify-center items-center rounded-sm cursor-pointer">
        <Plus size={18}/>
      </div>
    </div>
  );
}
