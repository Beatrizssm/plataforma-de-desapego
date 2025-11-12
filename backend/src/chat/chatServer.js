import { Server } from "socket.io";
import { CHAT_EVENTS } from "./chatEvents.js";
import { chatController } from "../controllers/chatController.js";

export function setupChat(server) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on(CHAT_EVENTS.CONNECTION, (socket) => {
    console.log("🟢 Novo usuário conectado:", socket.id);

    // Evento para enviar mensagem
    socket.on(CHAT_EVENTS.SEND_MESSAGE, async (data) => {
      console.log("💬 Mensagem recebida:", data);
      
      try {
        // Salvar mensagem no banco de dados
        const savedMessage = await chatController.saveMessage(data);
        
        const messageData = {
          id: savedMessage.id,
          text: savedMessage.text,
          message: savedMessage.text,
          userId: savedMessage.userId,
          userName: savedMessage.user.name,
          itemId: savedMessage.itemId,
          socketId: socket.id,
          timestamp: savedMessage.timestamp.toISOString(),
          user: savedMessage.user,
        };

        // Se houver itemId, enviar apenas para a sala do item
        if (data.itemId) {
          const roomId = `item-${data.itemId}`;
          io.to(roomId).emit(CHAT_EVENTS.RECEIVE_MESSAGE, messageData);
          console.log(`📤 Mensagem salva e enviada para a sala: ${roomId}`);
        } else {
          // Se não houver itemId, enviar para todos (fallback)
          io.emit(CHAT_EVENTS.RECEIVE_MESSAGE, messageData);
        }

        // Notificar o dono do item (se for outro usuário que enviou)
        if (savedMessage.userId !== savedMessage.item.ownerId) {
          const notification = {
            type: "new_message",
            title: "Nova mensagem!",
            body: `${savedMessage.user.name} enviou uma mensagem sobre: ${savedMessage.item.title}`,
            itemId: savedMessage.itemId,
            itemTitle: savedMessage.item.title,
            userId: savedMessage.userId,
            userName: savedMessage.user.name,
            timestamp: savedMessage.timestamp.toISOString(),
          };

          // Enviar notificação para o dono do item
          io.emit(`notify:${savedMessage.item.ownerId}`, notification);
          console.log(`🔔 Notificação enviada para o dono do item (userId: ${savedMessage.item.ownerId})`);
        }
      } catch (error) {
        console.error("❌ Erro ao salvar/enviar mensagem:", error);
        socket.emit("error", { message: "Erro ao enviar mensagem" });
      }
    });

    // Evento para entrar em uma sala (ex: chat de um item específico)
    socket.on(CHAT_EVENTS.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      console.log(`👤 Usuário ${socket.id} entrou na sala: ${roomId}`);
      
      // Notifica outros na sala
      socket.to(roomId).emit(CHAT_EVENTS.RECEIVE_MESSAGE, {
        type: "system",
        message: `Um usuário entrou no chat`,
        roomId,
      });
    });

    // Evento para sair de uma sala
    socket.on(CHAT_EVENTS.LEAVE_ROOM, (roomId) => {
      socket.leave(roomId);
      console.log(`👤 Usuário ${socket.id} saiu da sala: ${roomId}`);
    });

    // Evento para indicar que usuário está digitando
    socket.on(CHAT_EVENTS.USER_TYPING, (data) => {
      socket.broadcast.emit(CHAT_EVENTS.USER_TYPING, {
        ...data,
        socketId: socket.id,
      });
    });

    // Evento para indicar que usuário parou de digitar
    socket.on(CHAT_EVENTS.USER_STOPPED_TYPING, (data) => {
      socket.broadcast.emit(CHAT_EVENTS.USER_STOPPED_TYPING, {
        ...data,
        socketId: socket.id,
      });
    });

    // Evento de desconexão
    socket.on(CHAT_EVENTS.DISCONNECT, () => {
      console.log("🔴 Usuário desconectado:", socket.id);
    });
  });

  return io;
}

