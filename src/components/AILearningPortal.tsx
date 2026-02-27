'use client';

import { useState } from 'react';
import type { UserRequirements, RecommendationResult } from '@/types';
import OnboardingForm from './OnboardingForm';
import RecommendationsDisplay from './RecommendationsDisplay';
import { recommendPaths } from '@/lib/recommendations';
import { learningPaths } from '@/lib/learningPaths';

export default function AILearningPortal() {
  const [stage, setStage] = useState<'onboarding' | 'recommendations'>('onboarding');
  const [recommendations, setRecommendations] = useState<RecommendationResult | null>(null);
  const [userRequirements, setUserRequirements] = useState<UserRequirements | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = (requirements: UserRequirements) => {
    setIsLoading(true);
    // Simulate processing time
    setTimeout(() => {
      setUserRequirements(requirements);
      const result = recommendPaths(requirements, learningPaths);
      setRecommendations(result);
      setStage('recommendations');
      setIsLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setStage('onboarding');
    setRecommendations(null);
    setUserRequirements(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 py-6 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Logo/Header - Centered */}
        <div className="text-center mb-8">
          <div className="inline-block mb-2">
            <span className="text-5xl">⚡</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">
            AIMorpheus
          </h1>
          <p className="text-lg font-semibold text-gray-200 mb-1">Master the Future of Intelligence</p>
          <p className="text-sm text-gray-300 max-w-xl mx-auto">
            Your personalized journey to mastering artificial intelligence
          </p>
        </div>

        {/* Inspirational Opening */}
        {stage === 'onboarding' && (
          <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-2xl p-5 mb-6 border border-purple-500/40 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-2">🌍 The AI Revolution is Here</h2>
            <p className="text-sm text-blue-50 leading-relaxed mb-3">
              Artificial Intelligence is reshaping every industry at an unprecedented pace. From healthcare and finance to creative arts and scientific research, AI is fundamentally changing how we work, learn, and innovate. The world doesn't wait, and neither should you.
            </p>
            <p className="text-sm text-blue-50 leading-relaxed mb-4">
              The future belongs to those who can adapt, learn, and grow with technology. Whether you're a complete novice or an experienced professional, now is the perfect time to upskill and join the AI revolution. Every expert was once a beginner.
            </p>
            <div className="border-t border-purple-500/50 pt-3 mt-3">
              <p className="text-sm font-semibold text-cyan-300">
                ✨ We wish you all the very best on your AI learning journey! Stay curious, keep experimenting, and remember—every step forward counts. 🚀
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        {stage === 'onboarding' ? (
          <div className="max-w-xl mx-auto">
            <OnboardingForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          </div>
        ) : recommendations && userRequirements ? (
          <RecommendationsDisplay
            result={recommendations}
            requirements={userRequirements}
            onReset={handleReset}
          />
        ) : null}
      </div>
    </main>
  );
}
