import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

export const TokenSchema = z.object({
  access: z.string(),
  refresh: z.string(),
});

export const UserSchema = z.object({
  id: z.number(),
  email: z.string().email("Email invalide"),
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  role: z.enum(["admin", "member", "user"]),
  image: z.string().url().optional(),
  is_active: z.boolean(),
  date_joined: z.string().datetime(),
});

export type LoginCredentials = z.infer<typeof LoginSchema>;
export type TokenResponse = z.infer<typeof TokenSchema>;
export type User = z.infer<typeof UserSchema>;
