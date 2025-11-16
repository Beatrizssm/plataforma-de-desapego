/**
 * Helper para padronizar respostas da API
 * Todas as respostas seguem o formato: { success, message, data? }
 */

/**
 * Resposta de sucesso
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null && data !== undefined) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Resposta de erro
 */
export const errorResponse = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Resposta de criação (201)
 */
export const createdResponse = (res, message, data) => {
  return successResponse(res, message, data, 201);
};

/**
 * Resposta de não encontrado (404)
 */
export const notFoundResponse = (res, message = "Recurso não encontrado") => {
  return errorResponse(res, message, 404);
};

/**
 * Resposta de não autorizado (401)
 */
export const unauthorizedResponse = (res, message = "Não autorizado") => {
  return errorResponse(res, message, 401);
};

/**
 * Resposta de acesso negado (403)
 */
export const forbiddenResponse = (res, message = "Acesso negado") => {
  return errorResponse(res, message, 403);
};

