import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockPrisma } from "../mocks/prismaMock.js";

// Criar mock
const mockPrisma = createMockPrisma();

// Mock do módulo antes de importar o service
vi.mock("../../src/prisma/client.js", () => ({
  default: mockPrisma,
}));

// Importar service após o mock
let createItem, getAllItems, getItemById, updateItem, deleteItem;

describe("itemService", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Re-importar services para garantir que os mocks estão ativos
    const itemService = await import("../../src/services/itemService.js");
    createItem = itemService.createItem;
    getAllItems = itemService.getAllItems;
    getItemById = itemService.getItemById;
    updateItem = itemService.updateItem;
    deleteItem = itemService.deleteItem;
  });

  describe("createItem", () => {
    it("deve criar um item com sucesso", async () => {
      const itemData = {
        title: "Item Teste",
        description: "Descrição do item teste com mais de 10 caracteres",
        price: 99.99,
        available: true,
        imageUrl: "https://example.com/image.jpg",
      };
      const userId = 1;

      const createdItem = {
        id: 1,
        ...itemData,
        ownerId: userId,
        owner: {
          id: userId,
          name: "Test User",
          email: "test@example.com",
        },
        createdAt: new Date(),
      };

      mockPrisma.item.create.mockResolvedValue(createdItem);

      const result = await createItem(itemData, userId);

      expect(mockPrisma.item.create).toHaveBeenCalledWith({
        data: {
          title: itemData.title.trim(),
          description: itemData.description.trim(),
          price: Number(itemData.price),
          available: itemData.available !== undefined ? Boolean(itemData.available) : true,
          imageUrl: itemData.imageUrl ? itemData.imageUrl.trim() : null,
          ownerId: userId,
        },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(createdItem);
    });

    it("deve lançar erro se título for muito curto", async () => {
      const itemData = {
        title: "AB",
        description: "Descrição válida com mais de 10 caracteres",
        price: 99.99,
      };

      await expect(createItem(itemData, 1)).rejects.toThrow();
    });

    it("deve lançar erro se descrição for muito curta", async () => {
      const itemData = {
        title: "Título válido",
        description: "Curta",
        price: 99.99,
      };

      await expect(createItem(itemData, 1)).rejects.toThrow();
    });

    it("deve lançar erro se preço for inválido", async () => {
      const itemData = {
        title: "Título válido",
        description: "Descrição válida com mais de 10 caracteres",
        price: -10,
      };

      await expect(createItem(itemData, 1)).rejects.toThrow();
    });
  });

  describe("getAllItems", () => {
    it("deve retornar lista de itens", async () => {
      const items = [
        {
          id: 1,
          title: "Item 1",
          description: "Descrição 1",
          price: 99.99,
          owner: { id: 1, name: "User 1", email: "user1@example.com" },
        },
        {
          id: 2,
          title: "Item 2",
          description: "Descrição 2",
          price: 199.99,
          owner: { id: 2, name: "User 2", email: "user2@example.com" },
        },
      ];

      mockPrisma.item.findMany.mockResolvedValue(items);

      const result = await getAllItems();

      expect(mockPrisma.item.findMany).toHaveBeenCalledWith({
        include: { owner: { select: { id: true, name: true, email: true } } },
        orderBy: {
          createdAt: "desc",
        },
      });
      expect(result).toEqual(items);
    });
  });

  describe("getItemById", () => {
    it("deve retornar um item pelo ID", async () => {
      const item = {
        id: 1,
        title: "Item Teste",
        description: "Descrição do item",
        price: 99.99,
        owner: { id: 1, name: "User", email: "user@example.com" },
      };

      mockPrisma.item.findUnique.mockResolvedValue(item);

      const result = await getItemById(1);

      expect(mockPrisma.item.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          owner: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
      expect(result).toEqual(item);
    });

    it("deve lançar erro para ID inválido", async () => {
      await expect(getItemById("invalid")).rejects.toThrow("ID inválido");
    });
  });

  describe("updateItem", () => {
    it("deve atualizar um item quando for o dono", async () => {
      const existingItem = {
        id: 1,
        title: "Item Original",
        description: "Descrição original",
        price: 99.99,
        ownerId: 1,
      };

      const updateData = {
        title: "Item Atualizado",
        price: 149.99,
      };

      const updatedItem = {
        ...existingItem,
        ...updateData,
        owner: { id: 1, name: "User", email: "user@example.com" },
      };

      mockPrisma.item.findUnique.mockResolvedValue(existingItem);
      mockPrisma.item.update.mockResolvedValue(updatedItem);

      const result = await updateItem(1, updateData, 1);

      expect(mockPrisma.item.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPrisma.item.update).toHaveBeenCalled();
      expect(result).toEqual(updatedItem);
    });

    it("deve lançar erro se item não existir", async () => {
      mockPrisma.item.findUnique.mockResolvedValue(null);

      await expect(updateItem(999, { title: "Novo" }, 1)).rejects.toThrow(
        "Item não encontrado"
      );
    });

    it("deve lançar erro se usuário não for o dono", async () => {
      const existingItem = {
        id: 1,
        title: "Item",
        description: "Descrição",
        price: 99.99,
        ownerId: 1,
      };

      mockPrisma.item.findUnique.mockResolvedValue(existingItem);

      await expect(updateItem(1, { title: "Novo" }, 2)).rejects.toThrow("Acesso negado");
    });
  });

  describe("deleteItem", () => {
    it("deve deletar um item quando for o dono", async () => {
      const existingItem = {
        id: 1,
        title: "Item",
        description: "Descrição",
        price: 99.99,
        ownerId: 1,
      };

      mockPrisma.item.findUnique.mockResolvedValue(existingItem);
      mockPrisma.item.delete.mockResolvedValue(existingItem);

      const result = await deleteItem(1, 1);

      expect(mockPrisma.item.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockPrisma.item.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toHaveProperty("message", "Item excluído com sucesso!");
    });

    it("deve lançar erro se item não existir", async () => {
      mockPrisma.item.findUnique.mockResolvedValue(null);

      await expect(deleteItem(999, 1)).rejects.toThrow("Item não encontrado");
    });

    it("deve lançar erro se usuário não for o dono", async () => {
      const existingItem = {
        id: 1,
        title: "Item",
        description: "Descrição",
        price: 99.99,
        ownerId: 1,
      };

      mockPrisma.item.findUnique.mockResolvedValue(existingItem);

      await expect(deleteItem(1, 2)).rejects.toThrow("Acesso negado");
    });
  });
});
