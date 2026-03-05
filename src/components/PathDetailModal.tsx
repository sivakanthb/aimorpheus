'use client';

import { useState } from 'react';
import type { LearningPath, User } from '@/types';
import CourseReviews from './CourseReviews';
import DiscussionForum from './DiscussionForum';

interface PathDetailModalProps {
  path: LearningPath;
  currentUser?: User;
  onClose: () => void;
}

export default function PathDetailModal({ path, currentUser, onClose }: PathDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'discussions'>('overview');
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'text-emerald-400';
      case 'intermediate':
        return 'text-blue-400';
      case 'advanced':
        return 'text-orange-400';
      case 'expert':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-3 sm:p-4 backdrop-blur-sm">
      <div className="bg-slate-800/80 rounded-lg shadow-xl w-full max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto border border-slate-700/60">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-4 sm:p-5 sticky top-0 flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-blue-100/80 text-xs font-semibold mb-1">AIMorpheus Learning Path</p>
            <h2 className="text-xl sm:text-2xl font-bold mb-1 break-words">{path.title}</h2>
            <p className="text-blue-100/70 text-xs sm:text-sm line-clamp-2">{path.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 text-xl ml-2 font-bold flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-700/50">
            {(['overview', 'reviews', 'discussions'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-2 text-sm font-semibold capitalize transition-all border-b-2 ${
                  activeTab === tab
                    ? 'text-cyan-300 border-cyan-400'
                    : 'text-slate-400 hover:text-slate-300 border-transparent'
                }`}
              >
                {tab === 'overview' && '📖 Overview'}
                {tab === 'reviews' && '⭐ Reviews'}
                {tab === 'discussions' && '💬 Discussions'}
              </button>
            ))}
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <>
              <section>
                <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Overview</h3>
                <p className="text-gray-300 text-xs sm:text-sm">{path.overview}</p>
              </section>

              <section>
                <h3 className="text-sm font-bold text-cyan-300/80 mb-2">Key Information</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="bg-slate-700/50 p-3 sm:p-2 rounded-lg border border-slate-600/40">
                    <p className="text-xs text-gray-400 mb-0.5">Difficulty</p>
                    <p className={`text-sm font-bold ${getDifficultyColor(path.difficulty)}`}>
                      {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                    </p>
                  </div>
                  <div className="bg-slate-700/50 p-3 sm:p-2 rounded-lg border border-slate-600/40">
                    <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                    <p className="text-sm font-bold text-blue-300">{path.estimatedHours}h</p>
                  </div>
                  <div className="bg-slate-700/50 p-3 sm:p-2 rounded-lg border border-slate-600/40">
                    <p className="text-xs text-gray-400 mb-0.5">Timeline</p>
                    <p className="text-sm font-bold text-emerald-300">~{Math.ceil(path.estimatedHours / 15)}w</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Who Should Take This?</h3>
                <p className="text-gray-300 text-xs sm:text-sm">{path.targetAudience}</p>
              </section>

              {path.prerequisites.length > 0 && (
                <section>
                  <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Prerequisites</h3>
                  <ul className="space-y-0.5">
                    {path.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-xs">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mr-2"></span>
                        {prereq}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              <section>
                <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Skills You'll Learn</h3>
                <div className="flex flex-wrap gap-1">
                  {path.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-slate-700/50 text-blue-300/80 px-2 py-0.5 rounded-full text-xs border border-slate-600/40"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Course Modules</h3>
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {path.modules.map((module, idx) => (
                    <div key={module.id} className="bg-slate-700/40 p-2 rounded border border-slate-600/40">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-gray-200 text-xs">
                            Module {idx + 1}: {module.title}
                          </div>
                          <p className="text-xs text-gray-400 mt-0.5">{module.description}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span
                          className={`text-xs font-semibold ${
                            module.difficulty === 'beginner'
                              ? 'text-emerald-400'
                              : module.difficulty === 'intermediate'
                                ? 'text-blue-400'
                                : 'text-orange-400'
                          }`}
                        >
                          {module.difficulty.charAt(0).toUpperCase() + module.difficulty.slice(1)}
                        </span>
                        <span className="text-xs font-medium text-gray-300">
                          ⏱️ {module.duration}h
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Best For These Interests</h3>
                <div className="flex flex-wrap gap-1">
                  {path.interests.map((interest) => (
                    <span
                      key={interest}
                      className="bg-slate-700/50 text-pink-300/80 px-2 py-0.5 rounded-full text-xs border border-slate-600/40"
                    >
                      {interest.charAt(0).toUpperCase() + interest.slice(1)}
                    </span>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Reviews Tab */}
          {activeTab === 'reviews' && (
            <section>
              <h3 className="text-sm font-bold text-cyan-300/80 mb-3">Community Reviews</h3>
              {currentUser ? (
                <CourseReviews courseId={path.id} currentUser={currentUser} />
              ) : (
                <p className="text-slate-400 text-sm py-8 text-center">Please login to view and write reviews</p>
              )}
            </section>
          )}

          {/* Discussions Tab */}
          {activeTab === 'discussions' && (
            <section>
              {currentUser ? (
                <DiscussionForum pathId={path.id} pathTitle={path.title} currentUser={currentUser} />
              ) : (
                <p className="text-slate-400 text-sm py-8 text-center">Please login to participate in discussions</p>
              )}
            </section>
          )}

          {/* Divider */}
          <div className="border-t border-slate-700/50 my-4"></div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700/60 hover:bg-slate-600/60 text-gray-300 font-semibold py-3 sm:py-2 px-3 rounded-lg transition-colors border border-slate-600 text-sm min-h-12 sm:min-h-auto"
            >
              ← Back
            </button>
            <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-3 sm:py-2 px-3 rounded-lg transition-all shadow-md text-sm min-h-12 sm:min-h-auto">
              🚀 Start Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
