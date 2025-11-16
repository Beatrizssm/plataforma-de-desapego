/**
 * Hook para gerenciar chat em tempo real
 * Integração com Socket.IO
 */

import { useEffect, useState, useRef, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

interface Message {
  id: number | string;
  text: string;
  userId: number;
  itemId: number;
  timestamp: string | Date;
  user?: {
    id: number;
    name: string;
    email: string;
  };
}

interface UseChatOptions {
  itemId: number;
  onNewMessage?: (message: Message) => void;
}

export function useChat({ itemId, onNewMessage }: UseChatOptions) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  // Conectar ao Socket.IO
  useEffect(() => {
    if (!itemId || !user) return;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("🟢 Conectado ao chat:", socket.id);
      setIsConnected(true);
      socket.emit("joinRoom", `item-${itemId}`);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do chat");
      setIsConnected(false);
    });

    // Receber mensagens em tempo real
    socket.on("receiveMessage", (data: any) => {
      console.log("💬 Nova mensagem recebida:", data);

      if (data.type === "system") {
        return;
      }

      const newMessage: Message = {
        id: data.id || `${Date.now()}-${socket.id}`,
        text: data.message || data.text || "",
        userId: data.userId,
        itemId: data.itemId,
        timestamp: data.timestamp || new Date(),
        user: data.user,
      };

      setMessages((prev) => {
        // Verificar duplicatas
        const exists = prev.some(
          (msg) =>
            msg.id === newMessage.id ||
            (msg.text === newMessage.text &&
              Math.abs(
                new Date(msg.timestamp).getTime() -
                  new Date(newMessage.timestamp).getTime()
              ) < 1000)
        );

        if (exists) {
          return prev;
        }

        return [...prev, newMessage];
      });

      if (onNewMessage) {
        onNewMessage(newMessage);
      }
    });

    // Escutar notificações
    if (user.id) {
      socket.on(`notify:${user.id}`, (notification: any) => {
        if (notification.type === "new_message") {
          toast.success(`${notification.title} - ${notification.body}`, {
            duration: 5000,
          });
        }
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("receiveMessage");
        if (user.id) {
          socketRef.current.off(`notify:${user.id}`);
        }
        socketRef.current.emit("leaveRoom", `item-${itemId}`);
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [itemId, user, onNewMessage]);

  // Enviar mensagem
  const sendMessage = useCallback(
    (text: string) => {
      if (!socketRef.current || !socketRef.current.connected || !user) {
        toast.error("Não conectado ao servidor. Aguarde...");
        return false;
      }

      const messageText = text.trim();
      if (!messageText) {
        return false;
      }

      socketRef.current.emit("sendMessage", {
        userId: user.id,
        userName: user.name,
        message: messageText,
        text: messageText,
        itemId: itemId,
      });

      return true;
    },
    [user, itemId]
  );

  // Carregar histórico de mensagens
  const loadMessages = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(
        `${SOCKET_URL.replace(":4000", "")}/api/chat/messages/${itemId}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setMessages(data.data);
        }
      }
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  }, [itemId]);

  useEffect(() => {
    if (itemId) {
      loadMessages();
    }
  }, [itemId, loadMessages]);

  return {
    messages,
    isConnected,
    sendMessage,
    loadMessages,
  };
}

