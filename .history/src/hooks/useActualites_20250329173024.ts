import { ActualitesService } from "@/services/api/actualites";
import { Actualite } from "@/services/api/schemas/actualite";
import { logger } from "@/utils/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";

export function useActualites(service: ActualitesService) {
  const [currentPage, setCurrentPage] = useState(1);
  const queryClient = useQueryClient();

  // Récupérer la liste des actualités
  const {
    data: actualites,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["actualites", currentPage],
    queryFn: () => service.getActualites(currentPage),
  });

  // Créer une actualité
  const createMutation = useMutation({
    mutationFn: (newActualite: Omit<Actualite, "id">) =>
      service.createActualite(newActualite),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actualites"] });
      logger.info("Actualité créée avec succès");
    },
  });

  // Mettre à jour une actualité
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Actualite> }) =>
      service.updateActualite(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actualites"] });
      logger.info("Actualité mise à jour avec succès");
    },
  });

  // Supprimer une actualité
  const deleteMutation = useMutation({
    mutationFn: (id: number) => service.deleteActualite(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["actualites"] });
      logger.info("Actualité supprimée avec succès");
    },
  });

  const changePage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  return {
    actualites,
    isLoading,
    error,
    currentPage,
    changePage,
    createActualite: createMutation.mutate,
    updateActualite: updateMutation.mutate,
    deleteActualite: deleteMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
