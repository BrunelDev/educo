export interface User {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
        telephone: string;
        type_utilisateur: "ADMIN" | "MEMBRE";
        image: string | null;
        est_actif: boolean;
      }
      
export interface AuthResponse {
        token: string;
        refresh: string;
        user: User;
      }
