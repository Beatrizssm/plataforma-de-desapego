import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChat } from '../useChat';
import { useAuth } from '../useAuth';

// Mock do useAuth
vi.mock('../useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock do socket.io-client
const mockSocket = {
  on: vi.fn(),
  emit: vi.fn(),
  off: vi.fn(),
  disconnect: vi.fn(),
  connected: true,
  id: 'mock-socket-id',
};

vi.mock('socket.io-client', () => ({
  io: vi.fn(() => mockSocket),
}));

// Mock do fetch
global.fetch = vi.fn();

describe('useChat', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useAuth as any).mockReturnValue({ user: mockUser });
  });

  it('deve inicializar com estado desconectado', () => {
    const { result } = renderHook(() => useChat({ itemId: 1 }));

    expect(result.current.isConnected).toBe(false);
    expect(result.current.messages).toEqual([]);
  });

  it('deve carregar mensagens ao montar', async () => {
    const mockMessages = [
      {
        id: 1,
        text: 'Mensagem 1',
        userId: 1,
        itemId: 1,
        timestamp: new Date().toISOString(),
        user: mockUser,
      },
    ];

    (fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        success: true,
        data: mockMessages,
      }),
    });

    const { result } = renderHook(() => useChat({ itemId: 1 }));

    await waitFor(() => {
      expect(result.current.messages.length).toBeGreaterThan(0);
    });
  });

  it('deve enviar mensagem quando conectado', () => {
    const { result } = renderHook(() => useChat({ itemId: 1 }));

    // Simular conexão
    result.current.isConnected = true;

    const success = result.current.sendMessage('Nova mensagem');
    expect(success).toBe(true);
  });

  it('deve retornar false ao tentar enviar sem conexão', () => {
    // Mock socket desconectado
    mockSocket.connected = false;
    
    // Mock fetch para evitar erro no loadMessages
    (fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: {
        get: () => 'application/json',
      },
      json: async () => ({
        success: true,
        data: [],
      }),
    });
    
    const { result } = renderHook(() => useChat({ itemId: 1 }));

    const success = result.current.sendMessage('Mensagem');
    expect(success).toBe(false);
    
    // Restaurar para outros testes
    mockSocket.connected = true;
  });
});

