import { UserResponse, RegisterResponse, User } from "../types";

class AuthService {
  async checkAuth(): Promise<User> {
    const response = await fetch("/api/user");
    const data: UserResponse = await response.json();

    if (!data.authenticated || !data.username) {
      throw new Error("Not authenticated");
    }

    return { username: data.username };
  }

  async register(username: string): Promise<User> {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
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
