import { ConsultationsService } from "@/services/api/consultations";
import { Consultation, ConsultationCommentaire } from "@/services/api/schemas/consultation";
import { logger } from "@/utils/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, useCallback } from "react";

export function useConsultations(service: ConsultationsService) {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // Récupérer la liste des consultations
  const {
    data: consultations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["consultations", currentPage],
    queryFn: () => service.getConsultations(currentPage),
  });

  // Récupérer une consultation spécifique
  const useConsultation = (id: number) =>
    useQuery({
      queryKey: ["consultation", id],
      queryFn: () => service.getConsultation(id),
    });

  // Créer une consultation
  const createMutation = useMutation({
    mutationFn: (newConsultation: Omit<Consultation, "id">) =>
      service.createConsultation(newConsultation),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      logger.info("Consultation créée avec succès");
    },
  });

  // Mettre à jour une consultation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Consultation> }) =>
      service.updateConsultation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      queryClient.invalidateQueries({ queryKey: ["consultation", id] });
      logger.info("Consultation mise à jour avec succès");
    },
  });

  // Supprimer une consultation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => service.deleteConsultation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultations"] });
      logger.info("Consultation supprimée avec succès");
    },
  });

  // Récupérer les commentaires d'une consultation
  const useCommentaires = (consultationId: number) =>
    useQuery({
      queryKey: ["consultation", consultationId, "commentaires"],
      queryFn: () => service.getCommentaires(consultationId),
    });

  // Ajouter un commentaire
  const addCommentaireMutation = useMutation({
    mutationFn: ({
      consultationId,
      commentaire,
    }: {
      consultationId: number;
      commentaire: Omit<ConsultationCommentaire, "id" | "consultation">;
    }) => service.addCommentaire(consultationId, commentaire),
    onSuccess: (_, { consultationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["consultation", consultationId, "commentaires"],
      });
      logger.info("Commentaire ajouté avec succès");
    },
  });

  // Supprimer un commentaire
  const deleteCommentaireMutation = useMutation({
    mutationFn: ({
      consultationId,
      commentaireId,
    }: {
      consultationId: number;
      commentaireId: number;
    }) => service.deleteCommentaire(consultationId, commentaireId),
    onSuccess: (_, { consultationId }) => {
      queryClient.invalidateQueries({
        queryKey: ["consultation", consultationId, "commentaires"],
      });
      logger.info("Commentaire supprimé avec succès");
    },
  });

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    consultations,
    isLoading,
    error,
    currentPage,
    changePage,
    useConsultation,
    createConsultation: createMutation.mutate,
    updateConsultation: updateMutation.mutate,
    deleteConsultation: deleteMutation.mutate,
    useCommentaires,
    addCommentaire: addCommentaireMutation.mutate,
    deleteCommentaire: deleteCommentaireMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isAddingComment: addCommentaireMutation.isPending,
    isDeletingComment: deleteCommentaireMutation.isPending,
  };
} 