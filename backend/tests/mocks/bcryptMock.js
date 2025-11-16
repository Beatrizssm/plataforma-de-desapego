/**
 * Mock do bcrypt para testes unitários
 */
import { vi } from "vitest";

export const createMockBcrypt = () => {
  const mockBcrypt = {
    hash: vi.fn(),
    compare: vi.fn(),
  };

  return mockBcrypt;
};

export default createMockBcrypt;

