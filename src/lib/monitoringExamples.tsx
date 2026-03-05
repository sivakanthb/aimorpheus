/**
 * Example Integration: Monitoring in AIAssistantChat
 * 
 * This file demonstrates how to integrate monitoring and analytics
 * into your existing components. Copy these patterns to other components.
 */

'use client';

import { useState } from 'react';
import { analytics } from '@/lib/analytics';
import { useAIMetrics, detectAIQualityIssues } from '@/lib/aiMonitoring';
import { captureException, addBreadcrumb } from '@/lib/sentry';
import { useComponentPerformance } from '@/lib/performanceMonitoring';

/**
 * Example implementation with monitoring
 */
export function AIAssistantChatWithMonitoring() {
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Initialize monitoring
  const { measureInteraction, trackSatisfaction } = useAIMetrics();
  useComponentPerformance('AIAssistantChat');

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    addBreadcrumb('User sent AI query', { queryLength: query.length });
    const startTime = Date.now();

    try {
      setLoading(true);

      // Call your AI API
      const response = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.response;

      // Update messages
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: query },
        { role: 'assistant', content: aiResponse },
      ]);

      // Measure interaction quality
      const responseTime = Date.now() - startTime;
      measureInteraction(
        startTime,
        query.length,
        aiResponse.length,
        'learning-question'
      );

      // Detect quality issues
      const issues = detectAIQualityIssues(query, aiResponse, responseTime);
      if (issues.length > 0) {
        addBreadcrumb('AI Quality Issues Detected', {
          issues: issues.join(', '),
          responseTime,
        });

        // Track quality issues
        analytics.trackEvent('ai_quality_issue', {
          issues: issues.join(','),
          responseTime,
          queryLength: query.length,
        });
      }

      // Track successful interaction
      analytics.trackAIInteraction('learning-question', query.length, responseTime);

      setQuery('');
    } catch (error) {
      // Capture error to Sentry
      captureException(error as Error, {
        query,
        previousMessages: messages.length,
        context: 'AI Chat Interaction',
      });

      // Track error event
      analytics.trackEvent('ai_error', {
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        query: query.substring(0, 100), // Log first 100 chars only
      });

      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = (satisfaction: 'positive' | 'negative' | 'neutral') => {
    const lastMessage = messages[messages.length - 1];
    
    // Track user satisfaction
    trackSatisfaction('last-interaction', satisfaction);

    // Track engagement
    analytics.trackEvent('ai_feedback', {
      satisfaction,
      messageCount: messages.length,
    });

    // Add breadcrumb for debugging
    addBreadcrumb('User provided AI feedback', {
      satisfaction,
      messageCount: messages.length,
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Section (shown after last message) */}
      {messages.length > 0 && messages[messages.length - 1]?.role === 'assistant' && (
        <div className="px-4 py-2 border-t flex gap-2">
          <button
            onClick={() => handleFeedback('positive')}
            className="px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm"
          >
            👍 Helpful
          </button>
          <button
            onClick={() => handleFeedback('negative')}
            className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm"
          >
            👎 Not Helpful
          </button>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t p-4 flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask me anything about your learning path..."
          disabled={loading}
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleSendMessage}
          disabled={loading || !query.trim()}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

/**
 * Example: Monitoring Course Completion
 */
export function CourseCompletionExample() {
  const completeLesson = async (lessonId: string, lessonName: string) => {
    const startTime = Date.now();

    try {
      addBreadcrumb('Lesson completion started', { lessonId, lessonName });

      // Complete lesson logic
      const response = await fetch('/api/lessons/complete', {
        method: 'POST',
        body: JSON.stringify({ lessonId }),
      });

      const duration = (Date.now() - startTime) / 60000; // Convert to minutes

      // Track course completion
      analytics.trackCourseComplete(lessonId, lessonName, Math.round(duration));

      addBreadcrumb('Lesson completed successfully', {
        lessonId,
        duration: `${duration.toFixed(2)} minutes`,
      });
    } catch (error) {
      captureException(error as Error, {
        lessonId,
        lessonName,
        context: 'Lesson Completion',
      });
    }
  };

  return (
    <button onClick={() => completeLesson('lesson-1', 'React Hooks Basics')}>
      Mark as Complete
    </button>
  );
}

/**
 * Example: Monitoring Learning Path Selection
 */
export function LearningPathSelectionExample() {
  const selectLearningPath = (pathId: string, pathName: string, difficulty: string) => {
    try {
      analytics.trackPathSelection(pathId, pathName, difficulty);
      addBreadcrumb('Learning path selected', { pathId, pathName, difficulty });

      // Navigate to path
      window.location.href = `/learning-path/${pathId}`;
    } catch (error) {
      captureException(error as Error, {
        pathId,
        pathName,
      });
    }
  };

  return (
    <button onClick={() => selectLearningPath('path-1', 'Full Stack Developer', 'intermediate')}>
      Start Learning Path
    </button>
  );
}

/**
 * Example: Monitoring Search
 */
export function SearchWithMonitoring() {
  const handleSearch = async (query: string) => {
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const results = await response.json();

      // Track search event
      analytics.trackSearch(query, results.length);

      return results;
    } catch (error) {
      captureException(error as Error, {
        searchQuery: query,
        context: 'Search Operation',
      });
    }
  };

  return (
    <input
      type="text"
      placeholder="Search courses..."
      onChange={(e) => handleSearch(e.target.value)}
    />
  );
}
