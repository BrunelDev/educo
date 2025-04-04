"use client";
import ParticipantComponent from "@/app/(workspace)/gestion/details/details_de_la_tache/components/participants";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentComponent from "@/app/_components/document";
import LexicalView from "@/app/_components/LexicalView";
import { getOneMeting } from "@/lib/api/reunion";
import { formatDateToFrench } from "@/lib/functions";
import { Meeting } from "@/lib/types";
import { Calendar, Plus, Users } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import AddDocument from "../components/addDocument";
import AddMemberDialog from "../components/addParticipant";
import EmptyState from "@/app/_components/EmptyState";

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
      console.log(response.ordre_du_jour[0].description);
    };
    fetchMeeting();
  }, [id]);
  if (meeting) {
    return (
      <div className="flex flex-col gap-5 pt-5 text-sm">
        <div className="flex gap-8 items-center">
          <div className="bg-gradient-to-r from-coral-400 to-crimson-400 h-fit py-[6px] px-2 rounded-[8px] text-white">
            {meeting.type_reunion}
          </div>
          <div className="h-9 border border-coral-500"></div>
          <div className="flex flex-col">
            <h6 className="text-xl font-bold">{meeting.titre}</h6>
            <div className="flex gap-3">
              <Calendar size={20} />
              <h6>{formatDateToFrench(meeting.date_heure.toString())}</h6>
            </div>
          </div>
        </div>
        <Box meeting={meeting} />
        <div className="flex justify-between">
          <div className="w-2/3 flex flex-col gap-4">
            <div className="flex gap-3">
              <Users />
              <h6>Participants</h6>
              <DialogComponent
                dialoTrigger={
                  <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
                    <Plus size={20} />
                  </div>
                }
                dialogContent={
                  <AddMemberDialog
                    handleSubmission={function (
                      users: number[]
                    ): Promise<void> {
                      console.log(users);
                      throw new Error("Function not implemented.");
                    }}
                  />
                }
                dialogTitle={null}
              />
            </div>

            <div className="flex justify-between">
              <div className="grid grid-cols-2 gap-y-3 max-w-2/3 gap-x-5">
                {meeting.participants.length > 0 ? meeting.participants.map((participant, index) => (
                  <ParticipantComponent
                    key={participant.utilisateur_details.id + index}
                    participant={participant.utilisateur_details}
                  />
                )) : <EmptyState title={"Pas de participants pour le moment"} description={""}/>}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Users />
              <h6>Documents joints</h6>
              <DialogComponent
                dialoTrigger={
                  <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
                    <Plus size={20} />
                  </div>
                }
                dialogContent={
                  <AddDocument
                    handleFileSubmit={function (
                      fileurl: string
                    ): Promise<void> {
                      console.log(fileurl);
                      throw new Error("Function not implemented.");
                    }}
                  />
                }
                dialogTitle={null}
              />
            </div>
            <div className="flex justify-between">
              <div className="grid grid-cols-2 gap-y-3 max-w-2/3 gap-x-5">
                {meeting.documents.length > 0
                  ? meeting.documents.map((participant, index) => (
                      <DocumentComponent
                        document={participant}
                        key={index * 3}
                      />
                    ))
                  : <EmptyState title={"Pas de document pour le moment"} description={""}/>}
              </div>
            </div>
          </div>
          <div className="h-[450px] w-[350px] bg-[#FFFFFF99] p-3 flex flex-col gap-4 rounded-[8px]">
            <div className="pb-2 border-b border-white-200">
              <h1 className="font-bold text-lg">Résumé de la reunion</h1>
            </div>

            {meeting.ordre_du_jour[0].description ? (
              <LexicalView
                editorStateJSON={meeting.ordre_du_jour[0].description}
              />
            ) : (
              "Description manquante"
            )}
            <div></div>
          </div>
        </div>
      </div>
    );
  }
  return <div></div>;
}

const Box = ({ meeting }: { meeting: Meeting }) => {
  return (
    <div className="bg-white w-full rounded-[8px] py-2 px-3 flex flex-col gap-3 text-sm">
      <h6>{meeting.objet ? meeting.objet : "Objet manqant"}</h6>
      <div className="rounded-[8px] p-[6px] bg-white-100 w-fit">
        <h6 className="text-xs">{meeting.emplacement}</h6>
      </div>
      {meeting.lien_reunion ? (
        <Link href={meeting.lien_reunion}>
          <h6 className="underline text-coral-500">Lien de la reunion</h6>
        </Link>
      ) : null}
    </div>
  );
};
