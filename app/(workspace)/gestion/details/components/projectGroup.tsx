import { DialogComponent } from "@/app/_components/dialogComponent";
import { Plus } from "lucide-react";
import TaskForm from "./taskForm";

export default function ProjectGroup({
  categoryLabel,ProjectId
}: {
    categoryLabel: string; ProjectId: number;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-[#ffffffc4] rounded-lg  w-full h-12">
      <div className="flex items-center gap-3">
        <h6 className="text-sm">{categoryLabel}</h6>
      </div>
      <DialogComponent
        dialoTrigger={
          <div className="w-6 h-6 bg-white-100 flex justify-center items-center rounded-sm cursor-pointer">
            <Plus size={18} />
          </div>
        }
        dialogContent={<TaskForm projectId={ProjectId} categoryLabel={categoryLabel} />}
        dialogTitle={null}
      />
    </div>
  );
}
