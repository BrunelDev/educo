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
