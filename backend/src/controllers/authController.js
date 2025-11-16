import { registerUser, loginUser } from "../services/authService.js";
import logger from "../logger/logger.js";
import { successResponse, createdResponse, errorResponse, unauthorizedResponse } from "../utils/responseHelper.js";
import { asyncHandler } from "../middlewares/errorHandler.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return errorResponse(res, "Nome, e-mail e senha são obrigatórios", 400);
  }

  const user = await registerUser(name, email, password);
  logger.info(`Novo usuário registrado: ${user.email}`);
  return createdResponse(res, "Usuário registrado com sucesso!", { user });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return unauthorizedResponse(res, "E-mail e senha são obrigatórios");
  }

  const { user, token } = await loginUser(email, password);
  logger.info(`Login realizado: ${user.email}`);
  return successResponse(res, "Login realizado com sucesso!", { user, token });
});

