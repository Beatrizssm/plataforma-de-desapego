import logger from "../logger/logger.js";

/**
 * Middleware global de tratamento de erros
 * Padroniza todas as respostas de erro da API
 */
export const errorHandler = (err, req, res, next) => {
  // Log do erro usando Winston
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
    userId: req.user?.id,
    body: req.body,
    params: req.params,
    query: req.query,
  });

  // Determinar status code
  const statusCode = err.statusCode || err.status || 500;

  // Mensagem de erro
  let message = err.message || "Erro interno do servidor";

  // Em produção, não expor detalhes de erros internos
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Erro interno do servidor";
  }

  // Resposta padronizada
  const response = {
    success: false,
    message,
  };

  // Adicionar stack apenas em desenvolvimento
  if (process.env.NODE_ENV !== "production" && err.stack) {
    response.stack = err.stack;
  }

  // Adicionar detalhes adicionais se for erro de validação
  if (err.errors) {
    response.errors = err.errors;
  }

  res.status(statusCode).json(response);
};

/**
 * Middleware para capturar erros assíncronos
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * Classe de erro customizada para a API
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

