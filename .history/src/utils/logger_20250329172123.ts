type LogLevel = "info" | "warn" | "error" | "debug";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
    };
  }

  private addLog(log: LogEntry): void {
    this.logs.push(log);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    // Format console output
    const logColor = {
      info: "\x1b[36m", // Cyan
      warn: "\x1b[33m", // Yellow
      error: "\x1b[31m", // Red
      debug: "\x1b[35m", // Magenta
    };

    const reset = "\x1b[0m";
    console.log(
      `${logColor[log.level]}[${log.level.toUpperCase()}]${reset} ${
        log.timestamp
      } - ${log.message}`,
      log.data ? log.data : ""
    );

    // En production, on pourrait envoyer les logs à un service externe
    if (process.env.NODE_ENV === "production") {
      this.sendToExternalService(log);
    }
  }

  private async sendToExternalService(log: LogEntry): Promise<void> {
    // Exemple d'implémentation pour envoyer les logs à un service externe
    try {
      await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(log),
      });
    } catch (error) {
      console.error("Erreur lors de l'envoi du log:", error);
    }
  }

  info(message: string, data?: unknown): void {
    this.addLog(this.formatLog("info", message, data));
  }

  warn(message: string, data?: unknown): void {
    this.addLog(this.formatLog("warn", message, data));
  }

  error(message: string, data?: unknown): void {
    this.addLog(this.formatLog("error", message, data));
  }

  debug(message: string, data?: unknown): void {
    if (process.env.NODE_ENV !== "production") {
      this.addLog(this.formatLog("debug", message, data));
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs(): void {
    this.logs = [];
  }
}

export const logger = Logger.getInstance(); 