import { describe, it, expect, beforeAll, afterAll, beforeEach } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Carregar variáveis de ambiente de teste
dotenv.config({ path: ".env.test" });

// Criar instância do Prisma para testes
let prisma;
let dbAvailable = false;

describe("Items Routes - Integration Tests", () => {
  let authToken;
  let testUser;
  let testItem;

  beforeAll(async () => {
    try {
      // Executar reset do banco antes da suíte de testes
      const { execSync } = await import("child_process");
      try {
        execSync("npm run test:reset", { stdio: "ignore" });
      } catch (resetError) {
        // Ignorar erros do reset (pode ser que o banco não exista ainda)
      }

      // Tentar usar SQLite se disponível, senão usar PostgreSQL
      const testDbUrl = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

      if (testDbUrl?.includes("sqlite") || testDbUrl?.includes("file:")) {
        prisma = new PrismaClient({
          datasources: {
            db: {
              url: testDbUrl,
            },
          },
        });
      } else {
        prisma = new PrismaClient({
          datasources: {
            db: {
              url: process.env.DATABASE_URL,
            },
          },
        });
      }

      await prisma.$connect();

      // Limpar dados de teste usando transaction
      await prisma.$transaction([
        prisma.message.deleteMany({}),
        prisma.item.deleteMany({}),
        prisma.user.deleteMany({}),
      ]);

      dbAvailable = true;
    } catch (error) {
      console.warn("⚠️  Banco de dados não disponível. Testes de integração serão pulados.");
      console.warn("   Certifique-se de que o PostgreSQL está rodando:");
      console.warn("   1. Inicie o Docker Desktop");
      console.warn("   2. Execute: docker compose up -d");
      console.warn(`   Erro: ${error.message}`);
      dbAvailable = false;
    }
  });

  afterAll(async () => {
    if (dbAvailable && prisma) {
      try {
        // Limpar dados após os testes
        await prisma.$transaction([
          prisma.message.deleteMany({}),
          prisma.item.deleteMany({}),
          prisma.user.deleteMany({}),
        ]);
        await prisma.$disconnect();
      } catch (error) {
        // Ignorar erros na limpeza
      }
    }
  });

  beforeEach(async () => {
    if (!dbAvailable) return;

    // Limpar dados antes de cada teste usando transaction
    await prisma.$transaction([
      prisma.message.deleteMany({}),
      prisma.item.deleteMany({}),
      prisma.user.deleteMany({}),
    ]);

    // Criar usuário de teste
    const hashedPassword = await bcrypt.hash("password123", 10);
    testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@example.com",
        password: hashedPassword,
      },
    });

    // Gerar token JWT
    authToken = jwt.sign(
      { id: testUser.id, email: testUser.email },
      process.env.JWT_SECRET || "test-secret-key-for-vitest-tests",
      { expiresIn: "1d" }
    );
  });

  describe("GET /api/items", () => {
    it.skipIf(!dbAvailable)("deve retornar lista de itens", async () => {
      // Criar itens de teste
      await prisma.item.createMany({
        data: [
          {
            title: "Item 1",
            description: "Descrição do item 1 com mais de 10 caracteres",
            price: 99.99,
            ownerId: testUser.id,
          },
          {
            title: "Item 2",
            description: "Descrição do item 2 com mais de 10 caracteres",
            price: 199.99,
            ownerId: testUser.id,
          },
        ],
      });

      const response = await request(app).get("/api/items").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(2);
      expect(response.body.data[0]).toHaveProperty("id");
      expect(response.body.data[0]).toHaveProperty("title");
      expect(response.body.data[0]).toHaveProperty("owner");
    });

    it.skipIf(!dbAvailable)("deve retornar array vazio quando não há itens", async () => {
      const response = await request(app).get("/api/items").expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBe(0);
    });
  });

  describe("GET /api/items/:id", () => {
    beforeEach(async () => {
      if (!dbAvailable) return;
      testItem = await prisma.item.create({
        data: {
          title: "Item Teste",
          description: "Descrição do item teste com mais de 10 caracteres",
          price: 99.99,
          ownerId: testUser.id,
        },
      });
    });

    it.skipIf(!dbAvailable)("deve retornar um item específico pelo ID", async () => {
      const response = await request(app).get(`/api/items/${testItem.id}`).expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id", testItem.id);
      expect(response.body.data).toHaveProperty("title", "Item Teste");
      expect(response.body.data).toHaveProperty("owner");
    });

    it.skipIf(!dbAvailable)("deve retornar 404 quando item não existe", async () => {
      const response = await request(app).get("/api/items/99999").expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Item não encontrado");
    });
  });

  describe("POST /api/items", () => {
    it.skipIf(!dbAvailable)("deve criar um item com autenticação", async () => {
      const itemData = {
        title: "Novo Item",
        description: "Descrição do novo item com mais de 10 caracteres",
        price: 149.99,
        imageUrl: "https://example.com/image.jpg",
      };

      const response = await request(app)
        .post("/api/items")
        .set("Authorization", `Bearer ${authToken}`)
        .send(itemData)
        .expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data).toHaveProperty("title", itemData.title);
      expect(response.body.data).toHaveProperty("ownerId", testUser.id);
      expect(response.body.data).toHaveProperty("owner");
    });

    it.skipIf(!dbAvailable)("deve retornar 401 sem token de autenticação", async () => {
      const itemData = {
        title: "Novo Item",
        description: "Descrição do novo item com mais de 10 caracteres",
        price: 149.99,
      };

      const response = await request(app).post("/api/items").send(itemData).expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Token não fornecido");
    });

    it.skipIf(!dbAvailable)("deve retornar 403 com token inválido", async () => {
      const itemData = {
        title: "Novo Item",
        description: "Descrição do novo item com mais de 10 caracteres",
        price: 149.99,
      };

      const response = await request(app)
        .post("/api/items")
        .set("Authorization", "Bearer invalid-token")
        .send(itemData)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Token inválido ou expirado");
    });
  });

  describe("PUT /api/items/:id", () => {
    beforeEach(async () => {
      if (!dbAvailable) return;
      testItem = await prisma.item.create({
        data: {
          title: "Item Original",
          description: "Descrição original do item com mais de 10 caracteres",
          price: 99.99,
          ownerId: testUser.id,
        },
      });
    });

    it.skipIf(!dbAvailable)("deve atualizar um item quando for o dono", async () => {
      const updateData = {
        title: "Item Atualizado",
        price: 149.99,
      };

      const response = await request(app)
        .put(`/api/items/${testItem.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("title", updateData.title);
      expect(response.body.data).toHaveProperty("price", updateData.price);
    });

    it.skipIf(!dbAvailable)("deve retornar 401 sem token", async () => {
      const response = await request(app)
        .put(`/api/items/${testItem.id}`)
        .send({ title: "Novo" })
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    it.skipIf(!dbAvailable)("deve retornar 404 quando item não existe", async () => {
      const response = await request(app)
        .put("/api/items/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .send({ title: "Novo" })
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Item não encontrado");
    });

    it.skipIf(!dbAvailable)("deve retornar 403 quando usuário não é o dono", async () => {
      // Criar outro usuário
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: "other@example.com",
          password: await bcrypt.hash("password123", 10),
        },
      });

      const otherToken = jwt.sign(
        { id: otherUser.id, email: otherUser.email },
        process.env.JWT_SECRET || "test-secret-key-for-vitest-tests",
        { expiresIn: "1d" }
      );

      const response = await request(app)
        .put(`/api/items/${testItem.id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .send({ title: "Novo" })
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Acesso negado. Você não é o dono deste item.");
    });
  });

  describe("DELETE /api/items/:id", () => {
    beforeEach(async () => {
      if (!dbAvailable) return;
      testItem = await prisma.item.create({
        data: {
          title: "Item para Deletar",
          description: "Descrição do item para deletar com mais de 10 caracteres",
          price: 99.99,
          ownerId: testUser.id,
        },
      });
    });

    it.skipIf(!dbAvailable)("deve deletar um item quando for o dono", async () => {
      const response = await request(app)
        .delete(`/api/items/${testItem.id}`)
        .set("Authorization", `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Item excluído com sucesso!");

      // Verificar se o item foi deletado
      const itemInDb = await prisma.item.findUnique({
        where: { id: testItem.id },
      });
      expect(itemInDb).toBeNull();
    });

    it.skipIf(!dbAvailable)("deve retornar 401 sem token", async () => {
      const response = await request(app).delete(`/api/items/${testItem.id}`).expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });

    it.skipIf(!dbAvailable)("deve retornar 404 quando item não existe", async () => {
      const response = await request(app)
        .delete("/api/items/99999")
        .set("Authorization", `Bearer ${authToken}`)
        .expect(404);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Item não encontrado");
    });

    it.skipIf(!dbAvailable)("deve retornar 403 quando usuário não é o dono", async () => {
      // Criar outro usuário
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: "other2@example.com",
          password: await bcrypt.hash("password123", 10),
        },
      });

      const otherToken = jwt.sign(
        { id: otherUser.id, email: otherUser.email },
        process.env.JWT_SECRET || "test-secret-key-for-vitest-tests",
        { expiresIn: "1d" }
      );

      const response = await request(app)
        .delete(`/api/items/${testItem.id}`)
        .set("Authorization", `Bearer ${otherToken}`)
        .expect(403);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "Acesso negado. Você não é o dono deste item.");
    });
  });
});

