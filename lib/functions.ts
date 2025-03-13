import { api, endpoints } from "./api";

interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
  };
}

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post(endpoints.auth.login, {
      email, // Remove unnecessary nesting
      password, // Remove unnecessary nesting
    });

    // Store token upon successful login
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Login failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during login");
  }
};

export const register = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post(endpoints.auth.register, {
      email,
      password,
    });
    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error("Registration failed, email already exists");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Registration failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during registration");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(endpoints.auth.logout);
    localStorage.removeItem("token");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during logout");
  }
};
