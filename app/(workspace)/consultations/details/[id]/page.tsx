"use client";
import ParticipantComponent from "@/app/(workspace)/gestion/details/details_de_la_tache/components/participants";
import AddDocument from "@/app/(workspace)/reunions/details_de_la_reunion/components/addDocument";
import AddMemberDialog from "@/app/(workspace)/reunions/details_de_la_reunion/components/addParticipant";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentComponent from "@/app/_components/document";
import EmptyState from "@/app/_components/EmptyState";
import { Consultation, getOneConsultation } from "@/lib/api/consultation";
import { Ellipsis, Plus, Users } from "lucide-react";
import { use, useEffect, useState } from "react";

export default function ConsultationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [consultation, setConsultation] = useState<Consultation>();
  useEffect(() => {
    const fetchConsultationData = async () => {
      const response = await getOneConsultation(parseInt(id));
      setConsultation(response);
    };
    fetchConsultationData();
  }, [id]);
  if (consultation) {
    return (
      <div>
        <div className="flex flex-col gap-5 pt-5">
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
                {consultation.participants?.length > 0 ? consultation.participants?.map((participant, index) => (
                  <ParticipantComponent
                    key={participant.id + index}
                    participant={participant}
                  />
                )) : <EmptyState title={"Pas de participants"} description={"Veuillez ajouter un participant"}/>}
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
                {consultation.documents?.length > 0 ?consultation.documents?.map((participant, index) => (
                  <DocumentComponent document={participant} key={index * 3} />
                )) : <div className="w-full flex justify-center items-center">
                    <EmptyState title={"Pas de document"} description={"Veuillez ajouter un document"}/>
                </div> }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
