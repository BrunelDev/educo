import { logger } from "@/utils/logger";

interface ApiClientConfig {
  baseUrl: string;
  headers?: Record<string, string>;
}

type HeaderInterceptor = (
  headers: Record<string, string>
) => Record<string, string>;
type ResponseInterceptor = (response: Response) => Promise<Response>;

export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;
  private headerInterceptors: Set<HeaderInterceptor> = new Set();
  private responseInterceptors: Set<ResponseInterceptor> = new Set();

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl;
    this.headers = {
      "Content-Type": "application/json",
      ...config.headers,
    };
  }

  addHeaderInterceptor(interceptor: HeaderInterceptor) {
    this.headerInterceptors.add(interceptor);
  }

  removeHeaderInterceptor(interceptor: HeaderInterceptor) {
    this.headerInterceptors.delete(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.add(interceptor);
  }

  removeResponseInterceptor(interceptor: ResponseInterceptor) {
    this.responseInterceptors.delete(interceptor);
  }

  private async processResponse(response: Response): Promise<Response> {
    let processedResponse = response;
    for (const interceptor of this.responseInterceptors) {
      processedResponse = await interceptor(processedResponse);
    }
    return processedResponse;
  }

  private processHeaders(
    headers: Record<string, string>
  ): Record<string, string> {
    let processedHeaders = { ...headers };
    for (const interceptor of this.headerInterceptors) {
      processedHeaders = interceptor(processedHeaders);
    }
    return processedHeaders;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;

      // Traiter les headers avec les intercepteurs
      const processedHeaders = this.processHeaders({
        ...this.headers,
        ...options.headers,
      });

      const response = await fetch(url, {
        ...options,
        headers: processedHeaders,
      });

      // Traiter la réponse avec les intercepteurs
      const processedResponse = await this.processResponse(response);

      if (!processedResponse.ok) {
        const errorData = await processedResponse.json().catch(() => ({}));
        throw new Error(
          errorData.message || `HTTP error! status: ${processedResponse.status}`
        );
      }

      const data = await processedResponse.json();
      return data as T;
    } catch (error) {
      logger.error(`API request failed: ${endpoint}`, { error });
      throw error;
    }
  }

  // Les méthodes spécifiques à l'API seront générées ici à partir du OpenAPI
}
