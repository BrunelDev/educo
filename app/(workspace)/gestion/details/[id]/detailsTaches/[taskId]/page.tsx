"use client";
import AddDocument from "@/app/(workspace)/reunions/details_de_la_reunion/components/addDocument";
import { DialogComponent } from "@/app/_components/dialogComponent";
import { getTaskById, Task } from "@/lib/api/tache";
import { Ellipsis, Plus, Users } from "lucide-react";
import { use, useEffect, useState } from "react";

import ParticipantComponent from "../../../details_de_la_tache/components/participants";
import EmptyState from "@/app/_components/EmptyState";
import AddMemberDialog from "@/app/(workspace)/reunions/details_de_la_reunion/components/addParticipant";
import DocumentComponent from "@/app/_components/document";
import { MessageType } from "@/lib/types";

export default function DetailTache({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [task, setTask] = useState<Task>();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTaskById(parseInt(id));
        // Update the state with the fetched data
        setTask(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [id]);
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
          {task?.assigned_members && task?.assigned_members.length > 0
            ? task.assigned_members.map((participant, index) => (
                <ParticipantComponent
                  key={participant.id + index}
                  participant={{
                    id: participant.id,
                    email: participant.email,
                    nom_complet:
                      participant.first_name + " " + participant.last_name,
                    photo: participant.email,
                  }}
                />
              ))
            : <EmptyState title={"Aucun participant."} description={"Veuillez ajouter des particiapnts"}/>}
        </div>
        <div className="w-1/3">
          {/*<CommentInput />*/}
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
              handleFileSubmit={function (fileurl: string): Promise<void> {
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
          {task?.file_url ? <DocumentComponent document={{
            fichier :task.file_url, nom_fichier :task.title, type_fichier: MessageType.FILE
          }}/>
            : <EmptyState title={"Aucun document."} description={"Veuillez ajouter des documents"}/>}
        </div>
        <div className="w-1/3">
          {/*<CommentInput />*/}
        </div>
      </div>
    </div>
  );
}
