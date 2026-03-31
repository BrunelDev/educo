import api, { endpoints } from "../api";

export interface OrganizationMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image: string | null;
  telephone: string | null;
}

export interface Organization {
  id: number;
  nom_entreprise: string;
  secteur_activite: string;
  taille: string;
  adresse_siege: string;
  code_postal: string;
  ville: string;
  logo: string | null;
  description: string;
  date_creation: string;
  date_modification: string;
  createur: OrganizationMember;
  collective: string | null;
  annee_election: number;
}

export interface OrganizationResponse {
  has_team: boolean;
  organisation: Organization;
  membres: OrganizationMember[];
}

export const getOrganization = async (): Promise<OrganizationResponse> => {
  try {
    const response = await api.get<OrganizationResponse>(
      "equipe/mon-organisation/"
    );
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

// ...existing imports...

export interface CreateOrganizationDto {
  nom: string;
  nom_entreprise: string;
  secteur_activite?: string;
  taille?: string;
  adresse_siege?: string;
  code_postal?: string;
  ville?: string;
  logo?: string | null;
  description?: string;
  membre_ids?: number[];
  collective?: string;
  invites?: string[];
}
interface CreateOrganization extends OrganizationResponse {
  date_creation: Date;
  date_modification: Date;
}
export const createOrganization = async (
  data: CreateOrganizationDto
): Promise<CreateOrganization> => {
  try {
    const response = await api.post<CreateOrganization>(
      endpoints.organisation.base,
      data
    );

    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export const getOrganisationMembers = async (): Promise<
  OrganizationMember[]
> => {
  try {
    const response = await getOrganization();
    ;
    return response.membres;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};
export const addToOrganization = async (
  orgId: number,
  membre_ids: number[]
): Promise<Organization> => {
  try {
    const response = await api.post(
      endpoints.organisation.base + `${orgId}/membres/`,
      { membre_ids }
    );
    ;
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export interface UpdateOrganizationDto {
  nom?: string;
  nom_entreprise?: string;
  secteur_activite?: string;
  taille?: string;
  adresse_siege?: string;
  code_postal?: string;
  ville?: string;
  logo?: string | null;
  description?: string;
  membre_ids?: number[];
  invites?: string[];
  collective?: string;
}

export const updateOrganisation = async (
  OrgId: number,
  data: UpdateOrganizationDto
): Promise<CreateOrganization> => {
  try {
    const response = await api.patch<CreateOrganization>(
      `${endpoints.organisation.base}${OrgId}/`,
      data
    );

    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

interface ConfirmPresenceDto {
  message: string;
  redirect_url: string;
}
/**
 * Confirm the presence of an internal member in a meeting
 * @param reunion_id The ID of the meeting
 * @param disponible The availability of the user
 * @param email The email of the user
 * @param user_id The ID of the user
 * @returns The confirmation message
 */
export const confirmPresence = async ({
  reunion_id,
  disponible,
  user_id,
  token,
}: {
  reunion_id: number;
  disponible: "PRESENT" | "ABSENT";
  user_id?: number;
  token?: string;
}): Promise<ConfirmPresenceDto> => {
  try {
    const response = await api.post(`disponibilite/confirmer-presence/`, {
      reunion_id,
      disponible,
      user_id,
      token,
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export const confirmPresenceExternalMember = async ({
  reunion_id,
  disponible,
  email,
}: {
  reunion_id: number;
  disponible: "PRESENT" | "ABSENT";
  email?: string;
}): Promise<ConfirmPresenceDto> => {
  try {
    const response = await api.post(`disponibilite/confirmation-presence/`, {
      reunion_id,
      disponible,
      email,
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};

export const deleteExternalMemberPresence = async ({
  reunion_id,
  email,
}: {
  reunion_id: number;
  email?: string;
}): Promise<ConfirmPresenceDto> => {
  try {
    const response = await api.delete(`disponibilite/supprimer-presence/`, {
      data: {
        reunion_id,
        email,
      },
    });
    return response.data;
  } catch (error) {
console.error(error)
    ;
    throw error;
  }
};
