import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

let prisma;
let dbAvailable = false;
let testUser;
let testItem;
let authToken;

describe("Chat Routes - Integration Tests", () => {
  beforeAll(async () => {
    try {
      prisma = new PrismaClient();
      await prisma.$connect();
      dbAvailable = true;

      // Criar usuário de teste
      const hashedPassword = await bcrypt.hash("password123", 10);
      testUser = await prisma.user.create({
        data: {
          name: "Test Chat User",
          email: "chattest@example.com",
          password: hashedPassword,
          profile: "user",
        },
      });

      // Criar item de teste
      testItem = await prisma.item.create({
        data: {
          title: "Item para Chat",
          description: "Item de teste para chat",
          price: 100.00,
          ownerId: testUser.id,
        },
      });

      // Gerar token JWT
      authToken = jwt.sign(
        { id: testUser.id, email: testUser.email },
        process.env.JWT_SECRET || "test-secret",
        { expiresIn: "1h" }
      );
    } catch (error) {
      console.warn("⚠️  Banco de dados não disponível para testes de integração");
      console.warn("   Certifique-se de que o PostgreSQL está rodando:");
      console.warn("   - Verifique a variável DATABASE_URL no .env");
      dbAvailable = false;
    }
  });

  afterAll(async () => {
    if (dbAvailable && prisma) {
      // Limpar dados de teste
      await prisma.message.deleteMany({
        where: {
          OR: [
            { itemId: testItem?.id },
            { userId: testUser?.id },
          ],
        },
      });
      if (testItem) {
        await prisma.item.delete({ where: { id: testItem.id } });
      }
      if (testUser) {
        await prisma.user.delete({ where: { id: testUser.id } });
      }
      await prisma.$disconnect();
    }
  });

  beforeEach(async () => {
    if (dbAvailable && prisma) {
      // Limpar mensagens antes de cada teste
      await prisma.message.deleteMany({
        where: { itemId: testItem.id },
      });
    }
  });

  describe("GET /api/chat/:itemId", () => {
    it.skipIf(!dbAvailable)("deve retornar mensagens de um item", async () => {
      // Criar mensagem de teste
      await prisma.message.create({
        data: {
          text: "Mensagem de teste",
          userId: testUser.id,
          itemId: testItem.id,
        },
      });

      const response = await request(app)
        .get(`/api/chat/${testItem.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty("text");
      expect(response.body.data[0]).toHaveProperty("user");
    });

    it.skipIf(!dbAvailable)("deve retornar array vazio quando não há mensagens", async () => {
      const response = await request(app)
        .get(`/api/chat/${testItem.id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });

    it.skipIf(!dbAvailable)("deve retornar 200 mesmo com itemId inválido", async () => {
      const response = await request(app)
        .get("/api/chat/99999")
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual([]);
    });
  });

  describe("GET /api/chat/me", () => {
    it.skipIf(!dbAvailable)("deve retornar chats do usuário autenticado", async () => {
      // Criar mensagem
      await prisma.message.create({
        data: {
          text: "Mensagem de teste",
          userId: testUser.id,
          itemId: testItem.id,
        },
      });

      const response = await request(app)
        .get("/api/chat/me")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeInstanceOf(Array);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty("id");
      expect(response.body.data[0]).toHaveProperty("title");
      expect(response.body.data[0]).toHaveProperty("isOwner");
    });

    it.skipIf(!dbAvailable)("deve retornar 401 sem token", async () => {
      await request(app)
        .get("/api/chat/me")
        .expect(401);
    });

    it.skipIf(!dbAvailable)("deve retornar 403 com token inválido", async () => {
      await request(app)
        .get("/api/chat/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(403);
    });
  });
});

