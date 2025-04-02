import api, { endpoints } from "../api";


export interface OrganizationMember {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  image: string | null;
}

export interface Organization {
  id: number;
  nom: string;
  description?: string;
  date_creation: string;
  createur: OrganizationMember;
}

export interface OrganizationResponse {
  has_team: boolean;
  organisation: Organization;
  membres: OrganizationMember[];
}

export const getOrganization = async (): Promise<OrganizationResponse> => {
  try {
    const response = await api.get<OrganizationResponse>("equipe/mon-organisation/");
    return response.data;
  } catch (error) {
    console.error('Error fetching organization:', error);
    throw error;
  }
};

// ...existing imports...

export interface CreateOrganizationDto {
    nom: string;
    nom_entreprise: string;
    secteur_activite: string;
    taille: string;
    adresse_siege: string;
    code_postal: string;
    ville: string;
    logo?: string | null;
    description?: string;
    membre_ids: number[];
  }
interface CreateOrganization extends OrganizationResponse {
    date_creation: Date;
    date_modification: Date;
  }
  export const createOrganization = async (data: CreateOrganizationDto): Promise<CreateOrganization> => {
    try {
  
      const response = await api.post<CreateOrganization>(
        endpoints.organisation.base,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating organization:', error);
      throw error;
    }
  };
  
export const getOrganisationMembers = async (): Promise<OrganizationMember[]> => {
  try {
    const response = await getOrganization()
    return response.membres;
    
  } catch (error) {
    console.error('Error fetching organization members:', error);
    throw error;
 
  }
}
export const addToOrganization = async (orgId : number , membre_ids: number[]): Promise<Organization> => {
  try {
    const response = await api.post(endpoints.organisation.base + `${orgId}/membres/`, {membre_ids});
    console.log(response.data);
    return response.data;
    
  } catch (error) {
    console.error('Error adding members to organization:', error);
    throw error;
  }
}
