"use client";
import AddDocument from "@/app/(workspace)/reunions/details_de_la_reunion/components/addDocument";
import AddMemberDialog from "@/app/(workspace)/reunions/details_de_la_reunion/components/addParticipant";
import CommentSection from "@/app/_components/comment";
import { CompteRendu } from "@/app/_components/compteRendu";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentComponent from "@/app/_components/document";
import EmptyState from "@/app/_components/EmptyState";
import GoBack from "@/app/_components/goback";
import { convertLexicalJsonToHtml } from "@/app/_components/lexicalViewer";
import {
    createComment,
    deleteComment,
    getComments,
    getTaskById,
    removeDocumentFromTask,
    removeMemberFromTask,
    Task,
    updateComment,
    updateCompteRendu,
    updateTask,
} from "@/lib/api/tache";
import { MessageType } from "@/lib/types";
import { RenderDocFirstPage } from "@/lib/utils/renderDocFirstPage";
import { Plus, Users } from "lucide-react";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import ParticipantComponent from "../../../details_de_la_tache/components/participants";

// Helper function to format date
const formatDateToFrench = (dateString: string, timeOnly: boolean = false) => {
  const date = new Date(dateString);
  if (timeOnly) {
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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
  const [compteRenduText, setCompteRenduText] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getTaskById(parseInt(taskId));
        setTask(response);
        setCompteRenduText(response.compte_rendu || "");
      } catch (error) {
console.error(error)
        ;
      }
    };
    fetchData();
  }, [taskId, refresh, refresh2, refresh3]);

  const handleAddMembers = async (users: number[]): Promise<void> => {
    if (!task) return;

    try {
      await updateTask(task.id, {
        assigned_member_ids: users,
      });
      const updatedTask = await getTaskById(parseInt(taskId));
      setTask(updatedTask);

      setRefresh((v) => !v);
    } catch (error) {
console.error(error)
      ;
      toast.dismiss();
      throw error;
    }
  };

  const handleAddDocument = async (fileUrl: string): Promise<void> => {
    if (!task) return;
    toast.loading("Ajout du document...");

    try {
      await updateTask(task.id, {
        fichiers_urls: [fileUrl],
      });
      const updatedTask = await getTaskById(parseInt(taskId));
      ;
      setTask(updatedTask);
      setRefresh3((v) => !v);
      toast.dismiss();
      toast.success("Document ajouté avec succès");
    } catch (error) {
console.error(error)
      ;
      toast.dismiss();
      toast.error("Erreur lors de l'ajout du document");
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <GoBack title="Retour" />
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
                {task?.task_type === "a_faire"
                  ? "À faire"
                  : task?.task_type === "en_cours"
                  ? "En cours"
                  : "Terminé"}
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
                  photo: participant?.photo || "/userProfile-img.png",
                }}
                handleDelete={async () => {
                  try {
                    await removeMemberFromTask(task.id, participant.id);
                    setRefresh3((v) => !v);
                    toast.dismiss();
                  } catch (error) {
console.error(error)
                    ;
                    toast.dismiss();
                    toast.error("Erreur lors de la suppression du participant");
                    throw error;
                  }
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
          {task?.fichiers_urls ? (
            task?.fichiers_urls.map((fichier) => (
              <DocumentComponent
                key={fichier.id}
                document={{
                  fichier: fichier.url,
                  nom_fichier: fichier.nom,
                  type_document: MessageType.FILE,
                  id: task.id,
                  reunion: task.project,
                }}
                handleDelete={async () => {
                  try {
                    await removeDocumentFromTask(fichier.id, task.id);
                    setRefresh3((v) => !v);
                    toast.dismiss();
                    toast.success("Document supprimé avec succès");
                  } catch (error) {
console.error(error)
                    ;
                    toast.dismiss();
                    toast.error("Erreur lors de la suppression du document");
                    throw error;
                  }
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
      {task && (
        <CompteRendu
          firstPage={RenderDocFirstPage({
            title: task.title || "Tâche",
            object: task.description || "Description de la tâche",
            date: formatDateToFrench(new Date().toLocaleString("fr-FR"), false),
            startTime: formatDateToFrench(
              new Date().toLocaleString("fr-FR"),
              true
            ),
            participants:
              task.assigned_members?.map(
                (member) => `${member.first_name} ${member.last_name}`
              ) || [],
            absentees: [], // Tasks don't have absent members, so empty array
            agenda: convertLexicalJsonToHtml(task.description || "") || "",
          })}
          handleSubmiting={async (text: string) => {
            if (!task) return;
            ;
            const res = await updateCompteRendu(task.id, text);
            ;
            setTask((prevTask) =>
              prevTask ? { ...prevTask, compte_rendu: text } : undefined
            );
          }}
          initialCompteRendu={compteRenduText || task.compte_rendu || ""}
        />
      )}
      <div>
        <CommentSection
          reunionId={parseInt(taskId)}
          currentUserId={1} // TODO: Replace with actual current user ID from auth context
          getComments={getComments}
          createComment={createComment}
          updateComment={updateComment}
          deleteComment={deleteComment}
          type="tache"
        />
      </div>
    </div>
  );
}
