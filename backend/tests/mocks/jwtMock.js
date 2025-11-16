/**
 * Mock do jsonwebtoken para testes unitários
 */
import { vi } from "vitest";

export const createMockJwt = () => {
  const mockJwt = {
    sign: vi.fn(),
    verify: vi.fn(),
  };

  return mockJwt;
};

export default createMockJwt;

