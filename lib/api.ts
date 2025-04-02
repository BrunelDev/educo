import axios from "axios";
import { getCookies } from "./utils/cookies";




const access_token = getCookies("access_token") ;


export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/",
  headers: {
    "Content-Type": "application/json",
    "Authorization" : "Bearer " + access_token
  },
});

// API endpoints
export const endpoints = {
  auth: {
    users: "auth/utilisateurs/",
    login: "/auth/utilisateurs/connexion/",
    register: "auth/utilisateurs/inscription/",
    logout: "/auth/logout",
  },
  meetings: {
    list: "/reunion/reunions/",
    create: "/reunion/reunions/creer/",
    update: (id: string) => `/meetings/${id}`,
    delete: (id: string) => `/meetings/${id}`,
  },
  fichiers: {
    dossiers: {
      list: "/fichiers/dossiers/",
      create: "/dossiers/creer/",
      update: (id: string) => `/dossiers/${id}`,
      delete: (id: string) => `/dossiers/${id}`,
    },
    fichiers: {
      base : "fichiers/fichiers/"
    }
  },
  formations: {
    webinaires: {
      list: "/formations/webinaires/",
      create: "/webinaires/creer/",
      update: (id: string) => `/webinaires/${id}`,
      delete: (id: string) => `/webinaires/${id}`,
    },
    ressources: {
      base: "/formations/ressources/",
    },
  },
  equipes: {
    base: "equipe/equipes/",
  },
  organisation: {
    base: "equipe/organisations/",
  },
  consultations: {
    base: "consultations/",
  },
  messagerie: {
    base: "messagerie/",
  },
  
  projets: {
    base : "tasks/projets/",
  },
  taches: {
    base : "tasks/taches/",
  }
  
};

export default api;
