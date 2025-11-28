import { Server } from "socket.io";
import { CHAT_EVENTS } from "./chatEvents.js";
import { chatController } from "../controllers/chatController.js";
import logger from "../logger/logger.js";

export function setupChat(server) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST"],
    },
  });

  io.on(CHAT_EVENTS.CONNECTION, (socket) => {
    logger.info({
      message: "Novo usuário conectado ao chat",
      socketId: socket.id,
      transport: socket.conn.transport.name,
    });

    // Evento para enviar mensagem
    socket.on(CHAT_EVENTS.SEND_MESSAGE, async (data) => {
      logger.info({
        message: "Mensagem recebida via Socket.IO",
        socketId: socket.id,
        userId: data.userId,
        itemId: data.itemId,
      });
      
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
          logger.info({
            message: "Mensagem enviada para a sala",
            roomId,
            messageId: savedMessage.id,
            itemId: data.itemId,
          });
        } else {
          // Se não houver itemId, enviar para todos (fallback)
          io.emit(CHAT_EVENTS.RECEIVE_MESSAGE, messageData);
          logger.warn({
            message: "Mensagem enviada sem itemId (fallback para todos)",
            messageId: savedMessage.id,
          });
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
          logger.info({
            message: "Notificação enviada para o dono do item",
            ownerId: savedMessage.item.ownerId,
            itemId: savedMessage.itemId,
            messageId: savedMessage.id,
          });
        }
      } catch (error) {
        logger.error({
          message: "Erro ao salvar/enviar mensagem via Socket.IO",
          error: error.message,
          stack: error.stack,
          socketId: socket.id,
          data,
        });
        socket.emit("error", { message: "Erro ao enviar mensagem" });
      }
    });

    // Evento para entrar em uma sala (ex: chat de um item específico)
    socket.on(CHAT_EVENTS.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      logger.debug({
        message: "Usuário entrou na sala do chat",
        socketId: socket.id,
        roomId,
      });
      
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
      logger.debug({
        message: "Usuário saiu da sala do chat",
        socketId: socket.id,
        roomId,
      });
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
    socket.on(CHAT_EVENTS.DISCONNECT, (reason) => {
      logger.info({
        message: "Usuário desconectado do chat",
        socketId: socket.id,
        reason,
      });
    });
  });

  return io;
}

