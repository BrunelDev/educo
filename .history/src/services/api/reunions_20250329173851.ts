import { ApiClient } from "./client";
import { logger } from "@/utils/logger";
import {
  PaginatedReunion,
  PaginatedReunionSchema,
  Participation,
  ParticipationSchema,
  Reunion,
  ReunionSchema,
} from "./schemas/reunion";

export class ReunionsService {
  constructor(private client: ApiClient) {}

  async getReunions(page?: number): Promise<PaginatedReunion> {
    try {
      const queryParams = page ? `?page=${page}` : "";
      const response = await this.client.request<PaginatedReunion>(
        `/api/reunions/${queryParams}`
      );

      const validated = PaginatedReunionSchema.parse(response);
      logger.info("Réunions récupérées avec succès", { page });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération des réunions", { error, page });
      throw error;
    }
  }

  async getReunion(id: number): Promise<Reunion> {
    try {
      const response = await this.client.request<Reunion>(`/api/reunions/${id}/`);

      const validated = ReunionSchema.parse(response);
      logger.info("Réunion récupérée avec succès", { id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération de la réunion", { error, id });
      throw error;
    }
  }

  async createReunion(reunion: Omit<Reunion, "id">): Promise<Reunion> {
    try {
      const response = await this.client.request<Reunion>("/api/reunions/", {
        method: "POST",
        body: JSON.stringify(reunion),
      });

      const validated = ReunionSchema.parse(response);
      logger.info("Réunion créée avec succès", { id: validated.id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la création de la réunion", { error });
      throw error;
    }
  }

  async updateReunion(id: number, reunion: Partial<Reunion>): Promise<Reunion> {
    try {
      const response = await this.client.request<Reunion>(`/api/reunions/${id}/`, {
        method: "PATCH",
        body: JSON.stringify(reunion),
      });

      const validated = ReunionSchema.parse(response);
      logger.info("Réunion mise à jour avec succès", { id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la réunion", { error, id });
      throw error;
    }
  }

  async deleteReunion(id: number): Promise<void> {
    try {
      await this.client.request(`/api/reunions/${id}/`, {
        method: "DELETE",
      });
      logger.info("Réunion supprimée avec succès", { id });
    } catch (error) {
      logger.error("Erreur lors de la suppression de la réunion", { error, id });
      throw error;
    }
  }

  // Gestion des participations
  async getParticipations(reunionId: number): Promise<Participation[]> {
    try {
      const response = await this.client.request<Participation[]>(
        `/api/reunions/${reunionId}/participations/`
      );

      const validated = z.array(ParticipationSchema).parse(response);
      logger.info("Participations récupérées avec succès", { reunionId });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération des participations", {
        error,
        reunionId,
      });
      throw error;
    }
  }

  async updateParticipation(
    reunionId: number,
    userId: number,
    participation: Partial<Participation>
  ): Promise<Participation> {
    try {
      const response = await this.client.request<Participation>(
        `/api/reunions/${reunionId}/participations/${userId}/`,
        {
          method: "PATCH",
          body: JSON.stringify(participation),
        }
      );

      const validated = ParticipationSchema.parse(response);
      logger.info("Participation mise à jour avec succès", { reunionId, userId });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la participation", {
        error,
        reunionId,
        userId,
      });
      throw error;
    }
  }

  async addParticipant(reunionId: number, userId: number): Promise<void> {
    try {
      await this.client.request(`/api/reunions/${reunionId}/participants/`, {
        method: "POST",
        body: JSON.stringify({ utilisateur: userId }),
      });
      logger.info("Participant ajouté avec succès", { reunionId, userId });
    } catch (error) {
      logger.error("Erreur lors de l'ajout du participant", {
        error,
        reunionId,
        userId,
      });
      throw error;
    }
  }

  async removeParticipant(reunionId: number, userId: number): Promise<void> {
    try {
      await this.client.request(
        `/api/reunions/${reunionId}/participants/${userId}/`,
        {
          method: "DELETE",
        }
      );
      logger.info("Participant retiré avec succès", { reunionId, userId });
    } catch (error) {
      logger.error("Erreur lors du retrait du participant", {
        error,
        reunionId,
        userId,
      });
      throw error;
    }
  }

  // Gestion des documents
  async addDocument(reunionId: number, document: File): Promise<string> {
    try {
      const formData = new FormData();
      formData.append("document", document);

      const response = await this.client.request<{ url: string }>(
        `/api/reunions/${reunionId}/documents/`,
        {
          method: "POST",
          body: formData,
          headers: {
            // Le Content-Type sera automatiquement défini par le navigateur
          },
        }
      );

      logger.info("Document ajouté avec succès", { reunionId });
      return response.url;
    } catch (error) {
      logger.error("Erreur lors de l'ajout du document", { error, reunionId });
      throw error;
    }
  }

  async removeDocument(reunionId: number, documentUrl: string): Promise<void> {
    try {
      await this.client.request(`/api/reunions/${reunionId}/documents/`, {
        method: "DELETE",
        body: JSON.stringify({ url: documentUrl }),
      });
      logger.info("Document supprimé avec succès", { reunionId, documentUrl });
    } catch (error) {
      logger.error("Erreur lors de la suppression du document", {
        error,
        reunionId,
        documentUrl,
      });
      throw error;
    }
  }
} 