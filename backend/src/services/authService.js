import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";

export async function registerUser(name, email, password) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("E-mail já cadastrado.");

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
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
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Usuário não encontrado.");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) throw new Error("Senha incorreta.");

  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  // Retornar usuário sem a senha
  const { password: _, ...userWithoutPassword } = user;

  return { user: userWithoutPassword, token };
}

