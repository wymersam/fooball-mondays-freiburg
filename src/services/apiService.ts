import { SignupStatus, SuccessResponse } from "../types";

// API base URL - empty string means use same origin (frontend and backend served together)
// In development with Vite proxy, empty string uses the proxy
const API_BASE = "";

class ApiService {
  async getStatus(): Promise<SignupStatus> {
    const response = await fetch(`${API_BASE}/api/status`, {
      credentials: "include", // Include cookies for authentication
    });
    if (!response.ok) {
      throw new Error("Failed to fetch status");
    }
    return response.json();
  }

  async signup(): Promise<SuccessResponse> {
    const response = await fetch(`${API_BASE}/api/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }

    return data;
  }

  async removeSignup(): Promise<SuccessResponse> {
    const response = await fetch(`${API_BASE}/api/signup`, {
      method: "DELETE",
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to remove signup");
    }

    return data;
  }
}

export const apiService = new ApiService();
