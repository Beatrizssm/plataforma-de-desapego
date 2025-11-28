/**
 * Serviço de chat
 * Integração com backend /api/chat/*
 */

import api from "./api";
import logger from "../utils/logger";

export interface Message {
  id: number;
  text: string;
  timestamp: string;
  userId: number;
  itemId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface ChatItem {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl?: string | null;
  ownerId: number;
  owner: {
    id: number;
    name: string;
    email: string;
  };
  isOwner: boolean;
  lastMessage: Message | null;
  messageCount: number;
  createdAt: string;
}

export interface MessagesResponse {
  success: boolean;
  message: string;
  data: Message[];
}

export interface UserChatsResponse {
  success: boolean;
  message: string;
  data: ChatItem[];
}

class ChatService {
  /**
   * Busca mensagens de um item específico
   */
  async getMessages(itemId: number): Promise<Message[]> {
    try {
      logger.chat("Buscando mensagens", { itemId });
      const response = await api.get<MessagesResponse>(`/chat/${itemId}`);
      logger.chat("Mensagens carregadas", { itemId, count: response.data?.length || 0 });
      return response.data || [];
    } catch (error) {
      logger.error("Erro ao carregar mensagens", { itemId, error });
      throw error;
    }
  }

  /**
   * Busca todos os chats do usuário logado
   */
  async getUserChats(): Promise<ChatItem[]> {
    try {
      logger.chat("Buscando chats do usuário");
      const response = await api.get<UserChatsResponse>("/chat/me");
      logger.chat("Chats carregados", { count: response.data?.length || 0 });
      return response.data || [];
    } catch (error) {
      logger.error("Erro ao carregar chats", { error });
      throw error;
    }
  }
}

export const chatService = new ChatService();
export default chatService;

