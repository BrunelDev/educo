"use client";
import AddDocument from "@/app/(workspace)/reunions/details_de_la_reunion/components/addDocument";
import AddMemberDialog from "@/app/(workspace)/reunions/details_de_la_reunion/components/addParticipant";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentComponent from "@/app/_components/document";
import EmptyState from "@/app/_components/EmptyState";
import {
  getTaskById,
  removeDocumentFromTask,
  removeMemberFromTask,
  Task,
  updateTask,
} from "@/lib/api/tache";
import { MessageType } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import ParticipantComponent from "../../../details_de_la_tache/components/participants";
import Editor from "@/app/_components/editor";
import "@/app/_components/editorPlugins/style.css";

export default function DetailTache({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = use(params);
  const [task, setTask] = useState<Task>();
  const [refresh, setRefresh] = useState(false);
  const [refresh2, setRefresh2] = useState(false);
  const [refresh3, setRefresh3] = useState(false);
  const [compteRenduContent, setCompteRenduContent] = useState<string>(
    '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}'
  );
  const [isEditingCompteRendu, setIsEditingCompteRendu] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTaskById(parseInt(taskId));
        console.log("Task :", response);
        // Update the state with the fetched data
        setTask(response);
        if (response.compte_rendu) {
          setCompteRenduContent(response.compte_rendu);
        }
        console.log(taskId, "Task :", response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [taskId, refresh, refresh2, refresh3]);

  const handleAddMembers = async (users: number[]): Promise<void> => {
    if (!task) return;

    try {
      // Add each participant individually using addParticipant
      await updateTask(task.id, {
        assigned_member_ids: users,
      });

      // Refresh the task data
      const updatedTask = await getTaskById(parseInt(taskId));
      setTask(updatedTask);

      toast.success("Participants ajoutés avec succès");

      // Reload the page to reflect changes
      setRefresh((v: boolean) => {
        return !v;
      });
    } catch (error) {
      console.error("Error adding members:", error);
      toast.error("Erreur lors de l'ajout des participants");
      throw error;
    }
  };

  const handleAddDocument = async (fileUrl: string): Promise<void> => {
    if (!task) return;

    try {
      // Add document using addDocument function with the updated API format
      await updateTask(task.id, {
        fichiers_urls: [fileUrl],
      });

      // Refresh the task data
      const updatedTask = await getTaskById(parseInt(taskId));
      setTask(updatedTask);

      // Reload the page to reflect changes
      setRefresh2((v: boolean) => {
        return !v;
      });
    } catch (error) {
      console.error("Error adding document:", error);
      toast.error("Erreur lors de l'ajout du document");
      throw error;
    }
  };

  const handleConfirmCompteRendu = async () => {
    if (!task) return;
    try {
      await updateTask(task.id, { compte_rendu: compteRenduContent });
      toast.success("Compte rendu enregistré avec succès.");
      setIsEditingCompteRendu(false);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du compte rendu:", error);
      toast.error("Erreur lors de l'enregistrement du compte rendu.");
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <div className="space-y-2 w-full">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-lg font-bold">{task?.title}</h1>
            <div
              className={`${
                task?.task_type === "a_faire" ? "bg-crimson-400" : "bg-white-50"
              } w-fit py-1 px-2 flex justify-center items-center rounded-full place-self-end`}
            >
              <h6
                className={`${
                  task?.task_type === "a_faire" ? "text-white" : ""
                }`}
              >
                {task?.task_type === "a_faire" ? "À faire" : task?.task_type === "en_cours" ? "En cours" : "Terminé"}
              </h6>
            </div>
          </div>

          <h6>
            {task?.description
              ? task?.description
              : "Description non disponible"}
          </h6>
        </div>
      </div>
      <div className="flex gap-3">
        <Users />
        <h6>Participants</h6>
        <DialogComponent
          open={refresh}
          onOpenChange={setRefresh}
          dialoTrigger={
            <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
              <Plus size={20} />
            </div>
          }
          dialogContent={
            <AddMemberDialog handleSubmission={handleAddMembers} />
          }
          dialogTitle={null}
        />
      </div>

      <div className="flex flex-col sm:flex-row justify-between">
        <div className="flex flex-wrap flex-row gap-4 w-full">
          {task?.assigned_members && task?.assigned_members.length > 0 ? (
            task.assigned_members.map((participant, index) => (
              <ParticipantComponent
                key={participant.id + index}
                participant={{
                  id: participant.id,
                  email: participant.email,
                  nom_complet:
                    participant.first_name + " " + participant.last_name,
                  photo: participant.email,
                }}
                handleDelete={async () => {
                  await removeMemberFromTask(task.id, participant.id);
                }}
              />
            ))
          ) : (
            <EmptyState
              title={"Aucun participant."}
              description={"Veuillez ajouter des particiapnts"}
            />
          )}
        </div>
        <div className="w-full mt-4 sm:mt-0 sm:w-1/3">
          {/*<CommentInput />*/}
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Users />
        <h6>Documents joints</h6>
        <DialogComponent
          open={refresh2}
          onOpenChange={setRefresh2}
          dialoTrigger={
            <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
              <Plus size={20} />
            </div>
          }
          dialogContent={<AddDocument handleFileSubmit={handleAddDocument} />}
          dialogTitle={null}
        />
      </div>
      <div className="flex flex-col sm:flex-row justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 w-full sm:max-w-2/3 gap-x-5">
          {task?.fichiers ? (
            task?.fichiers.map((fichier) => (
              <DocumentComponent
                key={fichier.id}
                document={{
                  fichier: fichier.url,
                  nom_fichier: task.title,
                  type_document: MessageType.FILE,
                  id: task.id,
                  reunion: task.project,
                }}
                handleDelete={async () => {
                  await removeDocumentFromTask(fichier.id, task.id);
                  setRefresh3((v: boolean) => {
                    return !v;
                  });
                }}
              />
            ))
          ) : (
            <EmptyState
              title={"Aucun document."}
              description={"Veuillez ajouter des documents"}
            />
          )}
        </div>
        <div className="w-full mt-4 sm:mt-0 sm:w-1/3">
          {/*<CommentInput />*/}
        </div>
      </div>

      {/* Compte Rendu Section */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-md font-semibold">Compte Rendu</h2>
          <Button
            onClick={() => {
              if (isEditingCompteRendu) {
                handleConfirmCompteRendu();
              } else {
                setIsEditingCompteRendu(true);
              }
            }}
            variant={isEditingCompteRendu ? "default" : "outline"}
          >
            {isEditingCompteRendu ? "Confirmer" : "Modifier"}
          </Button>
        </div>
        <div className="mt-4 w-1/2">
          <Editor disabled={true} />
        </div>
      </div>
    </div>
  );
}
