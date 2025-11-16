import jwt from "jsonwebtoken";
import { errorResponse, unauthorizedResponse, forbiddenResponse } from "../utils/responseHelper.js";

export function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return unauthorizedResponse(res, "Token não fornecido");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return forbiddenResponse(res, "Token inválido ou expirado");
    }
    req.user = user;
    next();
  });
}

// Middleware opcional para rotas que podem ser acessadas sem autenticação
export const optionalAuth = (req, res, next) => {
  // Permite acesso sem autenticação, mas adiciona informações do usuário se disponível
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (!err) {
        req.user = user;
      }
    });
  }
  next();
};

