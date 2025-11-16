// Configuração global para os testes com Vitest
import dotenv from "dotenv";

// Carregar variáveis de ambiente de teste
dotenv.config({ path: ".env.test" });

// Garantir que JWT_SECRET está definido
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = "test-secret-key-for-vitest-tests";
}

if (!process.env.JWT_EXPIRES_IN) {
  process.env.JWT_EXPIRES_IN = "1d";
}
