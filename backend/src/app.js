import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/index.js";
import { httpLogger, requestLogger } from "./middlewares/loggerMiddleware.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import logger from "./logger/logger.js";
import { errorResponse } from "./utils/responseHelper.js";

dotenv.config();
const app = express();

// Middleware de logging (deve vir antes de outros middlewares)
app.use(httpLogger);
app.use(requestLogger);

app.use(cors());
app.use(express.json());
app.use("/api", routes);

// Middleware para rotas não encontradas (antes do errorHandler)
app.use((req, res) => {
  logger.warn({
    message: "Rota não encontrada",
    method: req.method,
    url: req.url,
    ip: req.ip,
  });
  
  return errorResponse(res, `Rota não encontrada: ${req.method} ${req.url}`, 404);
});

// Middleware global de tratamento de erros (deve ser o último)
app.use(errorHandler);

export default app;

