import { useApi } from "@/src/providers/ApiProvider";
import type { Participation, Reunion } from "@/src/services/api/schemas/reunion";
import { logger } from "@/utils/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function useReunions() {
  const [currentPage, setCurrentPage] = useState(1);
  const { reunions } = useApi();
  const queryClient = useQueryClient();

  // Récupération de la liste des réunions
  const {
    data: reunionsData,
    isLoading: isLoadingReunions,
    error: reunionsError,
  } = useQuery({
    queryKey: ["reunions", currentPage],
    queryFn: () => reunions.getReunions(currentPage),
  });

  // Hook pour une réunion spécifique
  const useReunion = (id: number) => {
    return useQuery({
      queryKey: ["reunion", id],
      queryFn: () => reunions.getReunion(id),
    });
  };

  // Mutation pour créer une réunion
  const {
    mutate: createReunion,
    isLoading: isCreatingReunion,
    error: createError,
  } = useMutation({
    mutationFn: (reunion: Omit<Reunion, "id">) =>
      reunions.createReunion(reunion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunions"] });
      logger.info("Réunion créée avec succès");
    },
  });

  // Mutation pour mettre à jour une réunion
  const {
    mutate: updateReunion,
    isLoading: isUpdatingReunion,
    error: updateError,
  } = useMutation({
    mutationFn: ({ id, reunion }: { id: number; reunion: Partial<Reunion> }) =>
      reunions.updateReunion(id, reunion),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["reunions"] });
      queryClient.invalidateQueries({ queryKey: ["reunion", id] });
      logger.info("Réunion mise à jour avec succès");
    },
  });

  // Mutation pour supprimer une réunion
  const {
    mutate: deleteReunion,
    isLoading: isDeletingReunion,
    error: deleteError,
  } = useMutation({
    mutationFn: (id: number) => reunions.deleteReunion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reunions"] });
      logger.info("Réunion supprimée avec succès");
    },
  });

  // Hook pour les participations d'une réunion
  const useParticipations = (reunionId: number) => {
    return useQuery({
      queryKey: ["participations", reunionId],
      queryFn: () => reunions.getParticipations(reunionId),
    });
  };

  // Mutation pour mettre à jour une participation
  const {
    mutate: updateParticipation,
    isLoading: isUpdatingParticipation,
    error: updateParticipationError,
  } = useMutation({
    mutationFn: ({
      reunionId,
      userId,
      participation,
    }: {
      reunionId: number;
      userId: number;
      participation: Partial<Participation>;
    }) => reunions.updateParticipation(reunionId, userId, participation),
    onSuccess: (_, { reunionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["participations", reunionId],
      });
      logger.info("Participation mise à jour avec succès");
    },
  });

  // Mutation pour ajouter un participant
  const {
    mutate: addParticipant,
    isLoading: isAddingParticipant,
    error: addParticipantError,
  } = useMutation({
    mutationFn: ({
      reunionId,
      userId,
    }: {
      reunionId: number;
      userId: number;
    }) => reunions.addParticipant(reunionId, userId),
    onSuccess: (_, { reunionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["participations", reunionId],
      });
      logger.info("Participant ajouté avec succès");
    },
  });

  // Mutation pour retirer un participant
  const {
    mutate: removeParticipant,
    isLoading: isRemovingParticipant,
    error: removeParticipantError,
  } = useMutation({
    mutationFn: ({
      reunionId,
      userId,
    }: {
      reunionId: number;
      userId: number;
    }) => reunions.removeParticipant(reunionId, userId),
    onSuccess: (_, { reunionId }) => {
      queryClient.invalidateQueries({
        queryKey: ["participations", reunionId],
      });
      logger.info("Participant retiré avec succès");
    },
  });

  // Mutation pour ajouter un document
  const {
    mutate: addDocument,
    isLoading: isAddingDocument,
    error: addDocumentError,
  } = useMutation({
    mutationFn: ({
      reunionId,
      document,
    }: {
      reunionId: number;
      document: File;
    }) => reunions.addDocument(reunionId, document),
    onSuccess: (_, { reunionId }) => {
      queryClient.invalidateQueries({ queryKey: ["reunion", reunionId] });
      logger.info("Document ajouté avec succès");
    },
  });

  // Mutation pour supprimer un document
  const {
    mutate: removeDocument,
    isLoading: isRemovingDocument,
    error: removeDocumentError,
  } = useMutation({
    mutationFn: ({
      reunionId,
      documentUrl,
    }: {
      reunionId: number;
      documentUrl: string;
    }) => reunions.removeDocument(reunionId, documentUrl),
    onSuccess: (_, { reunionId }) => {
      queryClient.invalidateQueries({ queryKey: ["reunion", reunionId] });
      logger.info("Document supprimé avec succès");
    },
  });

  const changePage = (page: number) => {
    setCurrentPage(page);
  };

  return {
    // Données et états
    reunions: reunionsData,
    currentPage,
    isLoadingReunions,
    reunionsError,

    // Hooks
    useReunion,
    useParticipations,

    // Actions
    createReunion,
    updateReunion,
    deleteReunion,
    updateParticipation,
    addParticipant,
    removeParticipant,
    addDocument,
    removeDocument,
    changePage,

    // États de chargement
    isCreatingReunion,
    isUpdatingReunion,
    isDeletingReunion,
    isUpdatingParticipation,
    isAddingParticipant,
    isRemovingParticipant,
    isAddingDocument,
    isRemovingDocument,

    // Erreurs
    createError,
    updateError,
    deleteError,
    updateParticipationError,
    addParticipantError,
    removeParticipantError,
    addDocumentError,
    removeDocumentError,
  };
}
