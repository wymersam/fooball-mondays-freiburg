import { SignupStatus, SuccessResponse } from "../types";

// API base URL - use Railway URL in production, localhost in development
const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://football-mondays-production.up.railway.app" // Replace with your Railway URL
    : "";

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
