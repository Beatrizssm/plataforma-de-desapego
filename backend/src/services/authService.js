import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import { validateEmail, validatePassword, validateName } from "../utils/validators.js";
import { AppError } from "../middlewares/errorHandler.js";

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
  const existingUser = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existingUser) {
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

  return user;
}

export async function loginUser(email, password) {
  // Validações básicas
  if (!email || !password) {
    throw new AppError("E-mail e senha são obrigatórios.", 400);
  }

  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) {
    throw new AppError("E-mail ou senha incorretos.", 401);
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
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

  return { user: userWithoutPassword, token };
}

