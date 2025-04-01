import { ApiClient } from "./client";
import { LoginCredentials, LoginSchema, TokenResponse, TokenSchema, User, UserSchema } from "./schemas/auth";
import { logger } from "@/utils/logger";

export class AuthService {
  constructor(private client: ApiClient) {}

  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    try {
      // Valider les credentials avant l'envoi
      LoginSchema.parse(credentials);

      const response = await this.client.request<TokenResponse>("/api/auth/login/", {
        method: "POST",
        body: JSON.stringify(credentials),
      });

      const validated = TokenSchema.parse(response);
      logger.info("Connexion réussie");
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la connexion", { error });
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await this.client.request<TokenResponse>("/api/auth/refresh/", {
        method: "POST",
        body: JSON.stringify({ refresh: refreshToken }),
      });

      const validated = TokenSchema.parse(response);
      logger.info("Token rafraîchi avec succès");
      return validated;
    } catch (error) {
      logger.error("Erreur lors du rafraîchissement du token", { error });
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const response = await this.client.request<User>("/api/auth/me/");

      const validated = UserSchema.parse(response);
      logger.info("Profil utilisateur récupéré avec succès");
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération du profil", { error });
      throw error;
    }
  }

  async updateProfile(data: Partial<User>): Promise<User> {
    try {
      const response = await this.client.request<User>("/api/auth/profile/", {
        method: "PATCH",
        body: JSON.stringify(data),
      });

      const validated = UserSchema.parse(response);
      logger.info("Profil mis à jour avec succès");
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour du profil", { error });
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      await this.client.request("/api/auth/change-password/", {
        method: "POST",
        body: JSON.stringify({
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });
      logger.info("Mot de passe changé avec succès");
    } catch (error) {
      logger.error("Erreur lors du changement de mot de passe", { error });
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.client.request("/api/auth/logout/", {
        method: "POST",
      });
      logger.info("Déconnexion réussie");
    } catch (error) {
      logger.error("Erreur lors de la déconnexion", { error });
      throw error;
    }
  }
} 