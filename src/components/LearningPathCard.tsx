'use client';

import type { LearningPath } from '@/types';

interface LearningPathCardProps {
  path: LearningPath;
  isRecommended?: boolean;
  onSelect?: (path: LearningPath) => void;
}

export default function LearningPathCard({ path, isRecommended = false, onSelect }: LearningPathCardProps) {
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      case 'advanced':
        return 'bg-orange-100 text-orange-800';
      case 'expert':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      className={`rounded-xl shadow-lg overflow-hidden transition-all hover:shadow-xl border-2 ${
        isRecommended ? 'border-cyan-300 bg-white/15' : 'border-white/20 bg-white/10 hover:bg-white/15'
      } backdrop-blur-md`}
    >
      {isRecommended && (
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-3 py-1.5 shadow-lg shadow-cyan-500/50">
          <span className="font-semibold text-sm">⭐ RECOMMENDED FOR YOU</span>
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-white flex-1">{path.title}</h3>
          <span
            className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getDifficultyStyles(
              path.difficulty
            )}`}
          >
            {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
          </span>
        </div>

        <p className="text-white text-xs mb-2">{path.description}</p>

        <p className="text-white/80 text-xs mb-3 line-clamp-2">{path.overview}</p>

        <div className="space-y-2 mb-3">
          <div className="flex items-center text-xs text-white">
            <span className="font-semibold mr-1">📚 Duration:</span>
            <span>{path.estimatedHours} hours</span>
          </div>

          <div className="flex items-start text-xs text-white">
            <span className="font-semibold mr-1 mt-0.5">🎯 Skills:</span>
            <div className="flex flex-wrap gap-0.5">
              {path.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="bg-gray-200 px-2 py-1 rounded text-xs">
                  {skill}
                </span>
              ))}
              {path.skills.length > 3 && (
                <span className="bg-gray-200 px-2 py-1 rounded text-xs">+{path.skills.length - 3}</span>
              )}
            </div>
          </div>

          <div className="text-xs text-white">
            <span className="font-semibold">📊 Modules:</span>
            <div className="mt-1 space-y-0.5">
              {path.modules.slice(0, 3).map((module) => (
                <div key={module.id} className="flex justify-between text-xs text-gray-400">
                  <span className="truncate">{module.title}</span>
                  <span className="ml-1">({module.duration}h)</span>
                </div>
              ))}
              {path.modules.length > 3 && (
                <div className="text-xs text-gray-400">+{path.modules.length - 3} modules</div>
              )}
            </div>
          </div>
        </div>

        {path.matchScore !== undefined && (
          <div className="mb-3 p-2 bg-white/15 rounded-lg border border-white/20">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-200">Match:</span>
              <div className="flex items-center gap-1">
                <div className="w-16 h-1.5 bg-slate-700 rounded-full">
                  <div
                    className="h-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full transition-all shadow-lg shadow-cyan-500/50"
                    style={{ width: `${path.matchScore}%` }}
                  ></div>
                </div>
                <span className="text-xs font-bold text-cyan-200">{path.matchScore}%</span>
              </div>
            </div>
          </div>
        )}

        {onSelect && (
          <button
            onClick={() => onSelect(path)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-1.5 px-3 rounded-lg transition-all shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 text-sm"
          >
            View Path
          </button>
        )}
      </div>
    </div>
  );
}
