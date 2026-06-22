import { SignupStatus, SuccessResponse, RegisterResponse } from "../types";

type OverrideStatus = "auto" | "open" | "closed";

interface AdminOverrideResponse {
  override: OverrideStatus;
}

// API base URL for backend requests
// In development, this should match your backend server (Vite proxy or direct)
const API_BASE = "";

class ApiService {
  /**
   * Get the current signup status for a user.
   * @param username - The username to check status for (optional)
   * @returns SignupStatus object from backend
   */
  async getStatus(username?: string): Promise<SignupStatus> {
    // Pass username as query param if provided
    const url = username
      ? `${API_BASE}/api/status?currentUser=${encodeURIComponent(username)}`
      : `${API_BASE}/api/status`;
    const response = await fetch(url, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch status");
    }
    return response.json();
  }

  /**
   * Sign up the current authenticated user for this week's game.
   * @returns SuccessResponse from backend
   */
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

  /**
   * Remove the current user's signup for this week.
   * @returns SuccessResponse from backend
   */
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

  /**
   * Register a new user (or log in if user exists).
   * Sets authentication cookie on success.
   * @param username - The username to register
   * @returns RegisterResponse from backend
   */
  async registerUser(
    username: string,
    inviteCode: string,
  ): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, inviteCode }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Registration failed");
    }
    return data;
  }

  /**
   * Log in an existing user.
   * Sets authentication cookie on success.
   * @param username - The username to log in
   * @returns RegisterResponse from backend
   */
  async loginUser(username: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_BASE}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }
    return data;
  }

  async adminCheck(): Promise<{ isAdmin: boolean }> {
    const response = await fetch(`${API_BASE}/api/admin/check`, {
      credentials: "include",
    });
    if (!response.ok) return { isAdmin: false };
    return response.json();
  }

  async adminOverrideStatus(password: string): Promise<AdminOverrideResponse> {
    const response = await fetch(`${API_BASE}/api/admin/override`, {
      credentials: "include",
      headers: { "X-Admin-Password": password },
    });
    if (!response.ok) return { override: "auto" };
    return response.json();
  }

  async adminReset(password: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/admin/reset`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Admin-Password": password },
    });
    if (!response.ok) throw new Error("Reset failed");
  }

  async adminOpenSignups(password: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/admin/open`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Admin-Password": password },
    });
    if (!response.ok) throw new Error("Failed to open signups");
  }

  async adminCloseSignups(password: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/admin/close`, {
      method: "POST",
      credentials: "include",
      headers: { "X-Admin-Password": password },
    });
    if (!response.ok) throw new Error("Failed to close signups");
  }

  async adminClearOverride(password: string): Promise<void> {
    await fetch(`${API_BASE}/api/admin/override`, {
      method: "DELETE",
      credentials: "include",
      headers: { "X-Admin-Password": password },
    });
  }

  async setBibWasher(value: boolean): Promise<void> {
    const response = await fetch(`${API_BASE}/api/bib-washer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ bibWasher: value }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update bib washer status");
    }
  }

  async setBallBringer(value: boolean): Promise<void> {
    const response = await fetch(`${API_BASE}/api/ball-bringer`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ ballBringer: value }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update bringing ball status");
    }
  }

  async setPaid(value: boolean): Promise<void> {
    const response = await fetch(`${API_BASE}/api/paid`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ hasPaid: value }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update payment status");
    }
  }

  async setPaypalRef(ref: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/paypal-ref`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ paypalRef: ref }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to update PayPal details");
    }
  }

  async addCollector(name: string, weekKey: string): Promise<void> {
    const response = await fetch(`${API_BASE}/api/collectors`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username: name, weekKey }),
    });
    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      throw new Error(data.error || "Failed to add collector");
    }
  }

  async getCollectors(): Promise<
    { weekKey: string; userId: string; username: string }[]
  > {
    const response = await fetch(`${API_BASE}/api/collectors`, {
      credentials: "include",
    });
    if (!response.ok) return [];
    return response.json();
  }
}

export const apiService = new ApiService();
