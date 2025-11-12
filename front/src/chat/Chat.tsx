import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

// URL do backend - ajuste se necessário
const SOCKET_URL = "http://localhost:4000";

// Criar instância do socket (fora do componente para manter a conexão)
let socket: Socket | null = null;

export default function Chat() {
  const [messages, setMessages] = useState<Array<{
    text: string;
    user: string;
    timestamp: string;
    socketId?: string;
  }>>([]);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Inicializar conexão Socket.IO
    if (!socket) {
      socket = io(SOCKET_URL, {
        transports: ["websocket", "polling"],
      });
    }

    // Evento de conexão
    socket.on("connect", () => {
      console.log("🟢 Conectado ao servidor Socket.IO:", socket?.id);
      setIsConnected(true);
    });

    // Evento de desconexão
    socket.on("disconnect", () => {
      console.log("🔴 Desconectado do servidor");
      setIsConnected(false);
    });

    // Receber mensagens
    socket.on("receiveMessage", (data: any) => {
      console.log("💬 Nova mensagem recebida:", data);
      setMessages((prev) => [
        ...prev,
        {
          text: data.message || data.text || "",
          user: data.userName || data.user || "Usuário",
          timestamp: data.timestamp || new Date().toLocaleTimeString("pt-BR"),
          socketId: data.socketId,
        },
      ]);
    });

    // Scroll para a última mensagem
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    // Cleanup ao desmontar
    return () => {
      if (socket) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("receiveMessage");
      }
    };
  }, []);

  // Scroll automático quando novas mensagens chegam
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (text: string) => {
    if (!socket || !socket.connected) {
      console.error("Socket não está conectado");
      return;
    }

    // Obter nome do usuário do localStorage ou usar padrão
    const currentUser = localStorage.getItem("currentUser") || "Usuário";
    const userId = localStorage.getItem("userId") || "1";

    const newMessage = {
      userId: parseInt(userId),
      userName: currentUser,
      message: text,
      text: text, // Compatibilidade
      itemId: 1, // Pode ser obtido da URL ou props
      timestamp: new Date().toLocaleTimeString("pt-BR"),
    };

    // Enviar mensagem via Socket.IO
    socket.emit("sendMessage", newMessage);

    // Adicionar mensagem localmente (opcional, para feedback imediato)
    setMessages((prev) => [
      ...prev,
      {
        text,
        user: currentUser,
        timestamp: new Date().toLocaleTimeString("pt-BR"),
      },
    ]);
  };

  return (
    <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: "#3A2B1D", marginBottom: "10px" }}>💬 Chat em tempo real</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "50%",
              backgroundColor: isConnected ? "#22c55e" : "#ef4444",
            }}
          />
          <span style={{ color: "#8B5E3C", fontSize: "14px" }}>
            {isConnected ? "Conectado" : "Desconectado"}
          </span>
        </div>
      </div>
      <MessageList messages={messages} />
      <div ref={messagesEndRef} />
      <MessageInput onSend={handleSendMessage} />
    </div>
  );
}

