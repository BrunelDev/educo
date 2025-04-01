import { ActualitesService } from "@/services/api/actualites";
import { AuthService } from "@/services/api/auth";
import { ApiClient } from "@/services/api/client";
import { ConsultationsService } from "@/services/api/consultations";
import { ReunionsService } from "@/services/api/reunions";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo } from "react";

interface ApiContextType {
  actualites: ActualitesService;
  auth: AuthService;
  consultations: ConsultationsService;
  reunions: ReunionsService;
}

const ApiContext = createContext<ApiContextType | null>(null);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

interface ApiProviderProps {
  children: React.ReactNode;
  baseUrl: string;
}

export function ApiProvider({ children, baseUrl }: ApiProviderProps) {
  const apiClient = useMemo(() => {
    return new ApiClient({
      baseUrl,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }, [baseUrl]);

  const services = useMemo(
    () => ({
      actualites: new ActualitesService(apiClient),
      auth: new AuthService(apiClient),
      consultations: new ConsultationsService(apiClient),
      reunions: new ReunionsService(apiClient),
    }),
    [apiClient]
  );

  // Intercepteur pour ajouter le token d'authentification
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiClient.addHeaderInterceptor((headers) => ({
        ...headers,
        Authorization: `Bearer ${token}`,
      }));
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={services}>{children}</ApiContext.Provider>
    </QueryClientProvider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi must be used within an ApiProvider");
  }
  return context;
}
