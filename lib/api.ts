import axios from "axios";


// Create axios instance with custom config
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://192.168.100.2:8000/api/",
  headers: {
      "Content-Type": "application/json",
      "Authorization" : "Bearer" + localStorage.getItem("access_token")
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage in client-side
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Clear localStorage and redirect to login
      if (typeof window !== "undefined") {
        localStorage.clear();
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

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
