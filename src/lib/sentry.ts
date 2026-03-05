/**
 * Sentry Configuration for Error Tracking
 * Initialize Sentry to capture runtime errors and exceptions
 */

export const initSentry = () => {
  // Only initialize Sentry if we're in production AND have a DSN
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    // Dynamic import to keep bundle size minimal
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        environment: process.env.NODE_ENV,
        tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
        integrations: [
          new Sentry.Replay({
            maskAllText: false,
            blockAllMedia: false,
          }),
        ],
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
        enabled:
          process.env.NODE_ENV === 'production' &&
          !!process.env.NEXT_PUBLIC_SENTRY_DSN,
      });
    });
  }
};

/**
 * Capture exception and send to Sentry
 */
export const captureException = (error: Error, context?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.captureException(error, {
        contexts: {
          custom: context,
        },
      });
    });
  }

  // Also log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', error, 'Context:', context);
  }
};

/**
 * Add breadcrumb for debugging
 */
export const addBreadcrumb = (message: string, data?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.addBreadcrumb({
        message,
        data,
        level: 'info',
      });
    });
  }
};

/**
 * Set user context for error tracking
 */
export const setUserContext = (userId: string, userData?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.setUser({
        id: userId,
        ...userData,
      });
    });
  }
};

/**
 * Clear user context
 */
export const clearUserContext = () => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
    import('@sentry/nextjs').then((Sentry) => {
      Sentry.setUser(null);
    });
  }
};
