# Backend - Plataforma de Desapego

API REST desenvolvida com Node.js, Express, Prisma e PostgreSQL.

## 🚀 Tecnologias

- **Node.js** + **Express** - Framework web
- **Prisma ORM** - ORM para PostgreSQL
- **PostgreSQL** - Banco de dados (Docker)
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas

## 📁 Estrutura

```
backend/
├── src/
│   ├── routes/          # Rotas da API
│   ├── controllers/     # Controladores
│   ├── services/        # Lógica de negócio
│   ├── middlewares/     # Middlewares (auth)
│   ├── prisma/          # Cliente Prisma
│   ├── app.js           # Configuração Express
│   └── server.js        # Servidor
├── prisma/
│   └── schema.prisma    # Schema do banco
└── package.json
```

## 🔧 Instalação

```bash
npm install
```

## ⚙️ Configuração

1. Configure o arquivo `.env`:
```env
DATABASE_URL="postgresql://bia:bia123@localhost:5432/desapego_db"
PORT=4000
JWT_SECRET=seusegredoaqui123
JWT_EXPIRES_IN=1d
```

2. Inicie o Docker:
```bash
docker-compose up -d
```

3. Execute as migrations:
```bash
npx prisma migrate dev
```

4. Gere o Prisma Client:
```bash
npx prisma generate
```

## 🏃 Executar

```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

## 📡 Rotas da API

### Autenticação
- `POST /api/auth/register` - Registrar usuário
- `POST /api/auth/login` - Login

### Usuários
- `GET /api/users` - Listar usuários

### Itens
- `GET /api/items` - Listar itens (público)
- `GET /api/items/:id` - Buscar item (público)
- `POST /api/items` - Criar item (protegido)
- `PUT /api/items/:id` - Atualizar item (protegido - apenas dono)
- `DELETE /api/items/:id` - Deletar item (protegido - apenas dono)

## 🔐 Autenticação

Rotas protegidas requerem o header:
```
Authorization: Bearer {token}
```

## 📝 Scripts

- `npm start` - Inicia servidor
- `npm run dev` - Desenvolvimento com nodemon
- `npm run prisma:generate` - Gera Prisma Client
- `npm run prisma:migrate` - Executa migrations
- `npm run prisma:studio` - Abre Prisma Studio

