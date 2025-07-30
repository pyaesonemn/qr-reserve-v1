// Query key factories for cache management
// Following the hierarchical structure recommended by React Query

// Base keys to avoid circular references
const authBase = ["auth"] as const;
const sessionsBase = ["sessions"] as const;
const bookingsBase = ["bookings"] as const;
const analyticsBase = ["analytics"] as const;

export const queryKeys = {
  // Auth keys
  auth: {
    all: authBase,
    user: () => [...authBase, "user"] as const,
    profile: () => [...authBase, "profile"] as const,
  },

  // Session keys
  sessions: {
    all: sessionsBase,
    lists: () => [...sessionsBase, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...sessionsBase, "list", { filters }] as const,
    details: () => [...sessionsBase, "detail"] as const,
    detail: (id: string) => [...sessionsBase, "detail", id] as const,
    public: {
      all: [...sessionsBase, "public"] as const,
      lists: () => [...sessionsBase, "public", "list"] as const,
      detail: (id: string) =>
        [...sessionsBase, "public", "detail", id] as const,
    },
  },

  // Booking keys
  bookings: {
    all: bookingsBase,
    lists: () => [...bookingsBase, "list"] as const,
    list: (filters?: Record<string, unknown>) =>
      [...bookingsBase, "list", { filters }] as const,
    details: () => [...bookingsBase, "detail"] as const,
    detail: (id: string) => [...bookingsBase, "detail", id] as const,
    bySession: (sessionId: string) =>
      [...bookingsBase, "session", sessionId] as const,
    public: {
      all: [...bookingsBase, "public"] as const,
      detail: (id: string) =>
        [...bookingsBase, "public", "detail", id] as const,
    },
  },

  // Analytics keys (for future use)
  analytics: {
    all: analyticsBase,
    dashboard: () => [...analyticsBase, "dashboard"] as const,
    sessions: (timeRange?: string) =>
      [...analyticsBase, "sessions", { timeRange }] as const,
    bookings: (timeRange?: string) =>
      [...analyticsBase, "bookings", { timeRange }] as const,
  },
} as const;

// Helper function to invalidate related queries
export const getInvalidationKeys = {
  // When a session is created/updated/deleted
  onSessionChange: (sessionId?: string) => [
    queryKeys.sessions.lists(),
    ...(sessionId ? [queryKeys.sessions.detail(sessionId)] : []),
    queryKeys.sessions.public.lists(),
    queryKeys.analytics.sessions(),
  ],

  // When a booking is created/updated/deleted
  onBookingChange: (sessionId?: string, bookingId?: string) => [
    queryKeys.bookings.lists(),
    ...(bookingId ? [queryKeys.bookings.detail(bookingId)] : []),
    ...(sessionId
      ? [
          queryKeys.bookings.bySession(sessionId),
          queryKeys.sessions.detail(sessionId),
          queryKeys.sessions.public.detail(sessionId),
        ]
      : []),
    queryKeys.analytics.bookings(),
  ],

  // When user profile is updated
  onProfileChange: () => [queryKeys.auth.user(), queryKeys.auth.profile()],
};
