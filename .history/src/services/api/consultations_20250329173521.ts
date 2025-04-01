import { ApiClient } from "./client";
import { logger } from "@/utils/logger";
import {
  Consultation,
  ConsultationCommentaire,
  ConsultationCommentaireSchema,
  ConsultationSchema,
  PaginatedConsultation,
  PaginatedConsultationSchema,
} from "./schemas/consultation";

export class ConsultationsService {
  constructor(private client: ApiClient) {}

  async getConsultations(page?: number): Promise<PaginatedConsultation> {
    try {
      const queryParams = page ? `?page=${page}` : "";
      const response = await this.client.request<PaginatedConsultation>(
        `/api/consultations/${queryParams}`
      );
      
      const validated = PaginatedConsultationSchema.parse(response);
      logger.info("Consultations récupérées avec succès", { page });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération des consultations", { error, page });
      throw error;
    }
  }

  async getConsultation(id: number): Promise<Consultation> {
    try {
      const response = await this.client.request<Consultation>(
        `/api/consultations/${id}/`
      );
      
      const validated = ConsultationSchema.parse(response);
      logger.info("Consultation récupérée avec succès", { id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération de la consultation", { error, id });
      throw error;
    }
  }

  async createConsultation(consultation: Omit<Consultation, "id">): Promise<Consultation> {
    try {
      const response = await this.client.request<Consultation>("/api/consultations/", {
        method: "POST",
        body: JSON.stringify(consultation),
      });
      
      const validated = ConsultationSchema.parse(response);
      logger.info("Consultation créée avec succès", { id: validated.id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la création de la consultation", { error });
      throw error;
    }
  }

  async updateConsultation(id: number, consultation: Partial<Consultation>): Promise<Consultation> {
    try {
      const response = await this.client.request<Consultation>(
        `/api/consultations/${id}/`,
        {
          method: "PATCH",
          body: JSON.stringify(consultation),
        }
      );
      
      const validated = ConsultationSchema.parse(response);
      logger.info("Consultation mise à jour avec succès", { id });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la mise à jour de la consultation", { error, id });
      throw error;
    }
  }

  async deleteConsultation(id: number): Promise<void> {
    try {
      await this.client.request(`/api/consultations/${id}/`, {
        method: "DELETE",
      });
      logger.info("Consultation supprimée avec succès", { id });
    } catch (error) {
      logger.error("Erreur lors de la suppression de la consultation", { error, id });
      throw error;
    }
  }

  // Gestion des commentaires
  async getCommentaires(consultationId: number): Promise<ConsultationCommentaire[]> {
    try {
      const response = await this.client.request<ConsultationCommentaire[]>(
        `/api/consultations/${consultationId}/commentaires/`
      );
      
      const validated = z.array(ConsultationCommentaireSchema).parse(response);
      logger.info("Commentaires récupérés avec succès", { consultationId });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de la récupération des commentaires", { error, consultationId });
      throw error;
    }
  }

  async addCommentaire(
    consultationId: number,
    commentaire: Omit<ConsultationCommentaire, "id" | "consultation">
  ): Promise<ConsultationCommentaire> {
    try {
      const response = await this.client.request<ConsultationCommentaire>(
        `/api/consultations/${consultationId}/commentaires/`,
        {
          method: "POST",
          body: JSON.stringify(commentaire),
        }
      );
      
      const validated = ConsultationCommentaireSchema.parse(response);
      logger.info("Commentaire ajouté avec succès", { consultationId });
      return validated;
    } catch (error) {
      logger.error("Erreur lors de l'ajout du commentaire", { error, consultationId });
      throw error;
    }
  }

  async deleteCommentaire(consultationId: number, commentaireId: number): Promise<void> {
    try {
      await this.client.request(
        `/api/consultations/${consultationId}/commentaires/${commentaireId}/`,
        {
          method: "DELETE",
        }
      );
      logger.info("Commentaire supprimé avec succès", { consultationId, commentaireId });
    } catch (error) {
      logger.error("Erreur lors de la suppression du commentaire", {
        error,
        consultationId,
        commentaireId,
      });
      throw error;
    }
  }
} 