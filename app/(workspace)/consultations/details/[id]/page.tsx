"use client";
import ParticipantComponent from "@/app/(workspace)/gestion/details/details_de_la_tache/components/participants";
import AddDocument from "@/app/(workspace)/reunions/details_de_la_reunion/components/addDocument";
import AddMemberDialog from "@/app/(workspace)/reunions/details_de_la_reunion/components/addParticipant";
import { DialogComponent } from "@/app/_components/dialogComponent";
import DocumentComponent from "@/app/_components/document";
import EmptyState from "@/app/_components/EmptyState";
import {
  addDocument,
  Consultation,
  getOneConsultation,
  updateConsultation,
} from "@/lib/api/consultation";
import { Ellipsis, Plus, Users } from "lucide-react";
import { use, useEffect, useState } from "react";
export default function ConsultationDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [consultation, setConsultation] = useState<Consultation>();

  // Function to fetch consultation data
  const fetchConsultationData = async () => {
    try {
      const response = await getOneConsultation(parseInt(id));
      setConsultation(response);
    } catch (error) {
      console.error("Error fetching consultation:", error);
    }
  };

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

      // Refresh the consultation data
      const updatedConsultation = await getOneConsultation(consultation.id);
      setConsultation(updatedConsultation);

      // Reload the page to reflect changes
      window.location.reload();
    } catch (error) {
      console.error("Error adding document:", error);
      throw error;
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
  }, [id]);
  if (consultation) {
    return (
      <div>
        <div className="flex flex-col gap-5 pt-5">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-2">
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
                    <DocumentComponent document={{
                      fichier: document.url,
                      nom_fichier: document.nom,
                    }} key={index * 3} />
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
      </div>
    );
  }
}
