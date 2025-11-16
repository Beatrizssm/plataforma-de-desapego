import prisma from "../prisma/client.js";
import { validateItemData, validateId } from "../utils/validators.js";
import { AppError } from "../middlewares/errorHandler.js";

export async function createItem(data, userId) {
  validateId(userId);
  validateItemData(data);

  return await prisma.item.create({
    data: {
      title: data.title.trim(),
      description: data.description.trim(),
      price: Number(data.price),
      available: data.available !== undefined ? Boolean(data.available) : true,
      imageUrl: data.imageUrl ? data.imageUrl.trim() : null,
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
}

export async function getAllItems() {
  return await prisma.item.findMany({
    include: { owner: { select: { id: true, name: true, email: true } } },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getItemById(id) {
  const itemId = validateId(id);
  return await prisma.item.findUnique({
    where: { id: itemId },
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
}

export async function updateItem(id, data, userId) {
  const itemId = validateId(id);
  validateId(userId);

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) throw new AppError("Item não encontrado", 404);
  if (item.ownerId !== userId) throw new AppError("Acesso negado. Você não é o dono deste item.", 403);

  // Validar dados se fornecidos
  if (data.title !== undefined && data.title.trim().length < 3) {
    throw new AppError("Título deve ter no mínimo 3 caracteres", 400);
  }
  if (data.description !== undefined && data.description.trim().length < 10) {
    throw new AppError("Descrição deve ter no mínimo 10 caracteres", 400);
  }
  if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
    throw new AppError("Preço deve ser um número positivo", 400);
  }

  const updateData = {};
  if (data.title !== undefined) updateData.title = data.title.trim();
  if (data.description !== undefined) updateData.description = data.description.trim();
  if (data.price !== undefined) updateData.price = Number(data.price);
  if (data.available !== undefined) updateData.available = Boolean(data.available);
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl ? data.imageUrl.trim() : null;

  return await prisma.item.update({
    where: { id: itemId },
    data: updateData,
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
}

export async function deleteItem(id, userId) {
  const itemId = validateId(id);
  validateId(userId);

  const item = await prisma.item.findUnique({ where: { id: itemId } });
  if (!item) throw new AppError("Item não encontrado", 404);
  if (item.ownerId !== userId) throw new AppError("Acesso negado. Você não é o dono deste item.", 403);

  await prisma.item.delete({ where: { id: itemId } });
  return { message: "Item excluído com sucesso!" };
}
