import { User } from "@/app/types/auth";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { z } from "zod";

// Schéma de validation Zod pour l'utilisateur
export const UserSchema = z.object({
  id: z.string().optional(),
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name: z.string().min(1, "Le nom est requis"),
  image: z.string().url("L'URL de l'image est invalide").optional(),
  email: z.string().email("L'email est invalide"),
  role: z.enum(["admin", "user", "guest"]).default("user"),
});

export type ValidatedUser = z.infer<typeof UserSchema>;

interface UserState {
  user: ValidatedUser | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<ValidatedUser>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (userData: User) => {
        try {
          const validatedUser = UserSchema.parse(userData);
          set({
            user: validatedUser,
            isAuthenticated: true,
          });
          logger.info("Utilisateur connecté", { userId: validatedUser.id });
        } catch (error) {
          logger.error("Erreur de validation utilisateur", { error });
          throw new Error("Données utilisateur invalides");
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        logger.info("Utilisateur déconnecté");
      },
      updateUser: (userData: Partial<ValidatedUser>) => {
        set((state) => {
          if (!state.user) {
            logger.warn("Tentative de mise à jour d'un utilisateur non connecté");
            return state;
          }

          try {
            const updatedUser = UserSchema.parse({
              ...state.user,
              ...userData,
            });
            logger.info("Profil utilisateur mis à jour", { userId: updatedUser.id });
            return { ...state, user: updatedUser };
          } catch (error) {
            logger.error("Erreur lors de la mise à jour du profil", { error });
            return state;
          }
        });
      },
    }),
    {
      name: "user-storage",
      skipHydration: true,
    }
  )
); 