/**
 * Public routes available to any users
 */
export const publicRoutes = ['/', '/auth/verify-email', '/api/stripe/webhook']

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 */
export const authRoutes = [
  '/auth/login',
  '/auth/register',
  '/auth/error',
  '/auth/reset-password',
  '/auth/new-password',
]

/**
 * The prefix for API auth routes
 * This is used to prevent blocking the API routes
 */
export const apiAuthPrefix = '/api/auth'

// The default route to redirect to after login
export const DEFAULT_LOGIN_REDIRECT = '/dashboard/'
