import axios from "axios";


// Create axios instance with custom config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/",
  headers: {
      "Content-Type": "application/json",
      "Authorization" : "Bearer" + localStorage.getItem("access_token")
  },
});



// API endpoints
export const endpoints = {
  auth: {
    login: "/auth/utilisateurs/connexion/",
    register: "auth/utilisateurs/inscription/",
    logout: "/auth/logout",
  },
  meetings: {
    list: "/meetings",
    create: "/meetings",
    update: (id: string) => `/meetings/${id}`,
    delete: (id: string) => `/meetings/${id}`,
  },
  documents: {
    list: "/documents",
    upload: "/documents/upload",
    download: (id: string) => `/documents/${id}`,
  },
};

export default api;
