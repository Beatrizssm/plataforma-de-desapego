import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    console.log("✅ Conexão com o banco de dados PostgreSQL bem-sucedida!");
    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Erro ao conectar com o banco de dados:", error.message);
    process.exit(1);
  }
}

testConnection();