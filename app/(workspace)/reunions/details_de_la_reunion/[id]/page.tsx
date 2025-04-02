"use client";
import ParticipantComponent from "@/app/(workspace)/gestion/details/details_de_la_tache/components/participants";
import DocumentComponent from "@/app/_components/document";
import { getOneMeting } from "@/lib/api/reunion";
import { Meeting } from "@/lib/types";
import { Ellipsis, Plus, Users } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
export default function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<Meeting>();
  useEffect(() => {
    const fetchMeeting = async () => {
      const response = await getOneMeting(parseInt(id));
      setMeeting(response);
    };
    fetchMeeting();
  }, [id]);
  if (meeting) {
    return (
      <div className="flex flex-col gap-5 pt-5">
        <div className="flex gap-8 items-center">
          <div className="bg-gradient-to-r from-coral-400 to-crimson-400 h-fit py-[6px] px-2 rounded-[8px] text-white">
            {meeting.type_reunion}
          </div>
          <div className="h-9 border border-coral-500"></div>
          <div className="flex flex-col">
            <h6>{meeting.titre}</h6>
            <h6>{meeting.date_heure.toLocaleString()}</h6>
          </div>
        </div>
        <Box meeting={meeting} />
        <div className="flex flex-col gap-4">
          <div className="flex justify-between">
            <div className="space-y-1">
              <h1 className="text-lg font-bold">
                Planifier la formation des élus sur le droit du travail
              </h1>

              <h6>
                Rédiger et structurer le compte rendu de la réunion du 15 mars
                sur les sujets abordés : budget, formation des élus, actions
                sociales, etc.
              </h6>
            </div>
            <div>
              <Ellipsis />
            </div>
          </div>
          <div className="flex gap-3">
            <Users />
            <h6>Participants</h6>
            <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
              <Plus size={20} />
            </div>
          </div>

          <div className="flex justify-between">
                    <div className="grid grid-cols-2 gap-y-3 max-w-2/3 gap-x-5">
              {meeting.participants.map((participant, index) => (
                    <ParticipantComponent
                      key={participant.utilisateur_details.id + index}
                      participant={participant.utilisateur_details}
                    />
                  ))}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Users />
            <h6>Documents joints</h6>
            <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
              <Plus size={20} />
            </div>
                </div>
                <div className="flex justify-between">
            <div className="grid grid-cols-2 gap-y-3 max-w-2/3 gap-x-5">
              {meeting
                ? meeting.documents.map((participant, index) => (
                    <DocumentComponent document={participant} key={index*3}                    />
                  ))
                : null}
            </div>
          </div>
        </div>
      </div>
    );
  }
  return <div></div>;
}

const Box = ({ meeting }: { meeting: Meeting }) => {
  return (
    <div className="bg-white w-full rounded-[8px] py-2 px-3 flex flex-col gap-3">
      <h6>
        {meeting.ordre_du_jour[0]?.description
          ? meeting.ordre_du_jour[0]?.description
          : "Description manqante"}
      </h6>
      <div className="rounded-[8px] p-[6px] bg-white-100 w-fit">
        <h6>{meeting.emplacement}</h6>
      </div>
      <Link href={meeting.lien_reunion}>
        <h6 className="underline text-coral-500">Lien de la reunion</h6>
      </Link>
    </div>
  );
};
