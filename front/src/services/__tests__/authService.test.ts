import { describe, it, expect, beforeEach, vi } from 'vitest';
import authService from '../authService';
import api from '../api';

// Mock do api
vi.mock('../api', () => ({
  default: {
    post: vi.fn(),
  },
}));

describe('AuthService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('login', () => {
    it('deve fazer login com sucesso e salvar token', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResponse = {
        success: true,
        message: 'Login realizado com sucesso!',
        data: {
          user: {
            id: 1,
            name: 'Test User',
            email: 'test@example.com',
          },
          token: 'mock-jwt-token',
        },
      };

      (api.post as any).mockResolvedValueOnce(mockResponse);

      const result = await authService.login(loginData);

      expect(api.post).toHaveBeenCalledWith('/auth/login', loginData);
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(localStorage.getItem('user')).toBe(JSON.stringify(mockResponse.data.user));
      expect(result).toEqual(mockResponse);
    });

    it('deve lançar erro se login falhar', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      (api.post as any).mockRejectedValueOnce(new Error('Credenciais inválidas'));

      await expect(authService.login(loginData)).rejects.toThrow('Credenciais inválidas');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('register', () => {
    it('deve registrar usuário com sucesso e salvar token', async () => {
      const registerData = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const mockResponse = {
        success: true,
        message: 'Usuário registrado com sucesso!',
        data: {
          user: {
            id: 2,
            name: 'New User',
            email: 'new@example.com',
          },
          token: 'mock-jwt-token',
        },
      };

      (api.post as any).mockResolvedValueOnce(mockResponse);

      const result = await authService.register(registerData);

      expect(api.post).toHaveBeenCalledWith('/auth/register', registerData);
      expect(localStorage.getItem('token')).toBe('mock-jwt-token');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('logout', () => {
    it('deve remover token e usuário do localStorage', () => {
      localStorage.setItem('token', 'test-token');
      localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Test' }));

      authService.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('user')).toBeNull();
    });
  });

  describe('isAuthenticated', () => {
    it('deve retornar true quando token existe', () => {
      localStorage.setItem('token', 'test-token');
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('deve retornar false quando token não existe', () => {
      localStorage.removeItem('token');
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('deve retornar usuário do localStorage', () => {
      const user = { id: 1, name: 'Test User', email: 'test@example.com' };
      localStorage.setItem('user', JSON.stringify(user));

      expect(authService.getCurrentUser()).toEqual(user);
    });

    it('deve retornar null quando usuário não existe', () => {
      localStorage.removeItem('user');
      expect(authService.getCurrentUser()).toBeNull();
    });

    it('deve retornar null quando JSON é inválido', () => {
      localStorage.setItem('user', 'invalid-json');
      expect(authService.getCurrentUser()).toBeNull();
    });
  });
});

