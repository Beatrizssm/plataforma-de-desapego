import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import { validateEmail, validatePassword, validateName } from "../utils/validators.js";
import { AppError } from "../middlewares/errorHandler.js";
import logger from "../logger/logger.js";

export async function registerUser(name, email, password) {
  // Validações
  try {
    validateName(name);
    validateEmail(email);
    validatePassword(password);
  } catch (error) {
    throw new AppError(error.message, 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  logger.debug({
    message: "Tentativa de registro",
    email: normalizedEmail,
    name,
  });

  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
    logger.warn({
      message: "Tentativa de registro com email já cadastrado",
      email: normalizedEmail,
    });
    throw new AppError("E-mail já cadastrado.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name: name.trim(), email: normalizedEmail, password: hashedPassword },
    select: {
      id: true,
      name: true,
      email: true,
      profile: true,
      createdAt: true,
    },
  });

  logger.info({
    message: "Usuário registrado com sucesso",
    userId: user.id,
    email: user.email,
  });

  return user;
}

export async function loginUser(email, password) {
  // Validações básicas
  if (!email || !password) {
    logger.warn({
      message: "Tentativa de login sem credenciais",
      email: email || "não fornecido",
    });
    throw new AppError("E-mail e senha são obrigatórios.", 400);
  }

  const normalizedEmail = email.toLowerCase().trim();
  
  logger.debug({
    message: "Tentativa de login",
    email: normalizedEmail,
  });

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (!user) {
    logger.warn({
      message: "Tentativa de login com email não encontrado",
      email: normalizedEmail,
    });
    throw new AppError("E-mail ou senha incorretos.", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    logger.warn({
      message: "Tentativa de login com senha incorreta",
      email: normalizedEmail,
      userId: user.id,
    });
    throw new AppError("E-mail ou senha incorretos.", 401);
  }

  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT_SECRET não configurado no ambiente.", 500);
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "1d" }
  );

  // Retornar usuário sem a senha
  const { password: _, ...userWithoutPassword } = user;

  logger.info({
    message: "Login realizado com sucesso",
    userId: user.id,
    email: user.email,
  });

  return { user: userWithoutPassword, token };
}

export async function changePassword(userId, currentPassword, newPassword) {
  // Validações
  if (!currentPassword || !newPassword) {
    throw new AppError("Senha atual e nova senha são obrigatórias.", 400);
  }

  validatePassword(newPassword);

  logger.debug({
    message: "Tentativa de alteração de senha",
    userId,
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    logger.warn({
      message: "Tentativa de alteração de senha para usuário não encontrado",
      userId,
    });
    throw new AppError("Usuário não encontrado.", 404);
  }

  // Verificar senha atual
  const validPassword = await bcrypt.compare(currentPassword, user.password);
  if (!validPassword) {
    logger.warn({
      message: "Tentativa de alteração de senha com senha atual incorreta",
      userId,
    });
    throw new AppError("Senha atual incorreta.", 401);
  }

  // Hash da nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Atualizar senha
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  logger.info({
    message: "Senha alterada com sucesso",
    userId,
  });

  return { message: "Senha alterada com sucesso" };
}

