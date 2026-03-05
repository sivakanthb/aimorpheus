'use client';

import type { LearningPath } from '@/types';

interface LearningPathCardProps {
  path: LearningPath;
  isRecommended?: boolean;
  isBookmarked?: boolean;
  onSelect?: (path: LearningPath) => void;
  onToggleBookmark?: (pathId: string) => void;
}

export default function LearningPathCard({ 
  path, 
  isRecommended = false, 
  isBookmarked = false,
  onSelect, 
  onToggleBookmark 
}: LearningPathCardProps) {
  const getDifficultyStyles = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
      case 'intermediate':
        return 'bg-blue-500/20 text-blue-300 border border-blue-500/40';
      case 'advanced':
        return 'bg-orange-500/20 text-orange-300 border border-orange-500/40';
      case 'expert':
        return 'bg-red-500/20 text-red-300 border border-red-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border border-slate-500/40';
    }
  };

  const getMatchColor = (score: number): string => {
    if (score >= 85) return 'from-emerald-500 to-cyan-500';
    if (score >= 70) return 'from-blue-500 to-cyan-500';
    if (score >= 50) return 'from-yellow-500 to-blue-500';
    return 'from-orange-500 to-red-500';
  };

  return (
    <div
      className={`rounded-xl overflow-hidden transition-all border ${
        isRecommended
          ? 'border-cyan-500/60 bg-gradient-to-br from-slate-700/40 to-slate-800/40 hover:border-cyan-400/80'
          : 'border-slate-700/60 bg-gradient-to-br from-slate-800/40 to-slate-900/40 hover:border-slate-600/80'
      } backdrop-blur-sm hover:shadow-xl shadow-lg`}
    >
      {isRecommended && (
        <div className="bg-gradient-to-r from-cyan-600/80 to-blue-600/80 text-cyan-100 px-4 py-2 shadow-lg">
          <span className="font-bold text-sm">⭐ RECOMMENDED FOR YOU</span>
        </div>
      )}

      <div className="p-4 sm:p-6">
        {/* Header: Title + Difficulty + Bookmark */}
        <div className="flex items-start justify-between mb-3 gap-2 sm:gap-3">
          <h3 className="text-lg sm:text-2xl font-bold text-slate-100 flex-1 line-clamp-2">{path.title}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {onToggleBookmark && (
              <button
                onClick={() => onToggleBookmark(path.id)}
                className="p-2.5 sm:p-2 rounded-lg transition-all hover:bg-slate-700/50 active:scale-95 min-h-10 min-w-10 flex items-center justify-center"
                title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
              >
                <span className="text-lg sm:text-xl">{isBookmarked ? '⭐' : '☆'}</span>
              </button>
            )}
            <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getDifficultyStyles(path.difficulty)}`}>
              {path.difficulty.charAt(0).toUpperCase() + path.difficulty.slice(1)}
            </span>
          </div>
        </div>

        {/* Description */}
        <p className="text-slate-300 text-xs sm:text-sm mb-4 leading-relaxed line-clamp-3">{path.description}</p>

        {/* Duration */}
        <div className="flex items-center gap-2 text-slate-200 text-xs sm:text-sm font-semibold mb-4">
          <span>📚</span>
          <span>Duration: <span className="text-cyan-300">{path.estimatedHours} hours</span></span>
        </div>

        {/* Skills */}
        <div className="mb-4">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span>🎯</span> Skills:
          </label>
          <div className="flex flex-wrap gap-2">
            {path.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-slate-700/60 border border-slate-600/40 text-slate-200 rounded-lg text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Modules */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wide mb-2 flex items-center gap-1.5">
            <span>📋</span> Modules:
          </label>
          <div className="space-y-1.5">
            {path.modules.slice(0, 4).map((module) => (
              <div key={module.id} className="flex items-center justify-between text-sm text-slate-300 px-2 py-1.5 bg-slate-800/30 rounded border border-slate-700/30">
                <span className="text-slate-200 font-medium">{module.title}</span>
                <span className="text-slate-400 text-xs">({module.duration}h)</span>
              </div>
            ))}
            {path.modules.length > 4 && (
              <div className="text-xs text-slate-400 font-semibold px-2 py-1">
                +{path.modules.length - 4} more module{path.modules.length - 4 !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>

        {/* Match Score */}
        {path.matchScore !== undefined && (
          <div className="mb-5 px-3 py-3 bg-slate-800/50 rounded-lg border border-slate-700/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Match:</span>
              <span className={`text-lg font-bold bg-gradient-to-r ${getMatchColor(path.matchScore)} bg-clip-text text-transparent`}>
                {path.matchScore}%
              </span>
            </div>
            <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden border border-slate-600/30">
              <div
                className={`h-full bg-gradient-to-r ${getMatchColor(path.matchScore)} transition-all shadow-lg`}
                style={{ width: `${path.matchScore}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* View Path Button */}
        {onSelect && (
          <button
            onClick={() => onSelect(path)}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-2.5 px-4 rounded-lg transition-all shadow-lg hover:shadow-xl text-sm uppercase tracking-wide"
          >
            View Path
          </button>
        )}
      </div>
    </div>
  );
}
