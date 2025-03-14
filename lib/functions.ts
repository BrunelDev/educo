import { api, endpoints } from "./api";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(
      "http://192.168.100.2:8000/api/auth/utilisateurs/connexion/",
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
      localStorage.setItem("userInfo", JSON.stringify(res));
      return res;
    }
    else {
      const res = await response.json();
      throw new Error(res.message);
    }
    return;
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
      "http://192.168.100.2:8000/api/auth/utilisateurs/inscriptions/",
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
    localStorage.removeItem("token");
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Logout failed: ${error.message}`);
    }
    throw new Error("An unknown error occurred during logout");
  }
};


