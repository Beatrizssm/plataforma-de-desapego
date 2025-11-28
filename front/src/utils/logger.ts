/**
 * Sistema de logs para o frontend
 * Diferentes níveis de log baseados no ambiente
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: string;
}

class Logger {
  private isDevelopment: boolean;

  constructor() {
    this.isDevelopment = import.meta.env.DEV || import.meta.env.MODE === 'development';
  }

  private formatMessage(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const entry = this.formatMessage(level, message, data);

    // Em desenvolvimento, sempre logar no console
    if (this.isDevelopment) {
      const consoleMethod = console[level] || console.log;
      const emoji = {
        debug: '🔍',
        info: 'ℹ️',
        warn: '⚠️',
        error: '❌',
      }[level];

      if (data) {
        consoleMethod(`${emoji} [${entry.timestamp}] ${message}`, data);
      } else {
        consoleMethod(`${emoji} [${entry.timestamp}] ${message}`);
      }
    }

    // Em produção, apenas erros e warnings
    if (!this.isDevelopment && (level === 'error' || level === 'warn')) {
      // Aqui você pode enviar para um serviço de logging externo
      // Por exemplo: Sentry, LogRocket, etc.
      if (level === 'error') {
        console.error(message, data);
      } else {
        console.warn(message, data);
      }
    }

    // Armazenar logs críticos no localStorage (últimos 50)
    if (level === 'error') {
      this.storeLog(entry);
    }
  }

  private storeLog(entry: LogEntry): void {
    try {
      const logs = this.getStoredLogs();
      logs.push(entry);
      
      // Manter apenas os últimos 50 logs
      if (logs.length > 50) {
        logs.shift();
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      // Falha silenciosa se localStorage não estiver disponível
    }
  }

  getStoredLogs(): LogEntry[] {
    try {
      const logs = localStorage.getItem('app_logs');
      return logs ? JSON.parse(logs) : [];
    } catch {
      return [];
    }
  }

  clearLogs(): void {
    try {
      localStorage.removeItem('app_logs');
    } catch {
      // Falha silenciosa
    }
  }

  debug(message: string, data?: any): void {
    if (this.isDevelopment) {
      this.log('debug', message, data);
    }
  }

  info(message: string, data?: any): void {
    this.log('info', message, data);
  }

  warn(message: string, data?: any): void {
    this.log('warn', message, data);
  }

  error(message: string, error?: any): void {
    const errorData = error instanceof Error 
      ? { message: error.message, stack: error.stack, name: error.name }
      : error;
    
    this.log('error', message, errorData);
  }

  // Métodos específicos para diferentes contextos
  api(method: string, url: string, status?: number, error?: any): void {
    if (error) {
      this.error(`API ${method} ${url}`, { status, error });
    } else {
      this.info(`API ${method} ${url}`, { status });
    }
  }

  auth(action: string, success: boolean, data?: any): void {
    if (success) {
      this.info(`Auth: ${action}`, data);
    } else {
      this.warn(`Auth: ${action} falhou`, data);
    }
  }

  chat(action: string, data?: any): void {
    this.debug(`Chat: ${action}`, data);
  }
}

export const logger = new Logger();
export default logger;

