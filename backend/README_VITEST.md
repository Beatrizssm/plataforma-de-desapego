# 🚀 Vitest - Guia Completo de Uso

## ✅ Migração Completa: Jest → Vitest

O projeto foi **100% migrado** do Jest para Vitest com sucesso!

---

## 📦 Instalação

Todas as dependências já estão instaladas. Se precisar reinstalar:

```bash
npm install
```

**Dependências instaladas:**
- ✅ `vitest` - Framework de testes
- ✅ `@vitest/coverage-v8` - Cobertura de código
- ✅ `@types/supertest` - Tipos para Supertest
- ✅ `ts-node` - Suporte a TypeScript
- ✅ `supertest` - Testes de API
- ✅ `cross-env` - Variáveis de ambiente

---

## 🧪 Como Rodar os Testes

### 1. Preparar Ambiente (Opcional)

```bash
# Preparar banco SQLite para testes
npm run test:prepare
```

**Nota:** Se usar MySQL, não é necessário preparar o SQLite.

### 2. Executar Testes

```bash
# Todos os testes (modo watch)
npm test

# Todos os testes (execução única)
npm test -- --run

# Apenas testes unitários (23 testes - sempre funcionam)
npm run test:unit

# Apenas testes de integração (22 testes - precisam de banco)
npm run test:integration

# Modo watch (re-executa automaticamente)
npm run test:watch

# Com cobertura de código
npm run test:coverage
```

### 3. Resetar Banco de Testes (Se Necessário)

```bash
npm run test:reset
```

---

## 📊 Resultado dos Testes

### ✅ Testes Unitários

**Status:** ✅ **23 TESTES PASSANDO**

```bash
npm run test:unit
```

**Resultado esperado:**
```
✓ tests/unit/authService.test.js (10 tests)
✓ tests/unit/itemService.test.js (13 tests)

Test Files  2 passed
     Tests  23 passed
```

**Características:**
- ✅ Não precisam de banco de dados
- ✅ Usam mocks (rápidos)
- ✅ Testam lógica isolada

### ⚠️ Testes de Integração

**Status:** ⚠️ **PULADOS SE BANCO NÃO DISPONÍVEL**

```bash
npm run test:integration
```

**Com banco disponível:**
```
✓ tests/integration/auth.routes.test.js (7 tests)
✓ tests/integration/items.routes.test.js (15 tests)

Test Files  2 passed
     Tests  22 passed
```

**Sem banco disponível:**
```
⊘ tests/integration/auth.routes.test.js (7 tests | 7 skipped)
⊘ tests/integration/items.routes.test.js (15 tests | 15 skipped)

Test Files  2 skipped
     Tests  22 skipped
```

**Para executar:**
1. Inicie o Docker: `docker compose up -d`
2. Execute: `npm run test:integration`

---

## 📁 Estrutura dos Testes

```
tests/
├── setup.js                    # Setup global
├── mocks/                      # Mocks para testes unitários
│   ├── prismaMock.js          # Mock do Prisma Client
│   ├── bcryptMock.js          # Mock do bcrypt
│   └── jwtMock.js             # Mock do JWT
├── unit/                       # Testes unitários (23 testes)
│   ├── authService.test.js    # 10 testes
│   └── itemService.test.js    # 13 testes
└── integration/                # Testes de integração (22 testes)
    ├── auth.routes.test.js     # 7 testes
    └── items.routes.test.js    # 15 testes
```

---

## 🎯 Cobertura de Testes

### Testes Unitários (23 testes)

**authService.test.js:**
- ✅ Registro de usuário com sucesso
- ✅ Hash de senha (bcrypt)
- ✅ Validação de email
- ✅ Validação de nome
- ✅ Validação de senha
- ✅ Login com JWT
- ✅ Comparação de senha
- ✅ Tratamento de erros

**itemService.test.js:**
- ✅ Criação de item
- ✅ Listagem de itens
- ✅ Busca por ID
- ✅ Atualização de item
- ✅ Deleção de item
- ✅ Validação de campos
- ✅ Verificação de propriedade

### Testes de Integração (22 testes)

**auth.routes.test.js:**
- ✅ POST /api/auth/register
- ✅ POST /api/auth/login
- ✅ Validação de token JWT
- ✅ Erros de validação
- ✅ Campos obrigatórios

**items.routes.test.js:**
- ✅ GET /api/items
- ✅ GET /api/items/:id
- ✅ POST /api/items (com autenticação)
- ✅ PUT /api/items/:id
- ✅ DELETE /api/items/:id
- ✅ Permissões (apenas dono)
- ✅ Validação de token

---

## ⚙️ Configuração

### vitest.config.ts

```typescript
export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: ["tests/**/*.test.js", "tests/**/*.test.ts"],
    setupFiles: ["./tests/setup.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
    },
  },
});
```

### .env.test

```env
TEST_DATABASE_URL="file:./test.db?connection_limit=1"
DATABASE_URL="mysql://bia:bia123@localhost:3306/desapego_db_test"
JWT_SECRET=test-secret-key-for-vitest-tests
JWT_EXPIRES_IN=1d
NODE_ENV=test
```

---

## 🔧 Scripts Disponíveis

```json
{
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest run --coverage",
  "test:unit": "vitest run tests/unit",
  "test:integration": "vitest run tests/integration",
  "test:prepare": "cross-env NODE_ENV=test prisma migrate deploy --schema prisma/schema.test.prisma",
  "test:reset": "cross-env NODE_ENV=test prisma migrate reset --force --schema prisma/schema.test.prisma"
}
```

---

## 💡 Dicas

1. **Testes unitários são rápidos** - Use `npm run test:unit` para feedback rápido
2. **Testes de integração precisam de banco** - Use quando quiser testar tudo end-to-end
3. **Modo watch é útil** - `npm run test:watch` re-executa automaticamente
4. **Cobertura mostra o que falta** - `npm run test:coverage` gera relatório HTML em `coverage/`

---

## ✅ Checklist de Verificação

- [ ] Executei `npm test` - Testes rodaram?
- [ ] Executei `npm run test:unit` - 23 testes passaram?
- [ ] Executei `npm run test:integration` - Testes pulados ou passaram?
- [ ] Verifiquei que não há erros de ESM
- [ ] Verifiquei que não há erros do Prisma

---

## 🎉 Resultado Final

**✅ Migração 100% completa!**

- ✅ Jest removido completamente
- ✅ Vitest instalado e configurado
- ✅ 23 testes unitários funcionando
- ✅ 22 testes de integração implementados
- ✅ Total: 45 testes
- ✅ Sem erros de ESM
- ✅ Sem erros do Prisma
- ✅ Mocks funcionando perfeitamente

---

**🚀 Tudo pronto para usar!**

