// Validadores para campos de entrada
import { AppError } from "../middlewares/errorHandler.js";

export function validateEmail(email) {
  if (!email) {
    throw new AppError("E-mail é obrigatório", 400);
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError("E-mail inválido", 400);
  }
  return true;
}

export function validatePassword(password) {
  if (!password) {
    throw new AppError("Senha é obrigatória", 400);
  }
  if (password.length < 6) {
    throw new AppError("Senha deve ter no mínimo 6 caracteres", 400);
  }
  return true;
}

export function validateName(name) {
  if (!name) {
    throw new AppError("Nome é obrigatório", 400);
  }
  if (name.trim().length < 2) {
    throw new AppError("Nome deve ter no mínimo 2 caracteres", 400);
  }
  return true;
}

export function validateItemData(data) {
  const errors = [];

  if (!data.title || data.title.trim().length === 0) {
    errors.push("Título é obrigatório");
  }
  if (data.title && data.title.trim().length < 3) {
    errors.push("Título deve ter no mínimo 3 caracteres");
  }

  if (!data.description || data.description.trim().length === 0) {
    errors.push("Descrição é obrigatória");
  }
  if (data.description && data.description.trim().length < 10) {
    errors.push("Descrição deve ter no mínimo 10 caracteres");
  }

  if (data.price === undefined || data.price === null) {
    errors.push("Preço é obrigatório");
  }
  if (data.price !== undefined && (isNaN(data.price) || data.price < 0)) {
    errors.push("Preço deve ser um número positivo");
  }

  if (errors.length > 0) {
    throw new AppError(errors.join("; "), 400, errors);
  }

  return true;
}

export function validateId(id) {
  const numId = Number(id);
  if (isNaN(numId) || numId <= 0 || !Number.isInteger(numId)) {
    throw new AppError("ID inválido", 400);
  }
  return numId;
}

