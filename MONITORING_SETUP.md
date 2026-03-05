# Monitoring & Analytics Implementation Guide

## Overview
This implementation provides comprehensive monitoring and analytics for the AIMorpheus learning platform:

- **Error Tracking**: Sentry captures runtime errors with context
- **Event Analytics**: Track user engagement and feature usage
- **AI Quality Monitoring**: Monitor AI assistant response quality
- **Performance Monitoring**: Track Web Vitals and component performance

## Setup Instructions

### 1. Install Required Dependencies

```bash
npm install @sentry/nextjs web-vitals
```

### 2. Configure Environment Variables

Copy `.env.monitoring.example` to `.env.local` and fill in your credentials:

```env
# Sentry (Error Tracking)
NEXT_PUBLIC_SENTRY_DSN=https://your-key@sentry.io/your-project-id

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Custom Analytics Endpoint (Optional)
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://your-analytics-backend.com/api/events

# AI Model Version
NEXT_PUBLIC_AI_MODEL_VERSION=v1.0.0
```

### 3. Set Up Sentry

1. Go to [sentry.io](https://sentry.io/signup/)
2. Create a new organization
3. Create a Next.js project
4. Copy the DSN to `NEXT_PUBLIC_SENTRY_DSN`

### 4. Set Up Google Analytics

1. Go to [analytics.google.com](https://analytics.google.com/)
2. Create a new GA4 property
3. Get your Measurement ID (G-XXXXX)
4. Set it as `NEXT_PUBLIC_GA_ID`

## Usage Examples

### Tracking User Events

```typescript
import { analytics } from '@/lib/analytics';

// Track course enrollment
analytics.trackCourseEnroll('course-123', 'React Fundamentals', 'web-dev');

// Track course completion
analytics.trackCourseComplete('course-123', 'React Fundamentals', 45);

// Track AI interaction
analytics.trackAIInteraction('learning-question', 250, 1200);

// Track learning path selection
analytics.trackPathSelection('path-456', 'Full Stack Developer', 'intermediate');

// Track custom events
analytics.trackEvent('custom_event', {
  category: 'engagement',
  value: 100,
});
```

### Error Handling with Sentry

```typescript
import { captureException, addBreadcrumb, setUserContext } from '@/lib/sentry';

// Capture exceptions
try {
  riskyOperation();
} catch (error) {
  captureException(error as Error, {
    userId: user.id,
    context: 'Course Enrollment',
  });
}

// Add breadcrumbs for debugging
addBreadcrumb('User started course', { courseId: 'course-123' });

// Set user context for better error reporting
setUserContext('user-123', {
  email: 'user@example.com',
  plan: 'premium',
});
```

### Monitoring AI Assistant Quality

```typescript
import { useAIMetrics, trackAISatisfaction, detectAIQualityIssues } from '@/lib/aiMonitoring';

export function AIChat() {
  const { measureInteraction, trackSatisfaction } = useAIMetrics();

  const handleQuery = async (query: string) => {
    const startTime = Date.now();
    const response = await getAIResponse(query);
    
    // Measure metrics
    measureInteraction(startTime, query.length, response.length, 'learning-question');
    
    // Detect quality issues
    const issues = detectAIQualityIssues(query, response, Date.now() - startTime);
    if (issues.length > 0) {
      console.warn('AI Quality Issues:', issues);
    }
    
    return response;
  };

  const handleFeedback = (satisfaction: 'positive' | 'negative' | 'neutral') => {
    trackSatisfaction('interaction-id', satisfaction, 'User feedback comment');
  };

  return (
    <>
      {/* Component JSX */}
    </>
  );
}
```

### Performance Monitoring

```typescript
import { useComponentPerformance, measureExecutionTime, useWebVitals } from '@/lib/performanceMonitoring';

export function MyComponent() {
  // Track component render performance
  useComponentPerformance('MyComponent');

  // Track Web Vitals
  const vitals = useWebVitals();

  const fetchData = async () => {
    // Measure async operation
    const data = await measureExecutionTime(
      () => fetchUserData(),
      'fetch_user_data'
    );
    return data;
  };

  return (
    <>
      {/* Component JSX */}
    </>
  );
}
```

### Error Boundary Usage

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

export function App() {
  return (
    <ErrorBoundary
      fallback={<CustomErrorUI />}
      onError={(error, errorInfo) => {
        console.log('Error:', error);
        console.log('Component Stack:', errorInfo.componentStack);
      }}
    >
      <YourComponent />
    </ErrorBoundary>
  );
}
```

## Monitoring Dashboard Views

### In Sentry
- **Issues**: All errors grouped by type
- **Performance**: Slow transactions and DB queries
- **Releases**: Track errors per app version
- **Users**: See affected users and session replay

### In Google Analytics
- **Real-time**: Live user activity
- **Acquisition**: How users find your app
- **Engagement**: Which features are used most
- **Conversions**: Track goal completions (course enrollment, achievements)

## Setting Up Custom Analytics Backend

If you use a custom analytics endpoint, create an API route:

```typescript
// app/api/analytics/events/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const event = await req.json();
  
  // Store event in database
  await db.events.create({
    ...event,
    createdAt: new Date(),
  });

  // Send to your analytics service
  
  return NextResponse.json({ success: true });
}
```

## Key Metrics to Monitor

### User Engagement
- Daily Active Users (DAU)
- Session Duration
- Course Enrollment Rate
- Course Completion Rate

### AI Assistant Performance
- Average Response Time (target: < 2 seconds)
- User Satisfaction Rate (target: > 80% positive feedback)
- Response Quality Issues (slow, incomplete, generic)
- Query Types Distribution

### System Health
- Error Rate (target: < 0.1%)
- Slow Component Renders (> 100ms)
- Web Vitals (LCP, FID, CLS)
- API Error Rates

### Learning Outcomes
- Average Time to First Achievement
- Learning Path Completion Rate
- Skill Proficiency Improvement
- Community Engagement Rate

## Best Practices

1. **Sampling in Production**: Only track 10% of pageviews in production to reduce costs
2. **Data Privacy**: Don't track sensitive data like passwords or API keys
3. **User Consent**: Show privacy policy and get consent before tracking
4. **Regular Review**: Review analytics weekly to identify issues
5. **Alert Thresholds**: Set up alerts for error rate spikes
6. **Version Tracking**: Tag releases in Sentry to correlate errors with deployments

## Troubleshooting

### Sentry not capturing errors
- Check if `NEXT_PUBLIC_SENTRY_DSN` is set correctly
- Verify Sentry project accepts events (check quota)
- Make sure error happens in production (`NODE_ENV === 'production'`)

### Google Analytics not recording events
- Check if `NEXT_PUBLIC_GA_ID` is correct
- Verify Google Analytics 4 is set up (not Universal Analytics)
- Check browser console for GA errors

### Custom analytics endpoint receiving no events
- Verify `NEXT_PUBLIC_ANALYTICS_ENDPOINT` is correct
- Check CORS headers on your backend
- Monitor network tab in DevTools for failed requests

## Next Steps

1. Deploy to production with environment variables configured
2. Create dashboards in Sentry and Google Analytics
3. Set up alerts for critical metrics
4. Review analytics weekly and adjust feature development
5. Iterate on AI assistant quality based on metrics
