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
    console.log(response.data); // Replace with your desired action after fetching data.
    return response.data;
  } catch (error) {
    console.error("Error fetching users", error);
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }
};
interface UserToPatch {
  id?: number;
  email?: string;
  telephone?: string;
  date_creation?: string;
  date_modification?: string;
  is_active?: boolean;
}
interface UpdateUserResponse {
  message : string;
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
    console.error("Error updating profile", error);
    throw error;
  }
};

export const updatePassword = async (formData: { old_password: string; new_password: string; confirm_password: string }): Promise<string> => {
  try {
    const response = await api.patch<{ message: string }>(`${endpoint}change_password/`, {
      "old_password": formData.old_password,
      "new_password": formData.new_password,
      "confirm_password": formData.confirm_password
    });
    return response.data.message;
  } catch (error :unknown) {
    console.error("Error updating password", error);
    //check if error is instance of AxiosError
    if (error instanceof AxiosError) {
      return JSON.stringify(error.response?.data?.error)
    }
    throw error;
  }
}

export const getUser = async () : Promise<User> => {
  try {
    const response = await api.get<User>(`${endpoint}me/`);
    return response.data;
    
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("error fetching users",JSON.stringify(error.response?.data?.error))
    throw error;

    }
    throw error;
    
  }
}
export const logout = () => {
  removeCookie("access_token");
  removeCookie("refresh_token");
  removeCookie("userInfo");
}