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

describe("Auth Routes - Integration Tests", () => {
  let testUser;

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

      // Limpar dados de teste antes de começar usando transaction
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
  });

  describe("POST /api/auth/register", () => {
    it.skipIf(!dbAvailable)("deve registrar um novo usuário com sucesso", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const response = await request(app).post("/api/auth/register").send(userData).expect(201);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Usuário registrado com sucesso!");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data.user).toHaveProperty("id");
      expect(response.body.data.user).toHaveProperty("name", userData.name);
      expect(response.body.data.user).toHaveProperty("email", userData.email);
      expect(response.body.data.user).not.toHaveProperty("password");

      // Verificar se o usuário foi criado no banco
      const userInDb = await prisma.user.findUnique({
        where: { email: userData.email },
      });
      expect(userInDb).toBeTruthy();
      expect(userInDb.name).toBe(userData.name);
    });

    it.skipIf(!dbAvailable)("deve retornar erro 400 se o email já estiver cadastrado", async () => {
      const userData = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
      };

      // Criar usuário primeiro
      await request(app).post("/api/auth/register").send(userData).expect(201);

      // Tentar criar novamente
      const response = await request(app).post("/api/auth/register").send(userData).expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "E-mail já cadastrado.");
    });

    it.skipIf(!dbAvailable)("deve retornar erro 400 se faltar campos obrigatórios", async () => {
      const response = await request(app).post("/api/auth/register").send({}).expect(400);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      if (!dbAvailable) return;
      // Criar usuário de teste
      const hashedPassword = await bcrypt.hash("password123", 10);
      testUser = await prisma.user.create({
        data: {
          name: "Login Test User",
          email: "login@example.com",
          password: hashedPassword,
        },
      });
    });

    it.skipIf(!dbAvailable)("deve fazer login com sucesso e retornar token", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "password123",
        })
        .expect(200);

      expect(response.body).toHaveProperty("success", true);
      expect(response.body).toHaveProperty("message", "Login realizado com sucesso!");
      expect(response.body).toHaveProperty("data");
      expect(response.body.data).toHaveProperty("user");
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.user).not.toHaveProperty("password");
      expect(typeof response.body.data.token).toBe("string");
      expect(response.body.data.token.length).toBeGreaterThan(0);

      // Verificar se o token é válido
      const decoded = jwt.verify(
        response.body.data.token,
        process.env.JWT_SECRET || "test-secret-key-for-vitest-tests"
      );
      expect(decoded).toHaveProperty("id");
      expect(decoded).toHaveProperty("email");
    });

    it.skipIf(!dbAvailable)("deve retornar erro 401 se o email não existir", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "nonexistent@example.com",
          password: "password123",
        })
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "E-mail ou senha incorretos.");
    });

    it.skipIf(!dbAvailable)("deve retornar erro 401 se a senha estiver incorreta", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login@example.com",
          password: "wrongPassword",
        })
        .expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message", "E-mail ou senha incorretos.");
    });

    it.skipIf(!dbAvailable)("deve retornar erro 401 se faltar email ou senha", async () => {
      const response = await request(app).post("/api/auth/login").send({}).expect(401);

      expect(response.body).toHaveProperty("success", false);
      expect(response.body).toHaveProperty("message");
    });
  });
});

