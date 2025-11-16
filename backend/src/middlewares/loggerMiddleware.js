import logger from "../logger/logger.js";
import morgan from "morgan";

// Stream customizado para integrar Morgan com Winston
const morganStream = {
  write: (message) => {
    // Remover quebra de linha e logar
    logger.http(message.trim());
  },
};

// Middleware para logar requisições HTTP usando Morgan integrado com Winston
export const httpLogger = morgan(
  process.env.NODE_ENV === "production" ? "combined" : "dev",
  {
    stream: morganStream,
  }
);

// Middleware para logar erros
export const errorLogger = (err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  next(err);
};

// Middleware para logar requisições com mais detalhes
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("user-agent"),
    };

    if (res.statusCode >= 400) {
      logger.warn(logData);
    } else {
      logger.info(logData);
    }
  });

  next();
};

