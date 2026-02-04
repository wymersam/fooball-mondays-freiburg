import { ChatMessage } from "../types";

interface ChatCallbacks {
  onMessage: (message: ChatMessage) => void;
  onConnect: () => void;
  onDisconnect: () => void;
  onError: (error: Event) => void;
}

class ChatService {
  private ws: WebSocket | null = null;
  private callbacks: ChatCallbacks | null = null;
  private username: string = "";
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000;

  connect(username: string, callbacks: ChatCallbacks): void {
    this.username = username;
    this.callbacks = callbacks;
    this.reconnectAttempts = 0; // Reset reconnection attempts
    this.createWebSocket();
  }

  private createWebSocket(): void {
    try {
      // Determine WebSocket URL based on environment
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const host = window.location.hostname;

      // For development, connect directly to Go server on port 3001
      // For production, use the same host as the frontend
      const port =
        window.location.hostname === "localhost"
          ? "3001"
          : window.location.port;
      const wsUrl = `${protocol}//${host}:${port}/api/chat/ws?username=${encodeURIComponent(this.username)}`;

      console.log(`Connecting to WebSocket: ${wsUrl}`);
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log("WebSocket connected");
        this.reconnectAttempts = 0;
        if (this.callbacks) {
          this.callbacks.onConnect();
        }
      };

      this.ws.onmessage = (event) => {
        try {
          const message: ChatMessage = JSON.parse(event.data);
          if (this.callbacks) {
            this.callbacks.onMessage(message);
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      this.ws.onclose = () => {
        console.log("WebSocket disconnected");
        if (this.callbacks) {
          this.callbacks.onDisconnect();
        }
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        if (this.callbacks) {
          this.callbacks.onError(error);
        }
      };
    } catch (error) {
      console.error("Failed to create WebSocket:", error);
      if (this.callbacks) {
        this.callbacks.onError(error as Event);
      }
    }
  }

  private attemptReconnect(): void {
    if (
      this.reconnectAttempts < this.maxReconnectAttempts &&
      this.username &&
      this.callbacks
    ) {
      this.reconnectAttempts++;
      console.log(
        `Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`,
      );

      setTimeout(() => {
        if (this.username && this.callbacks) {
          this.createWebSocket();
        }
      }, this.reconnectInterval);
    } else {
      console.log("Max reconnection attempts reached or service disconnected");
    }
  }

  sendMessage(message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
        reject(new Error("WebSocket is not connected"));
        return;
      }

      try {
        this.ws.send(JSON.stringify({ message }));
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  async getChatHistory(): Promise<ChatMessage[]> {
    try {
      // Use relative URL - Vite will proxy to the Go server
      const response = await fetch("/api/chat/history", {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch chat history");
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error("Error fetching chat history:", error);
      throw error;
    }
  }

  disconnect(): void {
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.callbacks = null;
    this.username = "";
    console.log("Chat service disconnected");
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }
}

export const chatService = new ChatService();
