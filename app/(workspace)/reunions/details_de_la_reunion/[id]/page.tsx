"use client";
import ParticipantComponent from "@/app/(workspace)/gestion/details/details_de_la_tache/components/participants";
import { CommentSection } from "@/app/_components/comment";
import { CompteRendu } from "@/app/_components/compteRendu";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentComponent from "@/app/_components/document";
import EmptyState from "@/app/_components/EmptyState";
import GoBack from "@/app/_components/goback";
import LexicalView from "@/app/_components/LexicalView";
import { deleteExternalMemberPresence } from "@/lib/api/organisation";
import {
  addDocument,
  addMemberToMeeting,
  createComment,
  deleteComment,
  deleteParticipantFromMeeting,
  getMeetingComments,
  getOneMeting,
  removeDocumentFromMeeting,
  updateComment,
  updateMeeting,
} from "@/lib/api/reunion";
import { formatDateToFrench } from "@/lib/functions";
import { Meeting } from "@/lib/types";
import { RenderDocFirstPage } from "@/lib/utils/renderDocFirstPage";
import { Calendar, Plus, Users } from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import AddDocument from "../components/addDocument";
import AddMemberDialog from "../components/addParticipant";
//import { deleteExternalMemberPresence } from "@/lib/api/organisation";

export default function Detail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [meeting, setMeeting] = useState<Meeting>();
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const fetchMeeting = async () => {
      const response = await getOneMeting(parseInt(id));
      setMeeting(response);
      console.log("---External---", response.participants_externes);
    };
    fetchMeeting();
  }, [id, refresh]);

  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);
  if (meeting) {
    return (
      <div className="flex flex-col gap-5 pt-5 text-sm">
        <GoBack title="Retour" />

        <div className="flex gap-8 items-center">
          <div className="bg-gradient-to-r from-coral-400 to-crimson-400 h-fit py-[6px] px-2 rounded-[8px] text-white">
            {meeting.type_reunion}
          </div>
          <div className="h-9 border border-coral-500"></div>
          <div className="flex flex-col">
            <h6 className="text-xl font-bold">{meeting.titre}</h6>
            <div className="flex gap-3">
              <Calendar size={20} />
              <h6>{formatDateToFrench(meeting.date_heure_debut.toString())}</h6>
            </div>
          </div>
        </div>
        {meeting.emplacement && <Box meeting={meeting} />}
        <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
          <div className="w-full lg:w-2/3 flex flex-col gap-4">
            <div className="flex gap-3">
              <Users />
              <h6>Participants</h6>
              <DialogComponent
                open={dialogOpen1}
                onOpenChange={setDialogOpen1}
                dialoTrigger={
                  <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
                    <Plus size={20} />
                  </div>
                }
                dialogContent={
                  <AddMemberDialog
                    label="Invitez des participants à votre réunion (emails séparés par virgule)"
                    handleEmailSubmission={async (emails: string[]) => {
                      try {
                        await addMemberToMeeting(meeting.id, emails);
                        setDialogOpen1(false);
                      } catch (error) {
                        console.error("Error adding participants:", error);
                        throw error;
                      }
                    }}
                    existingParticipants={meeting.participants.map(
                      (p) => p.utilisateur_details.id
                    )}
                    handleSubmission={async (
                      users: number[]
                    ): Promise<void> => {
                      try {
                        if (!meeting) return;

                        // Format the new participants
                        const newParticipants = users.map((userId) => userId);

                        // Get existing participant IDs to avoid duplicates
                        const existingParticipantIds = meeting.participants.map(
                          (p) => p.utilisateur_details.id
                        );

                        // Filter out users that are already participants
                        const uniqueNewParticipants = newParticipants.filter(
                          (p) => !existingParticipantIds.includes(p)
                        );

                        // Combine existing and new participants
                        const updatedParticipants: number[] = [
                          ...meeting.participants.map((p) => p.utilisateur),
                          ...uniqueNewParticipants,
                        ];

                        // Update the meeting with the new participants
                        await addMemberToMeeting(
                          meeting.id,
                          updatedParticipants
                        );

                        // Reload the page to ensure all data is up-to-date
                        setRefresh((v: boolean) => {
                          return !v;
                        });
                        setDialogOpen1(false);
                      } catch (error) {
                        console.error("Error adding participants:", error);
                        throw error;
                      }
                    }}
                  />
                }
                dialogTitle={null}
              />
            </div>

            <div className="flex justify-between">
              <div className="flex flex-row flex-wrap gap-3 w-full">
                {meeting.participants.length > 0 ? (
                  meeting.participants.map((participant, index) => (
                    <ParticipantComponent
                      label={
                        participant.disponible === "ABSENT"
                          ? "(Absent)"
                          : participant.disponible === "EN_ATTENTE"
                          ? "(En attente)"
                          : "(Présent)"
                      }
                      key={participant.utilisateur_details.id + index}
                      participant={participant.utilisateur_details}
                      handleDelete={async () => {
                        await deleteParticipantFromMeeting(
                          meeting.id,
                          participant.utilisateur_details.id
                        );
                        setRefresh((v: boolean) => {
                          return !v;
                        });
                      }}
                    />
                  ))
                ) : (
                  <EmptyState
                    title={"Pas de participants pour le moment"}
                    description={""}
                  />
                )}
              </div>
              <div>
                {meeting?.participants_externes.length > 0 &&
                  meeting.participants_externes.map(
                    (participant, index) =>
                      participant.email && (
                        <ParticipantComponent
                          label={
                            participant.disponible === "ABSENT"
                              ? "(Absent)"
                              : participant.disponible === "EN_ATTENTE"
                              ? "(En attente)"
                              : "(Présent)"
                          }
                          key={participant.email + index}
                          participant={{
                            id: index,
                            email: participant.email,
                            nom_complet: participant.email,
                            photo: null,
                          }}
                          handleDelete={async () => {
                            await deleteExternalMemberPresence({
                              reunion_id: meeting.id,
                              email: participant.email,
                            });
                            setRefresh((v: boolean) => {
                              return !v;
                            });
                          }}
                        />
                      )
                  )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Users />
              <h6>Documents joints</h6>
              <DialogComponent
                open={dialogOpen2}
                onOpenChange={setDialogOpen2}
                dialoTrigger={
                  <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
                    <Plus size={20} />
                  </div>
                }
                dialogContent={
                  <AddDocument
                    handleFileSubmit={async (
                      fileUrl: string
                    ): Promise<void> => {
                      try {
                        if (!meeting) return;

                        // Extract filename from URL
                        const fileName = fileUrl.split("/").pop() || "document";

                        // Create new document object

                        // Check if document already exists to avoid duplicates
                        const documentExists = meeting.documents.some(
                          (doc) => doc.fichier === fileUrl
                        );

                        if (documentExists) {
                          return; // Document already exists
                        }

                        // Combine existing and new documents

                        // Update the meeting with the new document

                        await addDocument({
                          reunion: meeting.id,
                          nom_fichier: fileName,
                          fichier: fileUrl,
                          type_document: "DOCUMENT",
                        });

                        // Reload the page to ensure all data is up-to-date
                        setRefresh((v: boolean) => {
                          return !v;
                        });
                        setDialogOpen2(false);
                      } catch (error) {
                        console.error("Error adding document:", error);
                        throw error;
                      }
                    }}
                  />
                }
                dialogTitle={null}
              />
            </div>
            <div className="flex justify-between">
              <div className="flex flex-row flex-wrap gap-y-3 w-full gap-x-4">
                {meeting.documents.length > 0 ? (
                  meeting.documents.map((document, index) => (
                    <DocumentComponent
                      document={document}
                      key={index * 3}
                      handleDelete={async () => {
                        await removeDocumentFromMeeting(document.id);
                        setRefresh((v: boolean) => {
                          return !v;
                        });
                        setDialogOpen2(false);
                      }}
                    />
                  ))
                ) : (
                  <EmptyState
                    title={"Pas de document pour le moment"}
                    description={""}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="h-[450px] w-[350px] bg-[#FFFFFF99] p-3 flex flex-col gap-4 rounded-[8px]">
            <div className="pb-2 border-b border-white-200">
              <h1 className="font-bold text-lg">Ordre du jour</h1>
            </div>

            {meeting.ordre_du_jour[0]?.description ? (
              <LexicalView
                editorStateJSON={meeting.ordre_du_jour[0]?.description}
              />
            ) : (
              "Description manquante"
            )}
            <div></div>
          </div>
        </div>
        <CompteRendu
          firstPage={RenderDocFirstPage({
            title: meeting.titre,
            object: meeting.objet,
            date: formatDateToFrench(
              meeting.date_heure_debut.toLocaleString("fr-FR"), false
            ),
            startTime: formatDateToFrench(
              meeting.date_heure_debut.toLocaleString("fr-FR"), true
            ).split(" à ")[1],
            participants: meeting.participants.map(
              (p) => p.utilisateur_details.nom_complet
            ),
            absentees: meeting.participants
              .filter((p) => p.disponible === "ABSENT")
              .map((p) => p.utilisateur_details.nom_complet),
            agenda: meeting.ordre_du_jour[0]?.description || "",
          })}
          handleSubmiting={async (text: string) => {
            await updateMeeting(meeting.id, { compte_rendu: text });
          }}
          initialCompteRendu={meeting.compte_rendu}
        />

        {/* Comment Section */}
        <div>
          <CommentSection
            type="reunion"
            getComments={getMeetingComments}
            createComment={createComment}
            updateComment={updateComment}
            deleteComment={deleteComment}
            reunionId={meeting.id}
            currentUserId={1} // TODO: Replace with actual current user ID from auth context
          />
        </div>
      </div>
    );
  }
  return <div></div>;
}

const Box = ({ meeting }: { meeting: Meeting }) => {
  const temp_emplacement = meeting.emplacement;
  const emplacement = temp_emplacement.map((e) =>
    e === "PHYSIQUE" ? "Physique" : "En ligne"
  );
  return (
    <div className="bg-white w-full rounded-[8px] py-2 px-3 flex flex-col gap-3 text-sm">
      <h6>{meeting.objet ? meeting.objet : "Objet manqant"}</h6>
      {emplacement && (
        <div className="rounded-[8px] p-[6px] bg-white-100 w-fit">
          <h6 className="text-xs">{emplacement.join(", ")}</h6>
        </div>
      )}
      {meeting.lien_reunion ? (
        <Link href={meeting.lien_reunion} target="_blank">
          <h6 className="underline text-coral-500">Lien de la réunion</h6>
        </Link>
      ) : null}
    </div>
  );
};
