/**
 * Serviço de chat
 * Integração com backend /api/chat/*
 */

import api from "./api";

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
    const response = await api.get<MessagesResponse>(`/chat/messages/${itemId}`);
    return response.data || [];
  }

  /**
   * Busca todos os chats do usuário logado
   */
  async getUserChats(): Promise<ChatItem[]> {
    const response = await api.get<UserChatsResponse>("/chat/me");
    return response.data || [];
  }
}

export const chatService = new ChatService();
export default chatService;

