import { MessageType, WebSocketMessage } from "@/src/lib/types";
import { logger } from "@/utils/logger";

export class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimeout = 1000; // Commence à 1 seconde
  private messageHandlers: ((message: WebSocketMessage) => void)[] = [];
  private connectionHandlers: ((connected: boolean) => void)[] = [];

  constructor(private baseUrl: string) {}

  connect(roomId: string, token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      logger.info("WebSocket déjà connecté");
      return;
    }

    try {
      const url = `${this.baseUrl}/ws/chat/${roomId}/`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        if (this.ws) {
          this.ws.send(
            JSON.stringify({
              type: "authentication",
              token,
              roomId,
            })
          );
          this.reconnectAttempts = 0;
          this.notifyConnectionHandlers(true);
          logger.info("WebSocket connecté avec succès", { roomId });
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data) as WebSocketMessage;

          // Si le message contient des données de fichier, les traiter
          if (message.fileData) {
            const { type, content, filename } = message.fileData;
            message.messageType = type;
            message.message = `[${filename}]`;
          }

          this.notifyMessageHandlers(message);
        } catch (error) {
          logger.error("Erreur lors du parsing du message WebSocket", {
            error,
          });
        }
      };

      this.ws.onclose = () => {
        this.notifyConnectionHandlers(false);
        this.handleReconnect(roomId, token);
      };

      this.ws.onerror = (error) => {
        logger.error("Erreur WebSocket", { error });
        this.ws?.close();
      };
    } catch (error) {
      logger.error("Erreur lors de la connexion WebSocket", { error });
      this.handleReconnect(roomId, token);
    }
  }

  private handleReconnect(roomId: string, token: string): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const timeout =
        this.reconnectTimeout * Math.pow(2, this.reconnectAttempts - 1);

      logger.info("Tentative de reconnexion WebSocket", {
        attempt: this.reconnectAttempts,
        timeout,
        roomId,
      });

      setTimeout(() => {
        this.connect(roomId, token);
      }, timeout);
    } else {
      logger.error(
        "Échec de la reconnexion WebSocket après plusieurs tentatives"
      );
    }
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
      this.notifyConnectionHandlers(false);
      logger.info("WebSocket déconnecté");
    }
  }

  send(message: string | Partial<WebSocketMessage>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      logger.error(
        "Tentative d'envoi de message sur un WebSocket non connecté"
      );
      return;
    }

    try {
      // Si le message est une chaîne, l'envoyer comme message texte
      if (typeof message === "string") {
        this.ws.send(
          JSON.stringify({
            type: "message",
            message,
            messageType: MessageType.TEXT,
          })
        );
      }
      // Sinon, envoyer l'objet message complet
      else {
        this.ws.send(JSON.stringify(message));
      }
    } catch (error) {
      logger.error("Erreur lors de l'envoi du message", { error });
    }
  }

  onMessage(handler: (message: WebSocketMessage) => void): () => void {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter((h) => h !== handler);
    };
  }

  onConnectionChange(handler: (connected: boolean) => void): () => void {
    this.connectionHandlers.push(handler);
    return () => {
      this.connectionHandlers = this.connectionHandlers.filter(
        (h) => h !== handler
      );
    };
  }

  private notifyMessageHandlers(message: WebSocketMessage): void {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private notifyConnectionHandlers(connected: boolean): void {
    this.connectionHandlers.forEach((handler) => handler(connected));
  }
}
