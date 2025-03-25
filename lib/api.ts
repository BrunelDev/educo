import axios from "axios";
interface User {
  token : string;
  id: number;
  email: string;
  profile_image: string | null;
  first_name: string;
  last_name: string;
}
const userInfo : User = JSON.parse(localStorage.getItem("userInfo") as string)
  

// Create axios instance with custom config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/",
  headers: {
      "Content-Type": "application/json",
      "Authorization" : "Bearer " + (userInfo?.token || '')
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
    list: "/reunions/",
    create: "/reunions/creer/",
    update: (id: string) => `/meetings/${id}`,
    delete: (id: string) => `/meetings/${id}`,
  },
  fichiers: {
    dossiers: {
      list: "/fichiers/dossiers/",
      create: "/dossiers/creer/",
      update: (id: string) => `/dossiers/${id}`,
      delete: (id: string) => `/dossiers/${id}`,
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
      base : "/formations/ressources/"
      
    }
  },
  equipes: {
    base: "equipe/equipes/",
    
  },
  consultations: {
    base : "consultations/"
  }
};



export default api;
