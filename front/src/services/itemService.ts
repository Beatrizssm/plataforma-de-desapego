/**
 * Serviço de itens
 * Integração com backend /api/items/*
 */

import api from "./api";

export interface Item {
  id: number;
  title: string;
  description: string;
  price: number;
  available: boolean;
  imageUrl?: string | null;
  ownerId: number;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  createdAt: string;
}

export interface CreateItemData {
  title: string;
  description: string;
  price: number;
  available?: boolean;
  imageUrl?: string;
}

export interface UpdateItemData {
  title?: string;
  description?: string;
  price?: number;
  available?: boolean;
  imageUrl?: string;
}

export interface ItemsResponse {
  success: boolean;
  message: string;
  data: Item[];
}

export interface ItemResponse {
  success: boolean;
  message: string;
  data: Item;
}

class ItemService {
  /**
   * Busca todos os itens
   */
  async getAllItems(): Promise<Item[]> {
    const response = await api.get<ItemsResponse>("/items");
    return response.data || [];
  }

  /**
   * Busca um item por ID
   */
  async getItemById(id: number): Promise<Item> {
    const response = await api.get<ItemResponse>(`/items/${id}`);
    return response.data;
  }

  /**
   * Cria um novo item (requer autenticação)
   */
  async createItem(data: CreateItemData): Promise<Item> {
    const response = await api.post<ItemResponse>("/items", data);
    return response.data;
  }

  /**
   * Atualiza um item (requer autenticação e ser dono)
   */
  async updateItem(id: number, data: UpdateItemData): Promise<Item> {
    const response = await api.put<ItemResponse>(`/items/${id}`, data);
    return response.data;
  }

  /**
   * Deleta um item (requer autenticação e ser dono)
   */
  async deleteItem(id: number): Promise<void> {
    await api.delete(`/items/${id}`);
  }
}

export const itemService = new ItemService();
export default itemService;

