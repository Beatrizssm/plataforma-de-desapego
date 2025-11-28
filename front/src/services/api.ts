/**
 * Configuração centralizada da API
 * Interceptadores para adicionar Bearer Token
 * Tratamento global de erros
 */

import logger from "../utils/logger";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

// Criar instância do fetch com interceptadores
class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private getToken(): string | null {
    return localStorage.getItem("token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken();
    
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const url = `${this.baseURL}${endpoint}`;
    
    // Log da requisição
    logger.debug(`Requisição ${options.method || "GET"}`, { url, endpoint });

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Se não autorizado, limpar token e redirecionar
      if (response.status === 401 || response.status === 403) {
        logger.warn("Requisição não autorizada", { url, status: response.status });
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Não autorizado");
      }

      // Verificar se a resposta tem conteúdo JSON
      const contentType = response.headers.get("content-type");
      let data;
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // Se não for JSON, tentar ler como texto
        const text = await response.text();
        throw new Error(text || "Erro na requisição");
      }

      // Verificar status HTTP e campo success
      if (!response.ok) {
        throw new Error(data.message || "Erro na requisição");
      }

      // Verificar se a resposta indica sucesso (mesmo com status 200)
      if (data.success === false) {
        logger.error("Resposta com success: false", { url, data });
        throw new Error(data.message || "Erro na requisição");
      }

      logger.api(options.method || "GET", url, response.status);
      return data;
    } catch (error) {
      // Tratar erros de rede (ERR_FAILED, ERR_CONNECTION_REFUSED, etc.)
      if (error instanceof TypeError) {
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("fetch") ||
          errorMessage.includes("network") ||
          errorMessage.includes("failed") ||
          errorMessage.includes("refused")
        ) {
          logger.error("Erro de conexão com o servidor", {
            url,
            baseURL: this.baseURL,
            error: error.message,
          });
          throw new Error(
            `Não foi possível conectar ao servidor em ${this.baseURL}. Verifique se o backend está rodando.`
          );
        }
      }
      
      if (error instanceof Error) {
        logger.error("Erro na requisição", { url, error: error.message });
        throw error;
      }
      
      logger.error("Erro desconhecido na requisição", { url });
      throw new Error("Erro desconhecido na requisição");
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient(API_URL);
export default api;

