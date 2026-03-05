'use client';

import { useState } from 'react';
import { LearningPath } from '@/types';

interface SearchBarProps {
  paths: LearningPath[];
  onSelectPath: (pathId: string) => void;
}

export default function SearchBar({ paths, onSelectPath }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredPaths = paths.filter((path) => {
    const matchesQuery = path.title.toLowerCase().includes(query.toLowerCase()) ||
      path.description.toLowerCase().includes(query.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || path.difficulty === difficultyFilter;
    return matchesQuery && matchesDifficulty;
  });

  const handleSelectPath = (pathId: string) => {
    setQuery('');
    setShowResults(false);
    onSelectPath(pathId);
  };

  return (
    <div className="flex-1 max-w-md mx-2 sm:mx-4 relative">
      <div className="relative">
        <div className="flex items-center gap-2 bg-slate-700/40 border border-slate-600/50 rounded-lg px-3 py-2 sm:py-2 hover:border-slate-500/70 transition-all focus-within:border-cyan-500/50 focus-within:bg-slate-700/60 min-h-10 sm:min-h-auto">
          <span className="text-slate-400 text-lg">🔍</span>
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowResults(true);
            }}
            onFocus={() => setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            className="flex-1 bg-transparent text-slate-200 text-xs sm:text-sm placeholder-slate-500 outline-none"
          />
        </div>

        {/* Search Results Dropdown */}
        {showResults && query && (
          <div className="absolute top-full mt-2 left-0 right-0 bg-slate-800 border border-slate-700/60 rounded-lg shadow-xl z-40 max-h-96 overflow-y-auto backdrop-blur-sm">
            {/* Filter Bar */}
            <div className="sticky top-0 bg-slate-800/95 border-b border-slate-700/40 p-2 sm:p-3 flex gap-1 sm:gap-2 overflow-x-auto">
              <button
                onClick={() => setDifficultyFilter('all')}
                className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold transition-all whitespace-nowrap min-h-9 sm:min-h-auto flex items-center ${
                  difficultyFilter === 'all'
                    ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:text-slate-300'
                }`}
              >
                All
              </button>
              {['beginner', 'intermediate', 'advanced'].map((diff) => (
                <button
                  key={diff}
                  onClick={() => setDifficultyFilter(diff)}
                  className={`px-2 sm:px-3 py-1 rounded text-xs font-semibold transition-all capitalize whitespace-nowrap min-h-9 sm:min-h-auto flex items-center ${
                    difficultyFilter === diff
                      ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300'
                      : 'bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Results */}
            {filteredPaths.length > 0 ? (
              <div className="divide-y divide-slate-700/40">
                {filteredPaths.slice(0, 8).map((path) => (
                  <button
                    key={path.id}
                    onClick={() => handleSelectPath(path.id)}
                    className="w-full text-left px-3 sm:px-4 py-3 sm:py-2 hover:bg-slate-700/50 transition-colors flex items-start gap-3 group min-h-14 sm:min-h-auto justify-start"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-1">
                        {path.title}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-1">{path.description}</p>
                      <div className="flex gap-2 mt-1 flex-wrap">
                        <span className="text-xs px-2 py-0.5 bg-slate-700/50 text-slate-300 rounded capitalize">
                          {path.difficulty}
                        </span>
                        <span className="text-xs text-slate-500">⏱️ {path.estimatedHours}h</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs sm:text-sm">
                No courses found matching "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
