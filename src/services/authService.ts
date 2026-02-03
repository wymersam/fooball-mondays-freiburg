import { UserResponse, RegisterResponse, User } from "../types";

// API base URL - empty string means use same origin (frontend and backend served together)
// In development with Vite proxy, empty string uses the proxy
const API_BASE = "";

class AuthService {
  async checkAuth(): Promise<User> {
    const response = await fetch(`${API_BASE}/api/user`, {
      credentials: "include",
    });
    const data: UserResponse = await response.json();

    if (!data.authenticated || !data.username) {
      throw new Error("Not authenticated");
    }

    return { username: data.username };
  }

  async register(username: string): Promise<User> {
    const response = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
      credentials: "include",
    });

    const data: RegisterResponse = await response.json();

    if (!response.ok) {
      const errorData = data as any;
      throw new Error(errorData.error || "Registration failed");
    }

    return { username: data.username };
  }
}

export const authService = new AuthService();
