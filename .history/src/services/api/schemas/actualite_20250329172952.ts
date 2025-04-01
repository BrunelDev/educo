import { z } from "zod";

export const ActualiteSchema = z.object({
  id: z.number().optional(),
  titre: z.string().min(1, "Le titre est requis"),
  contenu: z.string().min(1, "Le contenu est requis"),
  date_creation: z.string().datetime(),
  date_modification: z.string().datetime().optional(),
  auteur: z.number(),
  image: z.string().url().optional(),
});

export const PaginatedActualiteSchema = z.object({
  count: z.number(),
  next: z.string().url().nullable(),
  previous: z.string().url().nullable(),
  results: z.array(ActualiteSchema),
});

export type Actualite = z.infer<typeof ActualiteSchema>;
export type PaginatedActualite = z.infer<typeof PaginatedActualiteSchema>; 