import { ActualitesService } from "@/services/api/actualites";
import { ApiClient } from "@/services/api/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useContext, useMemo } from "react";

interface ApiContextType {
  actualites: ActualitesService;
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
  const apiClient = useMemo(() => new ApiClient({ baseUrl }), [baseUrl]);

  const services = useMemo(
    () => ({
      actualites: new ActualitesService(apiClient),
    }),
    [apiClient]
  );

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
