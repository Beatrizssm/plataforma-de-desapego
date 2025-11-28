/**
 * Serviço de autenticação
 * Integração com backend /api/auth/*
 */

import api from "./api";
import logger from "../utils/logger";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: number;
      name: string;
      email: string;
      profile?: string;
      createdAt?: string;
    };
    token: string;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  profile?: string;
  createdAt?: string;
}

class AuthService {
  /**
   * Realiza login do usuário
   */
  async login(data: LoginData): Promise<AuthResponse> {
    logger.auth("login", false, { email: data.email });
    
    try {
      const response = await api.post<AuthResponse>("/auth/login", data);
      
      if (response.success && response.data.token) {
        // Salvar token e usuário no localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        logger.auth("login", true, { userId: response.data.user.id, email: response.data.user.email });
      }
      
      return response;
    } catch (error) {
      logger.auth("login", false, { email: data.email, error });
      throw error;
    }
  }

  /**
   * Registra novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    logger.auth("register", false, { email: data.email, name: data.name });
    
    try {
      const response = await api.post<AuthResponse>("/auth/register", data);
      
      if (response.success && response.data.token) {
        // Salvar token e usuário no localStorage
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        logger.auth("register", true, { userId: response.data.user.id, email: response.data.user.email });
      }
      
      return response;
    } catch (error) {
      logger.auth("register", false, { email: data.email, error });
      throw error;
    }
  }

  /**
   * Faz logout do usuário
   */
  logout(): void {
    const user = this.getCurrentUser();
    logger.auth("logout", true, { userId: user?.id, email: user?.email });
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }

  /**
   * Verifica se o usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem("token");
  }

  /**
   * Obtém o token atual
   */
  getToken(): string | null {
    return localStorage.getItem("token");
  }

  /**
   * Obtém o usuário atual
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  }

  /**
   * Altera a senha do usuário
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    logger.auth("changePassword", false, {});
    
    try {
      const response = await api.post<{ success: boolean; message: string }>("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      
      if (response.success) {
        logger.auth("changePassword", true, {});
      }
      
      return response;
    } catch (error) {
      logger.auth("changePassword", false, { error });
      throw error;
    }
  }
}

export const authService = new AuthService();
export default authService;

