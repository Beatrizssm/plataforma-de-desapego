import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockPrisma } from "../mocks/prismaMock.js";

// Criar mock
const mockPrisma = createMockPrisma();

// Mock do módulo antes de importar o controller
vi.mock("../../src/prisma/client.js", () => ({
  default: mockPrisma,
}));

describe("chatController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getMessages", () => {
    it("deve retornar mensagens de um item específico", async () => {
      const itemId = 1;
      const messages = [
        {
          id: 1,
          text: "Mensagem 1",
          timestamp: new Date("2024-01-01"),
          userId: 1,
          itemId: 1,
          user: {
            id: 1,
            name: "User 1",
            email: "user1@example.com",
          },
        },
        {
          id: 2,
          text: "Mensagem 2",
          timestamp: new Date("2024-01-02"),
          userId: 2,
          itemId: 1,
          user: {
            id: 2,
            name: "User 2",
            email: "user2@example.com",
          },
        },
      ];

      mockPrisma.message.findMany.mockResolvedValue(messages);

      const { chatController } = await import("../../src/controllers/chatController.js");
      
      const req = {
        params: { itemId: String(itemId) },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await chatController.getMessages(req, res);

      expect(mockPrisma.message.findMany).toHaveBeenCalledWith({
        where: { itemId: itemId },
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
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Mensagens recuperadas com sucesso!",
        data: messages,
      });
    });

    it("deve retornar array vazio quando não há mensagens", async () => {
      mockPrisma.message.findMany.mockResolvedValue([]);

      const { chatController } = await import("../../src/controllers/chatController.js");
      
      const req = {
        params: { itemId: "999" },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await chatController.getMessages(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Mensagens recuperadas com sucesso!",
        data: [],
      });
    });
  });

  describe("getUserChats", () => {
    it("deve retornar chats do usuário logado", async () => {
      const userId = 1;
      const items = [
        {
          id: 1,
          title: "Item 1",
          description: "Descrição 1",
          price: 99.99,
          imageUrl: null,
          ownerId: 1,
          createdAt: new Date(),
          owner: {
            id: 1,
            name: "Owner",
            email: "owner@example.com",
          },
          messages: [
            {
              id: 1,
              text: "Última mensagem",
              timestamp: new Date(),
              userId: 2,
              user: {
                id: 2,
                name: "User 2",
                email: "user2@example.com",
              },
            },
          ],
          _count: {
            messages: 5,
          },
        },
      ];

      mockPrisma.item.findMany.mockResolvedValue(items);

      const { chatController } = await import("../../src/controllers/chatController.js");
      
      const req = {
        user: { id: userId },
      };
      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      };

      await chatController.getUserChats(req, res);

      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
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
            take: 1,
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
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalled();
    });
  });

  describe("saveMessage", () => {
    it("deve salvar uma mensagem com sucesso", async () => {
      const messageData = {
        message: "Nova mensagem",
        userId: 1,
        itemId: 1,
      };

      const savedMessage = {
        id: 1,
        text: messageData.message,
        userId: messageData.userId,
        itemId: messageData.itemId,
        timestamp: new Date(),
        user: {
          id: 1,
          name: "User",
          email: "user@example.com",
        },
        item: {
          id: 1,
          title: "Item",
          ownerId: 2,
        },
      };

      mockPrisma.message.create.mockResolvedValue(savedMessage);

      const { chatController } = await import("../../src/controllers/chatController.js");
      
      const result = await chatController.saveMessage(messageData);

      expect(mockPrisma.message.create).toHaveBeenCalledWith({
        data: {
          text: messageData.message,
          userId: messageData.userId,
          itemId: messageData.itemId,
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
      expect(result).toEqual(savedMessage);
    });

    it("deve aceitar 'text' como alternativa a 'message'", async () => {
      const messageData = {
        text: "Mensagem com text",
        userId: 1,
        itemId: 1,
      };

      const savedMessage = {
        id: 1,
        text: messageData.text,
        userId: messageData.userId,
        itemId: messageData.itemId,
        timestamp: new Date(),
        user: { id: 1, name: "User", email: "user@example.com" },
        item: { id: 1, title: "Item", ownerId: 2 },
      };

      mockPrisma.message.create.mockResolvedValue(savedMessage);

      const { chatController } = await import("../../src/controllers/chatController.js");
      
      const result = await chatController.saveMessage(messageData);

      expect(mockPrisma.message.create).toHaveBeenCalledWith({
        data: {
          text: messageData.text,
          userId: messageData.userId,
          itemId: messageData.itemId,
        },
        include: expect.any(Object),
      });
      expect(result).toEqual(savedMessage);
    });
  });
});

