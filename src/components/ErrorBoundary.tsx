'use client';

import React, { ReactNode } from 'react';
import { captureException } from '@/lib/sentry';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary Component
 * Catches errors in child components and displays error UI
 * Automatically logs errors to Sentry
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to Sentry
    captureException(error, {
      componentStack: errorInfo.componentStack,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by ErrorBoundary:', error);
      console.error('Component Stack:', errorInfo.componentStack);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="max-w-md w-full">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-2">
                  Oops! Something went wrong
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  We're sorry for the inconvenience. Our team has been notified about this issue.
                </p>
                <details className="bg-gray-100 dark:bg-gray-700 p-3 rounded mb-4">
                  <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300">
                    Error Details
                  </summary>
                  <pre className="mt-2 text-xs overflow-auto text-gray-600 dark:text-gray-400">
                    {this.state.error.toString()}
                  </pre>
                </details>
                <button
                  onClick={() => window.location.href = '/'}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Return to Home
                </button>
              </div>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
