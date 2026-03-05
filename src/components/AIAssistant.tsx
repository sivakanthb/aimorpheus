'use client';

import { useState, useRef, useEffect } from 'react';
import AIAssistantChat from './AIAssistantChat';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string }>>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hey there! 👋 I\'m your AI Learning Assistant. I\'m here to help you navigate your learning journey, answer questions about courses, and guide you toward your goals. What can I help you with today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const chatRef = useRef<HTMLDivElement>(null);

  const initialMessage = {
    id: '1',
    role: 'assistant' as const,
    content: 'Hey there! 👋 I\'m your AI Learning Assistant. I\'m here to help you navigate your learning journey, answer questions about courses, and guide you toward your goals. What can I help you with today?',
    timestamp: new Date().toISOString(),
  };

  const handleToggleChat = () => {
    if (isOpen) {
      // Closing the chat - reset conversation to initial state
      setMessages([initialMessage]);
    }
    setIsOpen(!isOpen);
  };

  // Get smart response based on user input
  const getAssistantResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    // Learning path questions
    if (lowerMessage.includes('recommend') || lowerMessage.includes('what should i learn')) {
      return '🎯 I\'d recommend checking your dashboard for personalized recommendations based on your preferences. You can also use the search bar to browse courses by difficulty level (beginner, intermediate, advanced) or topic. What area interests you most?';
    }

    if (lowerMessage.includes('how') && (lowerMessage.includes('enroll') || lowerMessage.includes('start'))) {
      return '📚 To enroll in a course: 1) Use the search bar or browse the dashboard, 2) Click on any course to see details, 3) Click the "Enroll" button, 4) Track your progress on the dashboard. Simple as that! Want help finding a specific course?';
    }

    if (lowerMessage.includes('progress') || lowerMessage.includes('track')) {
      return '📊 Your progress is tracked automatically! Check your dashboard to see: completed courses, modules in progress, achievements earned, and learning streaks. The more you learn, the more badges you unlock! 🏆';
    }

    if (lowerMessage.includes('achievement') || lowerMessage.includes('badge')) {
      return '🏅 Badges are earned by reaching milestones! You can view all your earned achievements and certificates on your profile. Keep learning to unlock more badges like "First Step", "Course Master", and "Learning Legend"!';
    }

    if (lowerMessage.includes('certificate')) {
      return '📜 When you complete a full learning path, you\'ll earn a certificate! You can view and download all your certificates from your profile. Each certificate has a unique number to verify your accomplishment.';
    }

    if (lowerMessage.includes('difficult') || lowerMessage.includes('stuck') || lowerMessage.includes('help')) {
      return '💡 If you\'re stuck on a concept: 1) Check the Resources page for helpful blog articles and tutorials, 2) Review the course modules step-by-step, 3) Update your preferences if you need easier or harder content. You\'ve got this! 💪';
    }

    if (lowerMessage.includes('preference') || lowerMessage.includes('change goal') || lowerMessage.includes('update')) {
      return '⚙️ You can update your learning preferences anytime! Just click the user menu (top-right) → "Edit Preferences". Adjust your goals, available time, and learning style to get fresh recommendations.';
    }

    if (lowerMessage.includes('search')) {
      return '🔍 The search bar (top navigation) lets you find courses instantly! Type a course name or topic, filter by difficulty, and click any result to view details. Try searching for "machine learning" or "python" to get started!';
    }

    if (lowerMessage.includes('notification')) {
      return '🔔 The notification bell (top-right) keeps you updated! You\'ll get notifications for: new recommendations, course completions, achievements earned, and enrollment confirmations. Click the bell to see all your notifications.';
    }

    if (lowerMessage.includes('unenroll') || lowerMessage.includes('drop course')) {
      return '❌ To unenroll from a course: Go to your dashboard, find the course you want to leave, and click "Unenroll". A confirmation popup will appear. No problem if you change your mind – you can always re-enroll later!';
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return '👋 Hello! Great to see you here. I\'m your AI Learning Assistant, ready to help. Are you looking for course recommendations, navigation help, or have questions about your progress?';
    }

    if (lowerMessage.includes('thanks') || lowerMessage.includes('thank you')) {
      return '😊 You\'re welcome! I\'m always here if you need more help. Keep up the great work with your learning! 🚀';
    }

    // Default helpful response
    return '💭 Great question! Here\'s what I can help with: finding courses, understanding your progress, earning achievements, updating preferences, navigating features, and learning tips. What would you like to know more about?';
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: `msg-${Date.now()}`,
      role: 'user' as const,
      content,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Simulate assistant typing and response
    setTimeout(() => {
      const assistantMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant' as const,
        content: getAssistantResponse(content),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={handleToggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all z-40 ${
          isOpen
            ? 'bg-purple-600 border border-purple-500'
            : 'bg-gradient-to-br from-purple-600 to-blue-600 border border-purple-500/50 hover:shadow-xl hover:scale-110'
        }`}
        title="AI Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && <AIAssistantChat messages={messages} onSendMessage={handleSendMessage} />}
    </>
  );
}
