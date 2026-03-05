/**
 * AI Assistant Quality Monitoring
 * Tracks AI response quality, user satisfaction, and interaction patterns
 */

interface AIInteractionMetrics {
  queryLength: number;
  responseTime: number;
  responseLength: number;
  userSatisfaction?: 'positive' | 'negative' | 'neutral';
  queryType?: string;
  modelVersion?: string;
}

interface AISessionMetrics {
  totalInteractions: number;
  averageResponseTime: number;
  averageQueryLength: number;
  userSatisfactionRate: number;
  sessionDuration: number;
}

/**
 * Track AI Assistant interaction and monitor quality
 */
export const trackAIAssistantInteraction = async (metrics: AIInteractionMetrics) => {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) return;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/ai-interaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...metrics,
        timestamp: new Date().toISOString(),
        url: typeof window !== 'undefined' ? window.location.href : '',
      }),
      keepalive: true,
    });

    if (!response.ok) {
      console.warn('Failed to track AI interaction:', response.statusText);
    }
  } catch (error) {
    console.warn('Error tracking AI interaction:', error);
  }
};

/**
 * Track user satisfaction with AI response
 */
export const trackAISatisfaction = async (
  interactionId: string,
  satisfaction: 'positive' | 'negative' | 'neutral',
  feedback?: string
) => {
  if (!process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT) return;

  try {
    await fetch(`${process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT}/ai-satisfaction`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        interactionId,
        satisfaction,
        feedback,
        timestamp: new Date().toISOString(),
      }),
      keepalive: true,
    });
  } catch (error) {
    console.warn('Error tracking AI satisfaction:', error);
  }
};

/**
 * Hook to measure AI response time and quality
 */
export const useAIMetrics = () => {
  const measureInteraction = (
    startTime: number,
    queryLength: number,
    responseLength: number,
    queryType?: string
  ) => {
    const responseTime = Date.now() - startTime;

    trackAIAssistantInteraction({
      queryLength,
      responseTime,
      responseLength,
      queryType,
      modelVersion: process.env.NEXT_PUBLIC_AI_MODEL_VERSION,
    });

    return {
      responseTime,
      queryLength,
      responseLength,
    };
  };

  return {
    measureInteraction,
    trackSatisfaction: trackAISatisfaction,
  };
};

/**
 * Utility to detect response quality issues
 */
export const detectAIQualityIssues = (
  query: string,
  response: string,
  responseTime: number
): string[] => {
  const issues: string[] = [];

  // Check response time threshold (>5 seconds)
  if (responseTime > 5000) {
    issues.push('slow_response');
  }

  // Check for empty or very short responses
  if (response.trim().length < 20) {
    issues.push('insufficient_response');
  }

  // Check for error indicators in response
  if (response.toLowerCase().includes('error') || response.toLowerCase().includes('unable')) {
    issues.push('potential_error');
  }

  // Check if response is too generic
  if (
    response.toLowerCase().includes('i can help') ||
    response.toLowerCase().includes('please provide more information')
  ) {
    if (response.length < 100) {
      issues.push('generic_response');
    }
  }

  return issues;
};
