import http from "http";
import app from "./app.js";
import { setupChat } from "./chat/chatServer.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

// Configurar Socket.IO para chat em tempo real
setupChat(server);

server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`💬 Socket.IO configurado e pronto para conexões`);
});

