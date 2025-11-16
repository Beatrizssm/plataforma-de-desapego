import prisma from "../prisma/client.js";
import { successResponse, errorResponse } from "../utils/responseHelper.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const chatController = {
  getMessages: asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const messages = await prisma.message.findMany({
      where: { itemId: Number(itemId) },
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

    return successResponse(res, "Mensagens recuperadas com sucesso!", messages);
  }),

  getUserChats: asyncHandler(async (req, res) => {
    const userId = req.user.id; // obtido via middleware JWT

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
      return message;
    } catch (error) {
      console.error("Erro ao salvar mensagem:", error);
      throw error;
    }
  },
};

