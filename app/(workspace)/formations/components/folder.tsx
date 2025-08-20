
import {
  Dossier,
} from "@/lib/api/formations";
import Image from "next/image";
import Link from "next/link";

export default function FolderCard({
  folder,
}: {
  folder: Dossier;
}) {
    return (
      <Link href={`/formations/dossiers/${folder.id}`}>
        <div className="w-[186px] flex flex-col gap-2 justify-center items-center group hover:bg-[#ffffffb7] duration-200 rounded-[8px] relative">
          <Image
            src={"/folder-icon.svg"}
            width={100}
            height={100}
            alt="document icon"
          />
          <h6 className="text-center">{folder.nom}</h6>
        </div>
      </Link>
    );

}

