'use client';

import type { LearningPath } from '@/types';

interface PathDetailModalProps {
  path: LearningPath;
  onClose: () => void;
}

export default function PathDetailModal({ path, onClose }: PathDetailModalProps) {
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
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-slate-800/80 rounded-lg shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto border border-slate-700/60">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-5 sticky top-0 flex justify-between items-start">
          <div className="flex-1">
            <p className="text-blue-100/80 text-xs font-semibold mb-1">AIMorpheus Learning Path</p>
            <h2 className="text-2xl font-bold mb-1">{path.title}</h2>
            <p className="text-blue-100/70 text-sm">{path.description}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-blue-100 text-xl ml-4 font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Overview */}
          <section>
            <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Overview</h3>
            <p className="text-gray-300 text-xs">{path.overview}</p>
          </section>

          {/* Key Information */}
          <section>
            <h3 className="text-sm font-bold text-cyan-300/80 mb-2">Key Information</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <div className="bg-slate-700/50 p-2 rounded-lg border border-slate-600/40">
                <p className="text-xs text-gray-400 mb-0.5">Difficulty</p>
                <p className={`text-sm font-bold ${getDifficultyColor(path.difficulty)}`}>
                  {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
                </p>
              </div>
              <div className="bg-slate-700/50 p-2 rounded-lg border border-slate-600/40">
                <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                <p className="text-sm font-bold text-blue-300">{path.estimatedHours}h</p>
              </div>
              <div className="bg-slate-700/50 p-2 rounded-lg border border-slate-600/40">
                <p className="text-xs text-gray-400 mb-0.5">Timeline</p>
                <p className="text-sm font-bold text-emerald-300">~{Math.ceil(path.estimatedHours / 15)}w</p>
              </div>
            </div>
          </section>

          {/* Target Audience */}
          <section>
            <h3 className="text-sm font-bold text-cyan-300/80 mb-1">Who Should Take This?</h3>
            <p className="text-gray-300 text-xs">{path.targetAudience}</p>
          </section>

          {/* Prerequisites */}
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

          {/* Skills You'll Learn */}
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

          {/* Modules */}
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

          {/* Learning Interests */}
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

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-slate-700/50">
            <button
              onClick={onClose}
              className="flex-1 bg-slate-700/60 hover:bg-slate-600/60 text-gray-300 font-semibold py-2 px-3 rounded-lg transition-colors border border-slate-600 text-sm"
            >
              ← Back
            </button>
            <button className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2 px-3 rounded-lg transition-all shadow-md text-sm">
              🚀 Start Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
