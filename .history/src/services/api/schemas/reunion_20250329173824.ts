import { z } from "zod";

export const ReunionSchema = z.object({
  id: z.number().optional(),
  titre: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  date: z.string().datetime(),
  duree: z.number().min(0, "La durée doit être positive"),
  lieu: z.string().min(1, "Le lieu est requis"),
  type: z.enum(["presentiel", "distanciel", "hybride"]),
  statut: z.enum(["planifiee", "en_cours", "terminee", "annulee"]),
  organisateur: z.number(),
  participants: z.array(z.number()).optional(),
  documents: z.array(z.string().url()).optional(),
  lien_visio: z.string().url().optional(),
  ordre_du_jour: z.array(z.string()).optional(),
  compte_rendu: z.string().optional(),
  date_creation: z.string().datetime(),
  date_modification: z.string().datetime().optional(),
});

export const ParticipationSchema = z.object({
  id: z.number().optional(),
  utilisateur: z.number(),
  reunion: z.number(),
  statut: z.enum(["present", "absent", "excuse"]),
  commentaire: z.string().optional(),
});

export const PaginatedReunionSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(ReunionSchema),
});

export type Reunion = z.infer<typeof ReunionSchema>;
export type Participation = z.infer<typeof ParticipationSchema>;
export type PaginatedReunion = z.infer<typeof PaginatedReunionSchema>;
