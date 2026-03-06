'use client';

import { useEffect, useState } from 'react';

/**
 * Web Vitals and Performance Monitoring
 */

interface WebVitals {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

/**
 * Hook to track Web Vitals (Core Web Vitals)
 * Monitors: LCP, FID, CLS, TTFB
 */
export const useWebVitals = () => {
  const [vitals, setVitals] = useState<WebVitals[]>([]);

  useEffect(() => {
    // Try to use Web Vitals if available
    if (typeof window === 'undefined') return;

    const collectVitals = async () => {
      try {
        // Dynamically import web-vitals - handle both module formats
        const webVitals = await import('web-vitals');
        
        const handleMetric = (metric: any) => {
          const vital: WebVitals = {
            name: metric.name,
            value: metric.value,
            rating: metric.rating || 'good',
          };

          setVitals((prev) => [...prev, vital]);

          // Send to analytics
          if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
            fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/web-vitals`, {
              method: 'POST',
              body: JSON.stringify(vital),
              headers: { 'Content-Type': 'application/json' },
              keepalive: true,
            }).catch(() => {}); // Silently fail
          }
        };

        // Use onCLS, onFID, etc. callbacks if available
        if (webVitals.onCLS) webVitals.onCLS(handleMetric);
        if (webVitals.onFID) webVitals.onFID(handleMetric);
        if (webVitals.onFCP) webVitals.onFCP(handleMetric);
        if (webVitals.onLCP) webVitals.onLCP(handleMetric);
        if (webVitals.onTTFB) webVitals.onTTFB(handleMetric);
      } catch (error) {
        console.warn('Failed to collect Web Vitals:', error);
      }
    };

    collectVitals();
  }, []);

  return vitals;
};

/**
 * Hook to measure component render performance
 */
export const useComponentPerformance = (componentName: string) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;

      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT && renderTime > 100) {
        // Only track slow renders (>100ms)
        fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/component-performance`, {
          method: 'POST',
          body: JSON.stringify({
            component: componentName,
            renderTime,
            timestamp: new Date().toISOString(),
          }),
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }).catch(() => {});
      }
    };
  }, [componentName]);
};

/**
 * Utility to track function execution time
 */
export const measureExecutionTime = async <T,>(
  fn: () => Promise<T>,
  operationName: string
): Promise<T> => {
  const startTime = performance.now();

  try {
    const result = await fn();
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    // Track slow operations (>1 second)
    if (executionTime > 1000) {
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
        fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/slow-operations`, {
          method: 'POST',
          body: JSON.stringify({
            operation: operationName,
            duration: executionTime,
            timestamp: new Date().toISOString(),
          }),
          headers: { 'Content-Type': 'application/json' },
          keepalive: true,
        }).catch(() => {});
      }
    }

    return result;
  } catch (error) {
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
      fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/operation-errors`, {
        method: 'POST',
        body: JSON.stringify({
          operation: operationName,
          duration: executionTime,
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        }),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {});
    }

    throw error;
  }
};
