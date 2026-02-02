import { SignupStatus, SuccessResponse } from "../types";

class ApiService {
  async getStatus(): Promise<SignupStatus> {
    const response = await fetch("/api/status");
    if (!response.ok) {
      throw new Error("Failed to fetch status");
    }
    return response.json();
  }

  async signup(): Promise<SuccessResponse> {
    const response = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }

    return data;
  }

  async removeSignup(): Promise<SuccessResponse> {
    const response = await fetch("/api/signup", {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to remove signup");
    }

    return data;
  }
}

export const apiService = new ApiService();
