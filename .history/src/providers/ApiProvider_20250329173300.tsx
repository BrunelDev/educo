import { ActualitesService } from "@/services/api/actualites";
import { AuthService } from "@/services/api/auth";
import { ApiClient } from "@/services/api/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useMemo } from "react";

interface ApiContextType {
  actualites: ActualitesService;
  auth: AuthService;
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
    }),
    [apiClient]
  );

  // Intercepteur pour ajouter le token d'authentification
  useEffect(() => {
    const interceptor = (headers: Record<string, string>) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      return headers;
    };

    apiClient.addHeaderInterceptor(interceptor);
    return () => apiClient.removeHeaderInterceptor(interceptor);
  }, [apiClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <ApiContext.Provider value={services}>{children}</ApiContext.Provider>
    </QueryClientProvider>
  );
}

export function useApi() {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error("useApi doit être utilisé à l'intérieur d'un ApiProvider");
  }
  return context;
}
