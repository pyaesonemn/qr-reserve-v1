// Server-side API functions for SSR/SSG
// These functions are used in Server Components for initial data fetching

import { serverApi, safeServerApi } from "./api";
import type { Session, PublicSession, Booking, User } from "@repo/types";

// Session server functions
export const sessionServerApi = {
  // Get all sessions (admin)
  getAll: () => serverApi<Session[]>("/sessions"),

  // Get single session (admin)
  getById: (id: string) => serverApi<Session>(`/sessions/${id}`),

  // Get public sessions (for booking interface)
  getPublic: () => serverApi<PublicSession[]>("/sessions/public"),

  // Get single public session
  getPublicById: (id: string) =>
    serverApi<PublicSession>(`/sessions/public/${id}`),

  // Safe versions with fallbacks
  safe: {
    getAll: () => safeServerApi<Session[]>("/sessions", []),
    getById: (id: string) =>
      safeServerApi<Session | null>(`/sessions/${id}`, null),
    getPublic: () => safeServerApi<PublicSession[]>("/sessions/public", []),
    getPublicById: (id: string) =>
      safeServerApi<PublicSession | null>(`/sessions/public/${id}`, null),
  },
};

// Booking server functions
export const bookingServerApi = {
  // Get all bookings (admin)
  getAll: () => serverApi<Booking[]>("/bookings"),

  // Get single booking
  getById: (id: string) => serverApi<Booking>(`/bookings/${id}`),

  // Get bookings for a session
  getBySession: (sessionId: string) =>
    serverApi<Booking[]>(`/sessions/${sessionId}/bookings`),

  // Safe versions with fallbacks
  safe: {
    getAll: () => safeServerApi<Booking[]>("/bookings", []),
    getById: (id: string) =>
      safeServerApi<Booking | null>(`/bookings/${id}`, null),
    getBySession: (sessionId: string) =>
      safeServerApi<Booking[]>(`/sessions/${sessionId}/bookings`, []),
  },
};

// Auth server functions
export const authServerApi = {
  // Get current user (requires auth header)
  getUser: (token: string) => {
    // Note: serverApi doesn't support options parameter yet
    // This would need to be implemented with proper auth headers
    return serverApi<User>("/auth/me");
  },

  // Get user profile
  getProfile: (token: string) => {
    // Note: serverApi doesn't support options parameter yet
    // This would need to be implemented with proper auth headers
    return serverApi<User>("/auth/profile");
  },

  // Safe versions
  safe: {
    getUser: (token: string) => safeServerApi<User | null>("/auth/me", null),
    getProfile: (token: string) =>
      safeServerApi<User | null>("/auth/profile", null),
  },
};

// Analytics server functions (for dashboard)
export const analyticsServerApi = {
  // Dashboard overview
  getDashboard: () =>
    serverApi<{
      totalSessions: number;
      totalBookings: number;
      pendingBookings: number;
      activeBookings: number;
      recentBookings: Booking[];
      upcomingSessions: Session[];
    }>("/analytics/dashboard"),

  // Session analytics
  getSessionStats: (timeRange?: string) =>
    serverApi<{
      totalSessions: number;
      activeSessions: number;
      averageBookingsPerSession: number;
      sessionsByMonth: Array<{ month: string; count: number }>;
    }>(`/analytics/sessions${timeRange ? `?timeRange=${timeRange}` : ""}`),

  // Booking analytics
  getBookingStats: (timeRange?: string) =>
    serverApi<{
      totalBookings: number;
      bookingsByStatus: Array<{ status: string; count: number }>;
      bookingsByMonth: Array<{ month: string; count: number }>;
      averageBookingsPerDay: number;
    }>(`/analytics/bookings${timeRange ? `?timeRange=${timeRange}` : ""}`),

  // Safe versions
  safe: {
    getDashboard: () =>
      safeServerApi("/analytics/dashboard", {
        totalSessions: 0,
        totalBookings: 0,
        pendingBookings: 0,
        activeBookings: 0,
        recentBookings: [],
        upcomingSessions: [],
      }),
    getSessionStats: (timeRange?: string) =>
      safeServerApi(
        `/analytics/sessions${timeRange ? `?timeRange=${timeRange}` : ""}`,
        {
          totalSessions: 0,
          activeSessions: 0,
          averageBookingsPerSession: 0,
          sessionsByMonth: [],
        }
      ),
    getBookingStats: (timeRange?: string) =>
      safeServerApi(
        `/analytics/bookings${timeRange ? `?timeRange=${timeRange}` : ""}`,
        {
          totalBookings: 0,
          bookingsByStatus: [],
          bookingsByMonth: [],
          averageBookingsPerDay: 0,
        }
      ),
  },
};

// Helper function to get auth token from cookies (for server-side auth)
export function getServerAuthToken(): string | null {
  // This would typically read from cookies
  // Implementation depends on your auth strategy
  // For now, returning null as placeholder
  return null;
}

// Helper function to check if user is authenticated on server
export async function getServerUser(): Promise<User | null> {
  const token = getServerAuthToken();
  if (!token) return null;

  try {
    return await authServerApi.getUser(token);
  } catch {
    return null;
  }
}
