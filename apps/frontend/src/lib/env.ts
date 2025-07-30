// Environment configuration for API endpoints
export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Type-safe environment validation
if (typeof window !== 'undefined' && !env.API_BASE_URL) {
  console.warn('NEXT_PUBLIC_API_URL is not defined. Using default localhost:3001');
}