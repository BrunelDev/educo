export interface User {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        telephone: string;
        type_utilisateur: "EMPLOYE" | "ADMIN" | "MEMBRE_CSE";
        image: string | null;
        est_actif: boolean;
      }
      
export interface AuthResponse {
        token: string;
        refresh: string;
        user: User;
      }
