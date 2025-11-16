import winston from "winston";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { existsSync, mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Criar pasta logs se não existir
const logsDir = path.join(__dirname, "../../logs");
if (!existsSync(logsDir)) {
  mkdirSync(logsDir, { recursive: true });
}

// Definir níveis de log
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Definir cores para cada nível
const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

// Adicionar cores ao winston
winston.addColors(colors);

// Formato personalizado
const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => {
    return `${info.timestamp} ${info.level}: ${info.message}`;
  })
);

// Formato JSON para arquivos
const jsonFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Transportes (onde os logs serão salvos)
const transports = [
  // Console - mostrar todos os logs
  new winston.transports.Console({
    format: format,
  }),
  // Arquivo de erros - apenas erros
  new winston.transports.File({
    filename: path.join(logsDir, "error.log"),
    level: "error",
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
  // Arquivo combinado - todos os logs
  new winston.transports.File({
    filename: path.join(logsDir, "combined.log"),
    format: jsonFormat,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
  }),
];

// Criar o logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  levels,
  format: jsonFormat,
  transports,
  // Capturar exceções não tratadas
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/exceptions.log"),
      format: jsonFormat,
    }),
  ],
  // Capturar rejeições de Promises
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(__dirname, "../../logs/rejections.log"),
      format: jsonFormat,
    }),
  ],
});

// Se não estiver em produção, também logar no console
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: format,
    })
  );
}

export default logger;

