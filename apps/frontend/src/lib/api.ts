import { env } from "./env";
import { ApiError, ServerApiError, NetworkError } from "./api-errors";

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

// Client-side fetch (CSR)
async function clientApiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  try {
    const response = await fetch(`${env.API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });

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
