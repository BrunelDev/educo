import { ParticipantProps } from "@/lib/types";
import { Ellipsis, Plus, Users } from "lucide-react";
import CommentInput from "./components/commentInput";
import ParticipantComponent from "./components/participants";

export default function TacheDetails() {
  const participantsList: ParticipantProps[] = [
    {
      id: "1",
      name: "John Doe",
      role: "Chef de Projet",
      profileImage: "/hostImage.png",
    },
    {
      id: "1",
      name: "John Doe",
      role: "Chef de Projet",
      profileImage: "/hostImage.png",
    },
    {
      id: "1",
      name: "John Doe",
      role: "Chef de Projet",
      profileImage: "/hostImage.png",
    },
    {
      id: "1",
      name: "John Doe",
      role: "Chef de Projet",
      profileImage: "/hostImage.png",
    },
    {
      id: "1",
      name: "John Doe",
      role: "Chef de Projet",
      profileImage: "/hostImage.png",
    },
    {
      id: "1",
      name: "John Doe",
      role: "Chef de Projet",
      profileImage: "/hostImage.png",
    },
    {
      id: "1",
      name: "John Doe",
      role: "Chef de Projet",
      profileImage: "/hostImage.png",
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="space-y-1">
          <h1 className="text-lg font-bold">
            Planifier la formation des élus sur le droit du travail
          </h1>

          <h6>
            Rédiger et structurer le compte rendu de la réunion du 15 mars sur
            les sujets abordés : budget, formation des élus, actions sociales,
            etc.
          </h6>
        </div>
        <div>
          <Ellipsis />
        </div>
      </div>
      <div className="flex gap-3">
        <Users />
        <h6>Participants</h6>
        <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center">
          <Plus size={20}/>
        </div>
      </div>

      <div className="flex justify-between">
        <div className="grid grid-cols-2 gap-y-3 max-w-2/3 gap-x-5">
          {participantsList.map((participant, index) => (
            <ParticipantComponent
              key={participant.id + index}
              participant={participant}
            />
          ))}
        </div>
        <div className="w-1/3">
          <CommentInput />
        </div>
          </div>
          

          <div className="flex gap-3 mt-6">
        <Users />
        <h6>Documents joints</h6>
        <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center">
          <Plus size={20}/>
        </div>
        </div>
    </div>
  );
}
