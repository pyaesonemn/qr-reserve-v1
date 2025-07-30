"use client";

import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { isApiError, isServerApiError, isNetworkError } from "@/lib/api-errors";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: unknown) {
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const reset = () => {
        this.setState({ hasError: false, error: null });
      };

      if (this.props.fallback) {
        return this.props.fallback(this.state.error, reset);
      }

      return <DefaultErrorFallback error={this.state.error} reset={reset} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: DefaultErrorFallbackProps) {
  const getErrorMessage = (error: Error) => {
    if (isApiError(error)) {
      return `API Error (${error.status}): ${error.statusText}`;
    }
    if (isServerApiError(error)) {
      return `Server Error: ${error.message}`;
    }
    if (isNetworkError(error)) {
      return `Network Error: ${error.message}`;
    }
    return (error as Error).message || "An unexpected error occurred";
  };

  const getErrorDescription = (error: Error) => {
    if (isApiError(error)) {
      return "There was a problem with the API request. Please try again.";
    }
    if (isServerApiError(error)) {
      return "There was a problem loading data from the server.";
    }
    if (isNetworkError(error)) {
      return "Please check your internet connection and try again.";
    }
    return "Something went wrong. Please try refreshing the page.";
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-destructive">
            Something went wrong
          </CardTitle>
          <CardDescription>{getErrorDescription(error)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <details className="text-sm">
            <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
              Error details
            </summary>
            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto">
              {getErrorMessage(error)}
            </pre>
          </details>
          <div className="flex gap-2">
            <Button onClick={reset} variant="outline">
              Try again
            </Button>
            <Button onClick={() => window.location.reload()} variant="default">
              Refresh page
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Specific error components for different contexts
export function ApiErrorDisplay({ error }: { error: Error }) {
  if (isApiError(error)) {
    return (
      <div className="rounded-md bg-destructive/15 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">
              API Error ({error.status})
            </h3>
            <div className="mt-2 text-sm text-destructive">
              <p>{error.statusText}</p>
              {error.data != null && (
                <pre className="mt-2 text-xs">
                  {typeof error.data === "string"
                    ? error.data
                    : JSON.stringify(error.data, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isNetworkError(error)) {
    return (
      <div className="rounded-md bg-yellow-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Connection Problem
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Unable to connect to the server. Please check your internet
                connection.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md bg-destructive/15 p-4">
      <div className="flex">
        <div className="ml-3">
          <h3 className="text-sm font-medium text-destructive">Error</h3>
          <div className="mt-2 text-sm text-destructive">
            <p>{(error as Error).message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading error component for query errors
export function QueryErrorDisplay({
  error,
  retry,
}: {
  error: Error;
  retry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <ApiErrorDisplay error={error} />
      {retry && (
        <Button onClick={retry} className="mt-4" variant="outline">
          Try again
        </Button>
      )}
    </div>
  );
}
