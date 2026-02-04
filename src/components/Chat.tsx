import { useState, useEffect, useRef } from "react";
import { ChatMessage, User } from "../types";
import { chatService } from "../services/chatService";

interface ChatProps {
  currentUser: User;
  isActive?: boolean;
}

export default function Chat({ currentUser, isActive = true }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load chat history
    loadChatHistory();

    // Only connect if the chat is active
    if (!isActive) return;

    // Add a small delay to avoid React strict mode issues
    const connectTimeout = setTimeout(() => {
      // Connect to WebSocket
      chatService.connect(currentUser.username, {
        onMessage: handleNewMessage,
        onConnect: () => {
          setIsConnected(true);
          console.log("Connected to chat");
        },
        onDisconnect: () => {
          setIsConnected(false);
          console.log("Disconnected from chat");
        },
        onError: (error) => {
          console.error("Chat error:", error);
          setIsConnected(false);
        },
      });
    }, 100);

    // Cleanup on unmount or when inactive
    return () => {
      clearTimeout(connectTimeout);
      chatService.disconnect();
    };
  }, [currentUser.username, isActive]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChatHistory = async () => {
    try {
      setIsLoading(true);
      const history = await chatService.getChatHistory();
      setMessages(history);
    } catch (error) {
      console.error("Failed to load chat history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !isConnected) return;

    try {
      await chatService.sendMessage(newMessage.trim());
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="chat-container">
        <div className="chat-loading">Loading chat...</div>
      </div>
    );
  }

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h3>💬 Team Chat</h3>
        <div
          className={`chat-status ${isConnected ? "connected" : "disconnected"}`}
        >
          {isConnected ? "🟢 Connected" : "🔴 Disconnected"}
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-empty">
            <p>No messages yet. Start the conversation! ⚽</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`chat-message ${
                message.username === currentUser.username ? "own" : "other"
              }`}
            >
              <div className="message-header">
                <span className="message-username">{message.username}</span>
                <span className="message-time">
                  {formatTime(message.timestamp)}
                </span>
              </div>
              <div className="message-content">{message.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
          className="chat-input"
          disabled={!isConnected}
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!newMessage.trim() || !isConnected}
          className="chat-send-btn"
        >
          Send
        </button>
      </form>
    </div>
  );
}
