import { Router } from "express";
import { chatController } from "../controllers/chatController.js";
import { authenticateToken } from "../middlewares/authMiddleware.js";

const router = Router();

// Rota para buscar histórico de chats do usuário logado
router.get("/me", authenticateToken, chatController.getUserChats);

// Rota para buscar mensagens de um item específico
router.get("/:itemId", chatController.getMessages);

export default router;

