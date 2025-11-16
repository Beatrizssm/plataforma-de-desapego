/**
 * Serviço de autenticação
 * Integração com backend /api/auth/*
 */

import api from "./api";

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
    const response = await api.post<AuthResponse>("/auth/login", data);
    
    if (response.success && response.data.token) {
      // Salvar token e usuário no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response;
  }

  /**
   * Registra novo usuário
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>("/auth/register", data);
    
    if (response.success && response.data.token) {
      // Salvar token e usuário no localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }
    
    return response;
  }

  /**
   * Faz logout do usuário
   */
  logout(): void {
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
}

export const authService = new AuthService();
export default authService;

