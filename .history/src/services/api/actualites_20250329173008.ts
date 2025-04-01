import { ApiClient } from "./client";
import { Actualite, ActualiteSchema, PaginatedActualite, PaginatedActualiteSchema } from "./schemas/actualite";
import { logger } from "@/utils/logger";

export class ActualitesService {
  constructor(private client: ApiClient) {}

  async getActualites(page?: number): Promise<PaginatedActualite> {
    try {
      const queryParams = page ? `?page=${page}` : "";
      const response = await this.client.request<PaginatedActualite>(
        `/api/actualites/${queryParams}`
      );
      
      const validated = PaginatedActualiteSchema.parse(response);
      logger.info("Actualités récupérées avec succès", { page });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération des actualités", { error, page });
      throw error;
    }
  }

  async getActualite(id: number): Promise<Actualite> {
    try {
      const response = await this.client.request<Actualite>(
        `/api/actualites/${id}/`
      );
      
      const validated = ActualiteSchema.parse(response);
      logger.info("Actualité récupérée avec succès", { id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération de l'actualité", { error, id });
      throw error;
    }
  }

  async createActualite(actualite: Omit<Actualite, "id">): Promise<Actualite> {
    try {
      const response = await this.client.request<Actualite>("/api/actualites/", {
        method: "POST",
        body: JSON.stringify(actualite),
      });
      
      const validated = ActualiteSchema.parse(response);
      logger.info("Actualité créée avec succès", { id: validated.id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la création de l'actualité", { error });
      throw error;
    }
  }

  async updateActualite(id: number, actualite: Partial<Actualite>): Promise<Actualite> {
    try {
      const response = await this.client.request<Actualite>(
        `/api/actualites/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(actualite),
        }
      );
      
      const validated = ActualiteSchema.parse(response);
      logger.info("Actualité mise à jour avec succès", { id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de l'actualité", { error, id });
      throw error;
    }
  }

  async deleteActualite(id: number): Promise<void> {
    try {
      await this.client.request(`/api/actualites/${id}/`, {
        method: "DELETE",
      });
      logger.info("Actualité supprimée avec succès", { id });
    } catch (error) {
      logger.error("Erreur lors de la suppression de l'actualité", { error, id });
      throw error;
    }
  }
} 