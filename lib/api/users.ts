import api, { endpoints } from "../api";
const endpoint = endpoints.auth.users;


export interface User {
    id: number;
    email: string;
    type_utilisateur: "EMPLOYE" | "ADMIN" | "MEMBRE_CSE";
    telephone?: string;
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

export const getAllusers = async () : Promise<UserApiResponse> => {
    try {
        const response = await api.get(endpoint);
        console.log(response.data);  // Replace with your desired action after fetching data.
        return response.data;
    } catch (error) {
        console.error("Error fetching users", error);
        return  {
            count: 0,
            next: null,
            previous: null,
            results: []
          };;
    }
}