import React from "react";
import Image from "next/image";
import { Minus } from "lucide-react";

interface ParticipantComponentProps {
  participant: {
    id: number;
    email: string;
    nom_complet: string;
    photo: string;
  };
  handleDelete?: () => void;
}
export default function ParticipantComponent({
  participant,
  handleDelete,
}: ParticipantComponentProps) {
  return (
    <div className="w-[320px] p-4 flex justify-between bg-[#FFFFFF99] rounded-[8px]">
      <Image
        src={participant.photo || "/userProfile-img.png"}
        width={36}
        height={36}
        style={{ objectFit: "cover", width: "36px", height: "36px" }}
        alt={`${participant.nom_complet} profile image`}
        className="rounded-full"
      />
      <h6 className="w-2/3 truncate">{participant.nom_complet !== " " && participant.nom_complet !== "" ? participant.nom_complet : participant.email}</h6>
      <div
        className="cursor-pointer hover:bg-gray-100 p-2 rounded-[4px]"
        onClick={
          handleDelete ||
          (() => {
            console.log("handleDelete not defined");
          })
        }
      >
        <Minus />
      </div>
    </div>
  );
}
