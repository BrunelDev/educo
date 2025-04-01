import { AuthService } from "@/src/services/api/auth";
import { LoginCredentials, User } from "@/src/services/api/schemas/auth";
import { logger } from "@/src/utils/logger";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export function useAuth(service: AuthService) {
  const queryClient = useQueryClient();

  // Récupérer l'utilisateur courant
  const {
    data: user,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: () => service.getCurrentUser(),
    retry: false,
  });

  // Connexion
  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => service.login(credentials),
    onSuccess: (tokens) => {
      // Stocker les tokens
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
      // Rafraîchir l'utilisateur courant
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      logger.info("Tokens stockés avec succès");
    },
  });

  // Mise à jour du profil
  const updateProfileMutation = useMutation({
    mutationFn: (data: Partial<User>) => service.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  // Changement de mot de passe
  const changePasswordMutation = useMutation({
    mutationFn: ({
      oldPassword,
      newPassword,
    }: {
      oldPassword: string;
      newPassword: string;
    }) => service.changePassword(oldPassword, newPassword),
  });

  // Déconnexion
  const logoutMutation = useMutation({
    mutationFn: () => service.logout(),
    onSuccess: () => {
      // Nettoyer le stockage local
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      // Réinitialiser le cache
      queryClient.clear();
      logger.info("Déconnexion effectuée avec succès");
    },
  });

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) throw new Error("Pas de refresh token");

      const tokens = await service.refreshToken(refreshToken);
      localStorage.setItem("accessToken", tokens.access);
      localStorage.setItem("refreshToken", tokens.refresh);
      logger.info("Token rafraîchi avec succès");
    } catch (error) {
      logger.error("Erreur lors du rafraîchissement du token", { error });
      // En cas d'erreur, déconnecter l'utilisateur
      logoutMutation.mutate();
    }
  }, [service, logoutMutation]);

  return {
    user,
    isLoadingUser,
    userError,
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
    changePassword: changePasswordMutation.mutate,
    isChangingPassword: changePasswordMutation.isPending,
    changePasswordError: changePasswordMutation.error,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
    refreshToken,
  };
}
