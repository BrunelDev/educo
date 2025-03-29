import api, { endpoints } from "../api";
interface User {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    image: string | null;
}

interface Team {
    id: number;
    nom: string;
    description: string;
    createur: User;
    membres: User[];
    date_creation: string;
    date_modification: string;
}

interface TeamApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Team[];
}

export const getTeams = async () : Promise<TeamApiResponse> => {
    try {
        const response = await api.get(endpoints.equipes.base);
        return response.data
        
    } catch (error: unknown) {
        console.error("Error getting item",(error as Error).message)
        throw new Error(error)
        
    }
}
export const addMembersToTeam = async ( membres_ids : number[], teamId? : number,) : Promise<Team> => {
    try {
        const response = await api.post(endpoints.equipes.base +`${teamId}/membres/`, {membres_ids});
        console.log(response.data);
        return response.data;
        

    } catch (error) {
        console.error("Error adding members to team", (error as Error).message);
        return {
            id: 0,
            nom: "",
            description: "",
            createur: {
                id: 0,
                email: "",
                first_name: "",
                last_name: "",
                image: null
            },
            membres: [],
            date_creation: "",
            date_modification: ""
        }

        
    }
}

export const removeFromTeam = async (id : number) => {
    try {
        const response = await api.delete(endpoints.equipes.base + `${id}/`)
        return response.data
        
    } catch (error: unknown) {
        console.error("Error deleting from team", error);
        throw error;
        
    }
}

export const createTeam = async (nom : string, description : string, membre_ids : number[] ) : Promise<Team> => {
    try {
      const response = await api.post(endpoints.equipes.base, {
        nom,
        description,
        membre_ids,
      });
        return response.data;
      
    } catch (error) {
      console.error("Error creating team", error);
      throw error;
      
    }
  }












export type { User, Team, TeamApiResponse };
