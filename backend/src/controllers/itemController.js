import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../services/itemService.js";
import logger from "../logger/logger.js";
import { successResponse, createdResponse, errorResponse, notFoundResponse } from "../utils/responseHelper.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const create = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const item = await createItem(req.body, userId);
  logger.info(`Item criado: ${item.id} por usuário ${userId}`);
  return createdResponse(res, "Item criado com sucesso!", item);
});

export const getAll = asyncHandler(async (req, res) => {
  const items = await getAllItems();
  return successResponse(res, "Itens listados com sucesso!", items);
});

export const getById = asyncHandler(async (req, res) => {
  const item = await getItemById(req.params.id);
  if (!item) {
    return notFoundResponse(res, "Item não encontrado");
  }
  return successResponse(res, "Item encontrado!", item);
});

export const update = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const item = await updateItem(req.params.id, req.body, userId);
  logger.info(`Item atualizado: ${item.id} por usuário ${userId}`);
  return successResponse(res, "Item atualizado com sucesso!", item);
});

export const remove = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const result = await deleteItem(req.params.id, userId);
  logger.info(`Item deletado: ${req.params.id} por usuário ${userId}`);
  return successResponse(res, result.message || "Item excluído com sucesso!");
});
