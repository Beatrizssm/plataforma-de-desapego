import prisma from "../prisma/client.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { asyncHandler } from "../middlewares/errorHandler.js";
import logger from "../logger/logger.js";

export const chatController = {
  getMessages: asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const itemIdNum = Number(itemId);
    
    logger.info({
      message: "Buscando mensagens do item",
      itemId: itemIdNum,
      ip: req.ip,
    });

    const messages = await prisma.message.findMany({
      where: { itemId: itemIdNum },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { timestamp: "asc" },
    });

    logger.info({
      message: "Mensagens recuperadas com sucesso",
      itemId: itemIdNum,
      count: messages.length,
    });

    return successResponse(res, "Mensagens recuperadas com sucesso!", messages);
  }),

  getUserChats: asyncHandler(async (req, res) => {
    const userId = req.user.id; // obtido via middleware JWT

    logger.info({
      message: "Buscando chats do usuário",
      userId,
      ip: req.ip,
    });

    // Busca todos os itens que o usuário possui ou participou do chat
    const items = await prisma.item.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { messages: { some: { userId } } },
        ],
      },
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        messages: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { timestamp: "desc" },
          take: 1, // Última mensagem
        },
        _count: {
          select: {
            messages: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Formatar resposta com última mensagem e contagem
    const formattedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      ownerId: item.ownerId,
      owner: item.owner,
      isOwner: item.ownerId === userId,
      lastMessage: item.messages[0] || null,
      messageCount: item._count.messages,
      createdAt: item.createdAt,
    }));

    logger.info({
      message: "Chats do usuário recuperados com sucesso",
      userId,
      count: formattedItems.length,
    });

    return successResponse(res, "Chats do usuário recuperados com sucesso!", formattedItems);
  }),

  async saveMessage(data) {
    try {
      const message = await prisma.message.create({
        data: {
          text: data.message || data.text,
          userId: data.userId,
          itemId: data.itemId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          item: {
            select: {
              id: true,
              title: true,
              ownerId: true,
            },
          },
        },
      });
      logger.info({
        message: "Mensagem salva com sucesso",
        messageId: message.id,
        userId: message.userId,
        itemId: message.itemId,
      });
      
      return message;
    } catch (error) {
      logger.error({
        message: "Erro ao salvar mensagem",
        error: error.message,
        stack: error.stack,
        data,
      });
      throw error;
    }
  },
};

