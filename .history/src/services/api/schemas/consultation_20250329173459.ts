import { z } from "zod";

export const ConsultationSchema = z.object({
  id: z.number().optional(),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  date_debut: z.string().datetime(),
  date_fin: z.string().datetime(),
  statut: z.enum(["en_cours", "terminee", "annulee"]),
  documents: z.array(z.string().url()).optional(),
  createur: z.number(),
  participants: z.array(z.number()).optional(),
  commentaires: z.array(z.number()).optional(),
  date_creation: z.string().datetime(),
  date_modification: z.string().datetime().optional(),
});

export const ConsultationCommentaireSchema = z.object({
  id: z.number().optional(),
  contenu: z.string().min(1, "Le contenu est requis"),
  auteur: z.number(),
  consultation: z.number(),
  date_creation: z.string().datetime(),
  date_modification: z.string().datetime().optional(),
});

export const PaginatedConsultationSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(ConsultationSchema),
});

export type Consultation = z.infer<typeof ConsultationSchema>;
export type ConsultationCommentaire = z.infer<
  typeof ConsultationCommentaireSchema
>;
export type PaginatedConsultation = z.infer<typeof PaginatedConsultationSchema>;
