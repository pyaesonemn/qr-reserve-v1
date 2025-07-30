// API Error classes for different contexts

export class ApiError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: unknown
  ) {
    super(`API Error ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

export class ServerApiError extends Error {
  constructor(
    public message: string,
    public originalError?: Error
  ) {
    super(`Server API Error: ${message}`);
    this.name = "ServerApiError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(`Network Error: ${message}`);
    this.name = "NetworkError";
  }
}

// Error type guards
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function isServerApiError(error: unknown): error is ServerApiError {
  return error instanceof ServerApiError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}
