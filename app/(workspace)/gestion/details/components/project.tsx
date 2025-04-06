import { Ellipsis, Paperclip } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export default function TaskCard({
  title,
  description,
  id
}: {
  title: string;
    description: string;
  id : number
}) {
  const router = useRouter();
  const pathname = usePathname();
  return (
    <div className="py-2 px-3 rounded-[8px] flex flex-col gap-3 bg-[#FFFFFF99]">

      <div
        className="flex justify-between items-center"
        onClick={() => router.push(pathname+`/detailsTaches/${id}`)}
      >
        <h6>{title}</h6>

        <Ellipsis />
      </div>
      <p>{description}</p>
      <div className="w-full border-b"></div>
      <div className="flex justify-between">
        <h6>Nombre de participant</h6>
        <div className="flex gap-1">
          <Paperclip width={15} />
          <h6>2</h6>
        </div>
      </div>
    </div>
  );
}
