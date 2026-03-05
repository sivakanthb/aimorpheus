'use client';

import React, { ReactNode, useEffect } from 'react';
import { initSentry } from '@/lib/sentry';
import { initGoogleAnalytics, analytics } from '@/lib/analytics';

export function ClientLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Initialize Sentry for error tracking
    initSentry();

    // Initialize Google Analytics
    initGoogleAnalytics();

    // Track page view on mount
    analytics.trackPageView({
      page: window.location.pathname,
      title: document.title,
    });

    // Track session duration
    const sessionStart = Date.now();
    const handleBeforeUnload = () => {
      const sessionDuration = (Date.now() - sessionStart) / 1000; // Convert to seconds
      analytics.trackSessionDuration(Math.round(sessionDuration));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Track route changes
  useEffect(() => {
    analytics.trackPageView({
      page: window.location.pathname,
      title: document.title,
    });
  }, []);

  return <>{children}</>;
}
