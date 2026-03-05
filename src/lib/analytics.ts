/**
 * Analytics Configuration
 * Tracks user engagement, feature usage, and learning metrics
 */

type EventProperties = Record<string, unknown>;

interface PageViewEvent {
  page: string;
  title?: string;
  referrer?: string;
}

interface CustomEvent {
  name: string;
  properties?: EventProperties;
}

/**
 * Lightweight analytics client using Google Analytics
 * Falls back to custom tracking if GA is not available
 */
export const analytics = {
  /**
   * Track page view
   */
  trackPageView: (data: PageViewEvent) => {
    if (typeof window === 'undefined') return;

    // Google Analytics
    if ((window as any).gtag) {
      (window as any).gtag('config', process.env.NEXT_PUBLIC_GA_ID || '', {
        page_path: data.page,
        page_title: data.title,
      });
    }

    // Custom tracking - send to your own analytics endpoint
    trackEvent('page_view', {
      page: data.page,
      title: data.title,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track custom event
   */
  trackEvent: (name: string, properties?: EventProperties) => {
    trackEvent(name, properties);
  },

  /**
   * Track course enrollment
   */
  trackCourseEnroll: (courseId: string, courseName: string, topic: string) => {
    trackEvent('course_enroll', {
      courseId,
      courseName,
      topic,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track course completion
   */
  trackCourseComplete: (courseId: string, courseName: string, durationMinutes: number) => {
    trackEvent('course_complete', {
      courseId,
      courseName,
      durationMinutes,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track AI Assistant interaction
   */
  trackAIInteraction: (queryType: string, queryLength: number, responseTime: number) => {
    trackEvent('ai_interaction', {
      queryType,
      queryLength,
      responseTime,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track learning path selection
   */
  trackPathSelection: (pathId: string, pathName: string, difficulty: string) => {
    trackEvent('path_selection', {
      pathId,
      pathName,
      difficulty,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track recommendation interaction
   */
  trackRecommendationClick: (recommendationId: string, recommendationType: string) => {
    trackEvent('recommendation_click', {
      recommendationId,
      recommendationType,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track search
   */
  trackSearch: (query: string, resultCount: number) => {
    trackEvent('search', {
      query,
      resultCount,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track community engagement
   */
  trackCommunityEngagement: (engagementType: 'post' | 'comment' | 'like', contentType: string) => {
    trackEvent('community_engagement', {
      engagementType,
      contentType,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track achievement unlocked
   */
  trackAchievement: (achievementId: string, achievementName: string) => {
    trackEvent('achievement_unlocked', {
      achievementId,
      achievementName,
      timestamp: new Date().toISOString(),
    });
  },

  /**
   * Track user session duration
   */
  trackSessionDuration: (durationSeconds: number) => {
    trackEvent('session_duration', {
      durationSeconds,
      timestamp: new Date().toISOString(),
    });
  },
};

/**
 * Internal function to send events to analytics endpoint
 */
async function trackEvent(name: string, properties?: EventProperties) {
  if (typeof window === 'undefined') return;

  // Google Analytics
  if ((window as any).gtag) {
    (window as any).gtag('event', name, properties || {});
  }

  // Send to custom analytics endpoint if configured
  if (process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) {
    try {
      await fetch(process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: name,
          properties: properties || {},
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
        keepalive: true, // Ensure event is sent even if page is closing
      }).catch((error) => {
        console.warn('Failed to track event:', error);
      });
    } catch (error) {
      console.warn('Analytics tracking error:', error);
    }
  }
}

/**
 * Initialize Google Analytics script
 */
export const initGoogleAnalytics = () => {
  if (typeof window === 'undefined' || !process.env.NEXT_PUBLIC_GA_ID) return;

  // Inject Google Analytics script
  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`;
  script.async = true;
  document.head.appendChild(script);

  // Initialize gtag
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: unknown[]) {
    (window as any).dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', process.env.NEXT_PUBLIC_GA_ID);
  (window as any).gtag = gtag;
};
