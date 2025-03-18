export interface AuthResponse {
  isAuthenticated: boolean;
  user?: {
    id: number;
    username: string;
    email: string;
  };
}
