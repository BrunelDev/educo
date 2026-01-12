"use client";
import ParticipantComponent from "@/app/(workspace)/gestion/details/details_de_la_tache/components/participants";
import AddDocument from "@/app/(workspace)/reunions/details_de_la_reunion/components/addDocument";
import AddMemberDialog from "@/app/(workspace)/reunions/details_de_la_reunion/components/addParticipant";
import { CompteRendu } from "@/app/_components/compteRendu";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentComponent from "@/app/_components/document";
import EmptyState from "@/app/_components/EmptyState";
import { convertLexicalJsonToHtml } from "@/app/_components/lexicalViewer";
import {
  addDocument,
  Consultation,
  getOneConsultation,
  removeDocumentFromConsultation,
  removeMemberFromConsultation,
  updateConsultation,
} from "@/lib/api/consultation";
import { RenderDocFirstPage } from "@/lib/utils/renderDocFirstPage";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

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
export default function ConsultationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const [consultation, setConsultation] = useState<Consultation>();
  const [refresh, setRefresh] = useState(false);
  // Function to fetch consultation data
  const fetchConsultationData = async () => {
    try {
      const response = await getOneConsultation(parseInt(id));
      setConsultation(response);
    } catch (error) {
      console.error("Error fetching consultation:", error);
    }
  };
  const [openDialog, setOpenDialog] = useState(false);
  const [openDocumentDialog, setOpenDocumentDialog] = useState(false);
  // Function to handle adding members to the consultation
  const handleAddMembers = async (users: number[]): Promise<void> => {
    if (!consultation) return;

    try {
      // Update the consultation with the new participants
      console.log(users);
      await updateConsultation(consultation.id, {
        participants: users,
      });

      // Refresh the consultation data
      await fetchConsultationData();

      // Reload the page to reflect changes
      //window.location.reload();
    } catch (error) {
      console.error("Error adding members:", error);
      throw error;
    } finally {
      setOpenDialog(false);
    }
  };

  // Function to handle adding a document to the consultation
  const handleAddDocument = async (fileUrl: string): Promise<void> => {
    if (!consultation) return;

    try {
      // Extract filename from URL and decode it
      const encodedFileName =
        fileUrl.split("/").pop()?.split("?")[0] || "Document";
      const fileName = decodeURIComponent(encodedFileName);

      // Create document object with the new format
      const document = {
        nom: fileName,
        url: fileUrl,
        consultation: consultation.id,
      };

      // Use the new addDocument function with POST endpoint
      await addDocument(document);
      setRefresh(!refresh);
      // Refresh the consultation data
      const updatedConsultation = await getOneConsultation(consultation.id);
      setConsultation(updatedConsultation);
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
    } finally {
      setOpenDocumentDialog(false);
    }
  };

  // Define fetchConsultationData inside useEffect to avoid dependency issues
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getOneConsultation(parseInt(id));
        setConsultation(response);
      } catch (error) {
        console.error("Error fetching consultation:", error);
      }
    };

    fetchData();
  }, [id, refresh]);
  if (consultation) {
    return (
      <div className="pt-5">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
        >
          <ArrowLeft size={20} />
          <span className="font-semibold">Retour</span>
        </button>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between w-full">
                  <h1 className="text-lg font-bold">
                    {consultation.type_consultation_display}
                  </h1>
                  <div
                    className={`${
                      consultation.statut === "En attente"
                        ? "bg-crimson-400"
                        : "bg-white-50"
                    } w-fit py-1 px-2 flex justify-center items-center rounded-full place-self-end`}
                  >
                    <h6
                      className={`text-xs text-nowrap sm:text-lg ${
                        consultation.statut === "En attente" ? "text-white" : ""
                      }`}
                    >
                      {consultation.statut}
                    </h6>
                  </div>
                </div>

                <h6>{consultation.description}</h6>
              </div>
            </div>
            <div className="flex gap-3">
              <Users />
              <h6>Participants</h6>
              <DialogComponent
                className={"min-w-0 px-1 sm:px-3"}
                open={openDialog}
                onOpenChange={setOpenDialog}
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

            <div className="flex justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 w-full gap-x-5">
                {consultation.participants_details?.length > 0 ? (
                  consultation.participants_details?.map(
                    (participant, index) => (
                      <ParticipantComponent
                        handleDelete={async () => {
                          await removeMemberFromConsultation(
                            consultation.id,
                            participant.utilisateur_details.id
                          );
                          await fetchConsultationData();
                          setRefresh(!refresh);
                        }}
                        key={participant.utilisateur_details.id + index}
                        participant={participant.utilisateur_details}
                      />
                    )
                  )
                ) : (
                  <EmptyState
                    title={"Pas de participants"}
                    description={"Veuillez ajouter un participant"}
                  />
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Users />
              <h6>Documents joints</h6>
              <DialogComponent
                open={openDocumentDialog}
                onOpenChange={setOpenDocumentDialog}
                dialoTrigger={
                  <div className="h-6 w-6 bg-[#FFFFFF] flex justify-center items-center rounded-[4px]">
                    <Plus size={20} />
                  </div>
                }
                dialogContent={
                  <AddDocument handleFileSubmit={handleAddDocument} />
                }
                dialogTitle={null}
              />
            </div>
            <div className="flex justify-between">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 w-full gap-x-5">
                {consultation.documents?.length > 0 ? (
                  consultation.documents?.map((document, index) => (
                    <DocumentComponent
                      document={{
                        fichier: document.url,
                        nom_fichier: document.nom,
                        id: document.id,
                        reunion: document.id,
                        type_document: document.nom_fichier,
                      }}
                      handleDelete={async () => {
                        await removeDocumentFromConsultation(document.id);
                        await fetchConsultationData();
                        setRefresh(!refresh);
                      }}
                      key={index * 3}
                    />
                  ))
                ) : (
                  <div className="w-full flex justify-center items-center">
                    <EmptyState
                      title={"Pas de document"}
                      description={"Veuillez ajouter un document"}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <CompteRendu
          firstPage={RenderDocFirstPage({
            title: consultation.type_consultation_display || "Consultation",
            object:
              consultation.description || "Description de la consultation",
            date: formatDateToFrench(
              consultation.date_creation
                ? new Date(consultation.date_creation).toLocaleString("fr-FR")
                : new Date().toLocaleString("fr-FR"),
              false
            ),
            startTime: formatDateToFrench(
              consultation.date_creation
                ? new Date(consultation.date_creation).toLocaleString("fr-FR")
                : new Date().toLocaleString("fr-FR"),
              true
            ),
            participants:
              consultation.participants_details?.map(
                (participant) => participant.utilisateur_details.nom_complet
              ) || [],
            absentees: [], // Consultations don't track absent participants
            agenda:
              convertLexicalJsonToHtml(consultation.description || "") || "",
          })}
          handleSubmiting={async (text: string) => {
            await updateConsultation(consultation.id, { compte_rendu: text });
            await fetchConsultationData();
            setRefresh(!refresh);
          }}
          initialCompteRendu={consultation.compte_rendu || ""}
        />
      </div>
    );
  }
}
