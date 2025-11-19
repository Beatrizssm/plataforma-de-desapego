# Testes de Integração

## ⚠️ Importante

Os testes de integração **requerem que o banco de dados PostgreSQL esteja rodando**.

## 🚀 Como executar os testes de integração

1. **Certifique-se de que o Docker está rodando:**
   ```bash
   docker compose up -d
   ```

2. **Verifique se o banco está acessível:**
   - O PostgreSQL deve estar rodando na porta `5432`
   - As credenciais devem estar configuradas no `.env` ou `.env.test`

3. **Execute os testes:**
   ```bash
   npm test
   ```

## 📝 Nota

Se você não quiser executar os testes de integração (que requerem o banco), você pode:

1. Executar apenas os testes unitários:
   ```bash
   npm test -- tests/unit
   ```

2. Ou comentar temporariamente os testes de integração

## 🔧 Configuração

Os testes de integração usam o mesmo banco de dados configurado em `.env.test` ou `.env`.

Certifique-se de que:
- `DATABASE_URL` está configurado corretamente
- O banco de dados existe
- As migrations foram executadas (`npx prisma migrate dev`)

