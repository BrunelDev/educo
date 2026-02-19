import { AxiosError } from "axios";
import api, { endpoints } from "../api";
import { getCookies, removeCookie } from "../utils/cookies";
const endpoint = endpoints.auth.allUsers;

export interface User {
  id: number;
  email: string;
  type_utilisateur: "EMPLOYE" | "ADMIN" | "MEMBRE_CSE";
  telephone: string;
  first_name: string;
  last_name: string;
  image: string | null;
  date_creation: string;
  date_modification: string;
  is_active: boolean;
  is_last_message_read?: boolean;
}

export interface UserApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: User[];
}

export const getAllusers = async (): Promise<UserApiResponse> => {
  try {
    const response = await api.get(endpoint);
    ; // Replace with your desired action after fetching data.
    return response.data;
  } catch (error) {
console.error(error)
    ;
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};

export const getMembersWithNoTeam = async (): Promise<User[] | undefined> => {
  try {
    const response = await api.get<User[]>(
      "equipe/users-without-organisation/"
    );
    ; // Replace with your desired action after fetching data.
    return response.data;
  } catch (error) {
console.error(error)
    ;
    if (error instanceof AxiosError) {
      console.error(
        "error fetching users",
        JSON.stringify(error.response?.data?.error)
      );
      throw error;
    }
  }
};
interface UserToPatch {
  id?: number;
  email?: string;
  telephone?: string;
  date_creation?: string;
  date_modification?: string;
  is_active?: boolean;
  is_last_message_read?: boolean;
}
interface UpdateUserResponse {
  message: string;
  user: User;
}
const userInfo: User = JSON.parse(getCookies("userInfo") || "{}");
export const updateProfile = async (
  value: UserToPatch
): Promise<UpdateUserResponse> => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { type_utilisateur, ...body } = userInfo;
    const updatedBody = { ...body, ...value };
    const response = await api.patch(`${endpoint}update_profile/`, {
      ...updatedBody,
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export const updatePassword = async (formData: {
  old_password: string;
  new_password: string;
  confirm_password: string;
}): Promise<string> => {
  try {
    const response = await api.patch<{ message: string }>(
      `${endpoint}change_password/`,
      {
        old_password: formData.old_password,
        new_password: formData.new_password,
        confirm_password: formData.confirm_password,
      }
    );
    return response.data.message;
  } catch (error: unknown) {
    console.error(error);
    //check if error is instance of AxiosError
    if (error instanceof AxiosError) {
      return JSON.stringify(error.response?.data?.error);
    }
    throw error;
  }
};

export const getUser = async (): Promise<User> => {
  try {
    const response = await api.get<User>(`${endpoint}me/`);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error(
        "error fetching users",
        JSON.stringify(error.response?.data?.error)
      );
      throw error;
    }
    throw error;
  }
};
export const logout = () => {
  removeCookie("access_token");
  removeCookie("refresh_token");
  removeCookie("userInfo");
};

export const requestPasswordReset = async (
  email: string
): Promise<{ message: string }> => {
  try {
    // Use fetch instead of axios to avoid sending the authorization header
    const baseURL =
      process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/";
    const response = await fetch(`${baseURL}auth/forgot-password/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    console.error(error);
    return {
      message:
        "Une erreur est survenue lors de la réinitialisation du mot de passe",
    };
  }
};

export const confirmPasswordReset = async (
  uid: string,
  token: string,
  password: string
): Promise<{ message: string }> => {
  // Use fetch instead of axios to avoid sending the authorization header
  const baseURL =
    process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/";

  const response = await fetch(`${baseURL}auth/reset-password/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ uid, token, new_password: password }),
  })
    .then((response) => response.json())
    .catch((error) => {
      ;
      throw error;
    });

  return response;
};
