import axios from "axios";
import { getCookies } from "./utils/cookies";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = getCookies("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
export const endpoints = {
  auth: {
    users: "auth/utilisateurs/me/",
    login: "/auth/utilisateurs/connexion/",
    register: "auth/utilisateurs/inscription/",
    logout: "/auth/logout",
    allUsers: "/auth/utilisateurs/",
  },
  meetings: {
    list: "/reunion/reunions/",
    create: "/reunion/reunions/creer/",
    update: (id: string) => `/meetings/${id}`,
    delete: (id: string) => `/meetings/${id}`,
    documents: "/reunion/documents/",
  },
  fichiers: {
    dossiers: {
      list: "/fichiers/dossiers/",
      create: "/dossiers/creer/",
      update: (id: string) => `/dossiers/${id}`,
      delete: (id: string) => `/dossiers/${id}`,
    },
    fichiers: {
      base: "fichiers/fichiers/",
    },
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
    base: "equipe/organisations/",
  },
  organisation: {
    base: "equipe/organisations/",
  },
  consultations: {
    base: "consultations/",
    comment: {
      base: "consultations/commentaires/",
    },
  },
  messagerie: {
    base: "messagerie/",
    groupes: "messagerie/groupes-fermes/",
  },

  projets: {
    base: "tasks/projets/",
  },
  taches: {
    base: "tasks/taches/",
  },
  notifications: {
    base: "notifications/",
  },
};

export default api;
