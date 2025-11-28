import { describe, it, expect, beforeEach, vi } from 'vitest';
import api from '../api';

// Mock do fetch global
global.fetch = vi.fn();

describe('ApiClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('get', () => {
    it('deve fazer requisição GET com sucesso', async () => {
      const mockData = { success: true, data: { id: 1, name: 'Test' } };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => mockData,
      });

      const result = await api.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/test'),
        expect.objectContaining({ method: 'GET' })
      );
      expect(result).toEqual(mockData);
    });

    it('deve adicionar token de autorização quando disponível', async () => {
      localStorage.setItem('token', 'test-token');
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ success: true }),
      });

      await api.get('/test');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-token',
          }),
        })
      );
    });

    it('deve tratar erro de rede', async () => {
      (fetch as any).mockRejectedValueOnce(new TypeError('Failed to fetch'));

      await expect(api.get('/test')).rejects.toThrow(
        /Não foi possível conectar ao servidor/
      );
    });

    it('deve tratar erro 401 removendo token', async () => {
      localStorage.setItem('token', 'invalid-token');
      
      const mockLocation = { href: '' };
      Object.defineProperty(window, 'location', {
        value: mockLocation,
        writable: true,
      });

      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 401,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ success: false, message: 'Não autorizado' }),
      });

      await expect(api.get('/test')).rejects.toThrow('Não autorizado');
      expect(localStorage.getItem('token')).toBeNull();
    });
  });

  describe('post', () => {
    it('deve fazer requisição POST com dados', async () => {
      const mockData = { success: true, data: { id: 1 } };
      const requestData = { name: 'Test', email: 'test@example.com' };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => mockData,
      });

      const result = await api.post('/test', requestData);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'POST',
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('put', () => {
    it('deve fazer requisição PUT com dados', async () => {
      const mockData = { success: true, data: { id: 1 } };
      const requestData = { name: 'Updated' };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => mockData,
      });

      const result = await api.put('/test/1', requestData);

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify(requestData),
        })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('delete', () => {
    it('deve fazer requisição DELETE', async () => {
      const mockData = { success: true, message: 'Deletado' };
      
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => mockData,
      });

      const result = await api.delete('/test/1');

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'DELETE' })
      );
      expect(result).toEqual(mockData);
    });
  });

  describe('tratamento de erros', () => {
    it('deve verificar campo success: false', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: {
          get: () => 'application/json',
        },
        json: async () => ({ success: false, message: 'Erro na operação' }),
      });

      await expect(api.get('/test')).rejects.toThrow('Erro na operação');
    });

    it('deve tratar resposta não-JSON', async () => {
      (fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        headers: {
          get: () => 'text/plain',
        },
        text: async () => 'Erro interno do servidor',
      });

      await expect(api.get('/test')).rejects.toThrow('Erro interno do servidor');
    });
  });
});

