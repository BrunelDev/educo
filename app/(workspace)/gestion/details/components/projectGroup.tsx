import { DialogComponent } from "@/app/_components/dialogComponent";
import { Plus } from "lucide-react";
import TaskForm from "./taskForm";
import { useState } from "react";

export default function ProjectGroup({
  categoryLabel,ProjectId,onSubmitTask
}: {
    categoryLabel: string; ProjectId: number;
    onSubmitTask: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex items-center justify-between p-3 bg-[#ffffffc4] rounded-lg  w-full h-12">
      <div className="flex items-center gap-3">
        <h6 className="text-sm">{categoryLabel}</h6>
      </div>
      <div>
      <DialogComponent
        open={open}
        onOpenChange={setOpen}
        dialoTrigger={
          <div className="w-6 h-6 bg-white-100 flex justify-center items-center rounded-sm cursor-pointer">
            <Plus size={18} />
          </div>
        }
        dialogContent={<TaskForm projectId={ProjectId} categoryLabel={categoryLabel} onSubmitTask={()=>{
          onSubmitTask()
          setOpen(false)
        }}/>
        }
        dialogTitle={null}
      />
      </div>
    </div>
  );
}
