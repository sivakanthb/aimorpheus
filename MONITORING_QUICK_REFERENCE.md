# Monitoring Quick Reference Guide

## Common Usage Patterns

### 1. Track User Actions

```typescript
// Track course enrollment
import { analytics } from '@/lib/analytics';

const enrollCourse = async (courseId: string) => {
  // Your enrollment logic
  await enrollInCourse(courseId);
  
  // Track the event
  analytics.trackCourseEnroll(courseId, 'React Fundamentals', 'web-development');
};
```

### 2. Handle Errors with Context

```typescript
import { captureException, addBreadcrumb } from '@/lib/sentry';

const riskyOperation = async () => {
  addBreadcrumb('Starting risky operation', { operation: 'data-sync' });
  
  try {
    const result = await fetchData();
    return result;
  } catch (error) {
    captureException(error as Error, {
      operation: 'data-sync',
      userId: currentUser.id,
    });
    throw error;
  }
};
```

### 3. Monitor AI Interactions

```typescript
import { useAIMetrics, detectAIQualityIssues } from '@/lib/aiMonitoring';

const ChatComponent = () => {
  const { measureInteraction, trackSatisfaction } = useAIMetrics();
  
  const sendQuery = async (query: string) => {
    const start = Date.now();
    const response = await getAIResponse(query);
    
    // Measure performance
    measureInteraction(start, query.length, response.length, 'question');
    
    // Check quality
    const issues = detectAIQualityIssues(query, response, Date.now() - start);
    
    // Get user feedback
    const feedback = await getUserFeedback();
    trackSatisfaction('interaction-id', feedback);
  };
};
```

### 4. Wrap async operations

```typescript
import { measureExecutionTime } from '@/lib/performanceMonitoring';

const fetchUserProfile = async (userId: string) => {
  return measureExecutionTime(
    async () => {
      const response = await fetch(`/api/users/${userId}`);
      return response.json();
    },
    'fetch_user_profile'
  );
};
```

### 5. Prevent errors from breaking UI

```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <ComplexComponent />
</ErrorBoundary>
```

## What Gets Tracked Automatically

✅ **Page Views**
- URL and title
- Session duration
- Referrer

✅ **Errors**
- Stack trace
- User context
- Breadcrumbs
- Session replay (sample)

✅ **Performance**
- Web Vitals (LCP, FID, CLS)
- Slow operations (> 1 second)
- Component render times (> 100ms)

✅ **Web Vitals**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to First Byte (TTFB)

## What You Should Track Manually

### User Engagement
```typescript
analytics.trackCourseEnroll(courseId, courseName, topic);
analytics.trackCourseComplete(courseId, courseName, durationMinutes);
analytics.trackAchievement(achievementId, achievementName);
```

### Feature Usage
```typescript
analytics.trackSearch(query, resultCount);
analytics.trackPathSelection(pathId, pathName, difficulty);
analytics.trackRecommendationClick(recommendationId, type);
```

### Community & Social
```typescript
analytics.trackCommunityEngagement('post', 'discussion');
analytics.trackCommunityEngagement('comment', 'forum');
```

### AI Interactions
```typescript
const { measureInteraction, trackSatisfaction } = useAIMetrics();
measureInteraction(startTime, queryLength, responseLength, 'learning-question');
trackSatisfaction(interactionId, 'positive', 'Very helpful!');
```

## Debugging

### Check if monitoring is working

```typescript
// In browser console
window.gtag // Google Analytics
window.Sentry // Sentry error tracking
```

### View sent events in DevTools
1. Open DevTools Network tab
2. Filter by: `sentry.io`, `analytics.google.com`, or your custom endpoint
3. Check payload for event data

### Test error tracking
```typescript
throw new Error('Test error');
// Should appear in Sentry
```

### Test event tracking
```typescript
import { analytics } from '@/lib/analytics';
analytics.trackEvent('test_event', { category: 'debug' });
// Should appear in Google Analytics
```

## Environment Variables Needed

```env
# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Optional
NEXT_PUBLIC_ANALYTICS_ENDPOINT=https://your-backend.com/api/events
NEXT_PUBLIC_AI_MODEL_VERSION=v1.0.0
```

## Key Decisions

### Sample Rate
- **Production**: 10% (cost control)
- **Staging**: 50% (better visibility)
- **Development**: 100% (full data)

### Capture User Data
- ✅ User ID
- ✅ Email (if anonymous OK)
- ✅ Plan tier
- ❌ Passwords
- ❌ API keys
- ❌ Sensitive PII

### Response Time Thresholds
- **Good**: < 1 second
- **Acceptable**: 1-2 seconds
- **Needs Review**: 2-3 seconds
- **Slow**: > 3 seconds

## Integration Checklist

- [ ] Install dependencies: `npm install @sentry/nextjs web-vitals`
- [ ] Copy `.env.monitoring.example` to `.env.local`
- [ ] Add Sentry DSN to environment
- [ ] Add Google Analytics ID
- [ ] Verify layout.tsx has ErrorBoundary
- [ ] Test error tracking: throw test error
- [ ] Test event tracking: use DevTools Network tab
- [ ] Deploy with env variables configured
- [ ] Monitor Sentry and Analytics dashboards daily
- [ ] Set up alerts for error spikes

## Next: Advanced Monitoring

- Set up custom dashboards in Sentry
- Create attribution reports in GA
- Monitor AI quality metrics daily
- Set up alerts for % error increase
- Weekly review of learning metrics
