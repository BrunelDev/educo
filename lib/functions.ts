import api, { endpoints } from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/auth/utilisateurs/connexion/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
    if (response.ok) {
      const res = await response.json();
      document.cookie = `access_token=${res.token};path=/`;
      document.cookie = `refresh_token=${res.refresh};path=/`;
      document.cookie = `userInfo=${JSON.stringify(res.user)};path=/`;
      
      return res;
    } else {
      const res = await response.json();
      throw new Error(res.message);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.log("Error");
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during login");
  }
};

export const register = async (email: string, password: string) => {
  try {
    const response = await fetch(
      "http://localhost:8000/api/auth/utilisateurs/inscriptions/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Inscription échouée : Cet email est déja utilisé.");
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("An unknown error occurred during registration");
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post(endpoints.auth.logout);
    document.cookie =
      "userInfo=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during logout");
  }
};
