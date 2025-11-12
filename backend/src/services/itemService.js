import prisma from "../prisma/client.js";

export async function createItem(data, userId) {
  return await prisma.item.create({
    data: {
      ...data,
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
  return await prisma.item.findUnique({
    where: { id: Number(id) },
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
  const item = await prisma.item.findUnique({ where: { id: Number(id) } });
  if (!item) throw new Error("Item não encontrado");
  if (item.ownerId !== userId) throw new Error("Acesso negado");

  return await prisma.item.update({
    where: { id: Number(id) },
    data,
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
  const item = await prisma.item.findUnique({ where: { id: Number(id) } });
  if (!item) throw new Error("Item não encontrado");
  if (item.ownerId !== userId) throw new Error("Acesso negado");

  await prisma.item.delete({ where: { id: Number(id) } });
  return { message: "Item excluído com sucesso!" };
}
