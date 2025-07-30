import { env } from "./env";
import { ApiError, ServerApiError, NetworkError } from "./api-errors";

// Global flag to track if we're currently refreshing tokens
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

// Server-side fetch (SSR/SSG)
export async function serverApi<T>(endpoint: string): Promise<T> {
  try {
    const response = await fetch(`${env.API_BASE_URL}${endpoint}`, {
      cache: "no-store", // Always fresh for initial render
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new ServerApiError(
        `${response.status}: ${response.statusText}`,
        new Error(`Failed to fetch ${endpoint}`)
      );
    }

    return response.json();
  } catch (error) {
    if (error instanceof ServerApiError) {
      throw error;
    }
    throw new ServerApiError(
      `Failed to fetch from ${endpoint}`,
      error instanceof Error ? error : new Error(String(error))
    );
  }
}

// Token refresh function with concurrency protection
async function refreshAccessToken(): Promise<string | null> {
  // If we're already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        return null;
      }

      const response = await fetch(`${env.API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        // Refresh token is invalid, clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        
        // Trigger a custom event to notify components about auth failure
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("auth:token-expired"));
        }
        
        return null;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      return data.accessToken;
    } catch (error) {
      console.error("Token refresh failed:", error);
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      
      // Trigger a custom event to notify components about auth failure
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("auth:token-expired"));
      }
      
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// Client-side fetch (CSR) with automatic token refresh
async function clientApiRequest<T>(
  endpoint: string,
  options?: RequestInit,
  isRetry = false
): Promise<T> {
  try {
    // Get access token from localStorage
    const accessToken = localStorage.getItem("accessToken");
    
    const response = await fetch(`${env.API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
        ...options?.headers,
      },
      ...options,
    });

    // If we get a 401 and haven't already retried, try to refresh the token
    if (response.status === 401 && !isRetry && endpoint !== "/auth/refresh") {
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        // Retry the request with the new token
        return clientApiRequest<T>(endpoint, options, true);
      } else {
        // Refresh failed, redirect to login or handle as needed
        const errorData = await response.json().catch(() => null);
        throw new ApiError(response.status, response.statusText, errorData);
      }
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new ApiError(response.status, response.statusText, errorData);
    }

    return response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new NetworkError("Failed to connect to server");
    }
    throw new ApiError(500, "Unknown Error", error);
  }
}

// Client API interface
export const clientApi = {
  // Generic CRUD operations
  get: <T>(endpoint: string) => clientApiRequest<T>(endpoint),

  post: <T>(endpoint: string, data: unknown) =>
    clientApiRequest<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T>(endpoint: string, data: unknown) =>
    clientApiRequest<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  patch: <T>(endpoint: string, data: unknown) =>
    clientApiRequest<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: <T = void>(endpoint: string) =>
    clientApiRequest<T>(endpoint, {
      method: "DELETE",
    }),
};

// Utility function for handling server-side errors gracefully
export async function safeServerApi<T>(
  endpoint: string,
  fallback: T
): Promise<T> {
  try {
    return await serverApi<T>(endpoint);
  } catch (error) {
    console.error("Server API failed, using fallback:", error);
    return fallback;
  }
}
