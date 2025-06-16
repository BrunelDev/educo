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

export const getTeams = async (): Promise<TeamApiResponse> => {
  try {
    const response = await api.get(endpoints.equipes.base);
    return response.data;
  } catch (error: unknown) {
    console.error("Error getting item", (error as Error).message);
    throw error;
  }
};
export const addMembersToTeam = async (
  membres_ids: number[],
  teamId?: number
): Promise<Team> => {
  try {
    const response = await api.post(
      endpoints.equipes.base + `${teamId}/membres/`,
      { membres_ids }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding members to team", (error as Error).message);
    throw error;
  }
};

export const removeFromTeam = async (teamId: number, membersId: number) => {
  try {
    const response = await api.delete(
      endpoints.equipes.base + `${teamId}/membres/`,
      { data: { membre_ids: [membersId] } }
    );
    return response.data;
  } catch (error: unknown) {
    console.error("Error deleting from team", error);
    throw error;
  }
};

export const createTeam = async (
  nom: string,
  description: string,
  membre_ids: number[]
): Promise<Team> => {
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
};
export const grantAccess = async (
  memberEmail: string,
  role:
    | { peut_modifier_fichier: boolean }
    | { peut_creer_reunion: boolean }
    | { peut_utiliser_ia: boolean }
    | null
) => {
  try {
    console.log({
      email: memberEmail,
      ...role,
    });
    if (role && "peut_modifier_fichier" in role && role.peut_modifier_fichier) {
      const response = await api.post(
        "fichiers/permissions/modifier-fichier/",
        {
          email: memberEmail,
          ...role,
        }
      );
      return response.data;
    }
    if (role && "peut_creer_reunion" in role && role.peut_creer_reunion) {
      const response = await api.post("fichiers/permissions/creer-reunion/", {
        email: memberEmail,
        ...role,
      });
      return response.data;
    }
    if (role && "peut_utiliser_ia" in role && role.peut_utiliser_ia) {
      const response = await api.post("fichiers/permissions/utiliser-ia/", {
        email: memberEmail,
        ...role,
      });
      return response.data;
    }
    return null;
  } catch (error) {
    console.error("Error granting access", error);
    throw error;
  }
};

export type { User, Team, TeamApiResponse };
