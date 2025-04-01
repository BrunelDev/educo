import { z } from "zod";

// Les types seront générés ici à partir du OpenAPI
export interface ApiError {
  status: number;
  message: string;
  code?: string;
}

// Schéma de validation de base pour les réponses d'erreur
export const ApiErrorSchema = z.object({
  status: z.number(),
  message: z.string(),
  code: z.string().optional(),
});

// Les autres schémas de validation seront générés à partir du OpenAPI
