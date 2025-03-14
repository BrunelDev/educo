import { Ellipsis, Paperclip } from "lucide-react";

export default function Project({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
      <div className="py-2 px-3 rounded-[8px] flex flex-col gap-3 bg-[#FFFFFF99]">
          <div className="flex justify-between items-center">
      <h6>{title}</h6>
              
          <Ellipsis />
          </div>
      <p>{description}</p>
      <div className="w-full border-b"></div>
      <div className="flex justify-between">
              <h6>numbre de participant</h6>
              <div className="flex gap-1">
                  <Paperclip width={15} />
                  <h6>3</h6>

              </div>
        
      </div>
    </div>
  );
}
