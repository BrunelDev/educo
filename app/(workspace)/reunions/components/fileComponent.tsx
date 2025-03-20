import { FileText, X } from "lucide-react";
import Link from "next/link";

export default function FileComponent({
  link,
  fileName = "Un fichier",
  handleRemove,
}: {
  link: string;
  fileName: string;
  handleRemove: () => void;
}) {
  return (
    <div className="flex justify-between items-center w-full rounded-[8px] border p-3">
      <Link href={link} className="flex gap-3 flex-1">
        <div className="flex gap-3">
          <FileText />
          <h6>{fileName}</h6>
        </div>
      </Link>
      <button className="p-1 rounded-full hover:bg-white-100" onClick={handleRemove}>
        <X />
      </button>
    </div>
  );
}
