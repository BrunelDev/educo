import api, { endpoints } from "./api";
const baseUrl = process.env.NEXT_PUBLIC_API_URL;
export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(`${baseUrl}auth/utilisateurs/connexion/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (response.ok) {
      const res = await response.json();
      document.cookie = `access_token=${res.token};path=/;Max-Age=604800`;
      console.log("res", res);
      document.cookie = `refresh_token=${res.refresh};path=/;Max-Age=604800`;
      document.cookie = `userInfo=${JSON.stringify(res.user)};path=/;Max-Age=604800`;

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
    const response = await fetch(`${baseUrl}auth/utilisateurs/inscriptions/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
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

export const registerWithToken = async (
  email: string,
  password: string,
  token: string
) => {
  try {
    const response = await fetch(`${baseUrl}equipe/accept-invitation/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        token,
      }),
    });
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

export const formatDateToFrench = (dateString: string, showHour = true) => {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: showHour ? "numeric" : undefined,
    minute: showHour ? "numeric" : undefined,
  }).format(new Date(dateString));
};
