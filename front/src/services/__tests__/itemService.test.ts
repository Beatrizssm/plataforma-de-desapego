import { describe, it, expect, beforeEach, vi } from 'vitest';
import itemService from '../itemService';
import api from '../api';

// Mock do api
vi.mock('../api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('ItemService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getAllItems', () => {
    it('deve retornar lista de itens', async () => {
      const mockResponse = {
        success: true,
        message: 'Itens listados com sucesso!',
        data: [
          { id: 1, title: 'Item 1', price: 99.99 },
          { id: 2, title: 'Item 2', price: 199.99 },
        ],
      };

      (api.get as any).mockResolvedValueOnce(mockResponse);

      const result = await itemService.getAllItems();

      expect(api.get).toHaveBeenCalledWith('/items');
      expect(result).toEqual(mockResponse.data);
    });

    it('deve retornar array vazio quando não há itens', async () => {
      const mockResponse = {
        success: true,
        message: 'Itens listados com sucesso!',
        data: [],
      };

      (api.get as any).mockResolvedValueOnce(mockResponse);

      const result = await itemService.getAllItems();

      expect(result).toEqual([]);
    });
  });

  describe('getItemById', () => {
    it('deve retornar um item específico', async () => {
      const mockItem = {
        id: 1,
        title: 'Item Teste',
        description: 'Descrição',
        price: 99.99,
        owner: { id: 1, name: 'Owner', email: 'owner@example.com' },
      };

      const mockResponse = {
        success: true,
        message: 'Item encontrado!',
        data: mockItem,
      };

      (api.get as any).mockResolvedValueOnce(mockResponse);

      const result = await itemService.getItemById(1);

      expect(api.get).toHaveBeenCalledWith('/items/1');
      expect(result).toEqual(mockItem);
    });
  });

  describe('createItem', () => {
    it('deve criar um novo item', async () => {
      const itemData = {
        title: 'Novo Item',
        description: 'Descrição do item',
        price: 150.00,
      };

      const mockItem = {
        id: 3,
        ...itemData,
        ownerId: 1,
        available: true,
      };

      const mockResponse = {
        success: true,
        message: 'Item criado com sucesso!',
        data: mockItem,
      };

      (api.post as any).mockResolvedValueOnce(mockResponse);

      const result = await itemService.createItem(itemData);

      expect(api.post).toHaveBeenCalledWith('/items', itemData);
      expect(result).toEqual(mockItem);
    });
  });

  describe('updateItem', () => {
    it('deve atualizar um item', async () => {
      const updateData = {
        title: 'Item Atualizado',
        price: 200.00,
      };

      const mockItem = {
        id: 1,
        ...updateData,
        description: 'Descrição original',
        ownerId: 1,
      };

      const mockResponse = {
        success: true,
        message: 'Item atualizado com sucesso!',
        data: mockItem,
      };

      (api.put as any).mockResolvedValueOnce(mockResponse);

      const result = await itemService.updateItem(1, updateData);

      expect(api.put).toHaveBeenCalledWith('/items/1', updateData);
      expect(result).toEqual(mockItem);
    });
  });

  describe('deleteItem', () => {
    it('deve deletar um item', async () => {
      const mockResponse = {
        success: true,
        message: 'Item excluído com sucesso!',
      };

      (api.delete as any).mockResolvedValueOnce(mockResponse);

      await itemService.deleteItem(1);

      expect(api.delete).toHaveBeenCalledWith('/items/1');
    });
  });
});

