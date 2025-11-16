import { describe, it, expect, beforeEach, vi } from "vitest";
import { createMockPrisma } from "../mocks/prismaMock.js";
import { createMockBcrypt } from "../mocks/bcryptMock.js";
import { createMockJwt } from "../mocks/jwtMock.js";

// Criar mocks
const mockPrisma = createMockPrisma();
const mockBcrypt = createMockBcrypt();
const mockJwt = createMockJwt();

// Mock dos módulos antes de importar os services
vi.mock("../../src/prisma/client.js", () => ({
  default: mockPrisma,
}));

vi.mock("bcrypt", () => ({
  default: mockBcrypt,
}));

vi.mock("jsonwebtoken", () => ({
  default: mockJwt,
}));

// Importar services após os mocks
let registerUser, loginUser;

describe("authService", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    // Re-importar services para garantir que os mocks estão ativos
    const authService = await import("../../src/services/authService.js");
    registerUser = authService.registerUser;
    loginUser = authService.loginUser;
  });

  describe("registerUser", () => {
    it("deve registrar um novo usuário com sucesso", async () => {
      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      const hashedPassword = "hashedPassword123";
      const createdUser = {
        id: 1,
        name: userData.name,
        email: userData.email,
        profile: "user",
        createdAt: new Date(),
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockBcrypt.hash.mockResolvedValue(hashedPassword);
      mockPrisma.user.create.mockResolvedValue(createdUser);

      const result = await registerUser(userData.name, userData.email, userData.password);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email.toLowerCase().trim() },
      });
      expect(mockBcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          name: userData.name.trim(),
          email: userData.email.toLowerCase().trim(),
          password: hashedPassword,
        },
        select: {
          id: true,
          name: true,
          email: true,
          profile: true,
          createdAt: true,
        },
      });
      expect(result).toEqual(createdUser);
    });

    it("deve lançar um erro se o e-mail já estiver cadastrado", async () => {
      const userData = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
      };

      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: userData.email });

      await expect(
        registerUser(userData.name, userData.email, userData.password)
      ).rejects.toThrow("E-mail já cadastrado.");

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email.toLowerCase().trim() },
      });
      expect(mockPrisma.user.create).not.toHaveBeenCalled();
    });

    it("deve lançar um erro para nome inválido", async () => {
      await expect(registerUser("a", "test@example.com", "password123")).rejects.toThrow(
        "Nome deve ter no mínimo 2 caracteres"
      );
    });

    it("deve lançar um erro para e-mail inválido", async () => {
      await expect(registerUser("Test User", "invalid-email", "password123")).rejects.toThrow(
        "E-mail inválido"
      );
    });

    it("deve lançar um erro para senha muito curta", async () => {
      await expect(registerUser("Test User", "test@example.com", "123")).rejects.toThrow(
        "Senha deve ter no mínimo 6 caracteres"
      );
    });
  });

  describe("loginUser", () => {
    it("deve fazer login com sucesso e retornar o usuário e o token", async () => {
      const userData = {
        id: 1,
        name: "Test User",
        email: "login@example.com",
        password: "hashedPassword123",
        profile: "user",
      };
      const plainPassword = "password123";
      const token = "mockedJwtToken";

      mockPrisma.user.findUnique.mockResolvedValue(userData);
      mockBcrypt.compare.mockResolvedValue(true);
      mockJwt.sign.mockReturnValue(token);
      process.env.JWT_SECRET = "test-secret";
      process.env.JWT_EXPIRES_IN = "1h";

      const result = await loginUser(userData.email, plainPassword);

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: userData.email.toLowerCase().trim() },
      });
      expect(mockBcrypt.compare).toHaveBeenCalledWith(plainPassword, userData.password);
      expect(mockJwt.sign).toHaveBeenCalledWith(
        { id: userData.id, email: userData.email },
        "test-secret",
        { expiresIn: "1h" }
      );
      expect(result).toHaveProperty("user");
      expect(result).toHaveProperty("token", token);
      expect(result.user).not.toHaveProperty("password");
    });

    it("deve lançar um erro se o usuário não for encontrado", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(loginUser("nonexistent@example.com", "password123")).rejects.toThrow(
        "E-mail ou senha incorretos."
      );
      expect(mockBcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it("deve lançar um erro se a senha estiver incorreta", async () => {
      const userData = {
        id: 1,
        name: "Test User",
        email: "login@example.com",
        password: "hashedPassword123",
      };

      mockPrisma.user.findUnique.mockResolvedValue(userData);
      mockBcrypt.compare.mockResolvedValue(false);

      await expect(loginUser(userData.email, "wrongpassword")).rejects.toThrow(
        "E-mail ou senha incorretos."
      );
      expect(mockJwt.sign).not.toHaveBeenCalled();
    });

    it("deve lançar um erro se o email ou senha estiverem faltando", async () => {
      await expect(loginUser("login@example.com", "")).rejects.toThrow(
        "E-mail e senha são obrigatórios."
      );
      await expect(loginUser("", "password123")).rejects.toThrow(
        "E-mail e senha são obrigatórios."
      );
    });

    it("deve lançar um erro se JWT_SECRET não estiver configurado", async () => {
      const userData = {
        id: 1,
        name: "Test User",
        email: "login@example.com",
        password: "hashedPassword123",
      };
      mockPrisma.user.findUnique.mockResolvedValue(userData);
      mockBcrypt.compare.mockResolvedValue(true);
      delete process.env.JWT_SECRET;

      await expect(loginUser(userData.email, "password123")).rejects.toThrow(
        "JWT_SECRET não configurado no ambiente."
      );
    });
  });
});
