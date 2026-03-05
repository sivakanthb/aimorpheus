'use client';

import { useState } from 'react';
import type { LearningPath, SkillLevel } from '@/types';
import LearningPathCard from './LearningPathCard';

interface ExploreCoursesBySkillProps {
  currentSkillLevel: SkillLevel;
  allPaths: LearningPath[];
  bookmarkedPathIds?: string[];
  onSelectPath: (pathId: string) => void;
  onToggleBookmark?: (pathId: string) => void;
}

export default function ExploreBySkill({
  currentSkillLevel,
  allPaths,
  bookmarkedPathIds = [],
  onSelectPath,
  onToggleBookmark,
}: ExploreCoursesBySkillProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<SkillLevel | 'all'>(currentSkillLevel);

  // Filter paths by difficulty
  const filteredPaths = selectedDifficulty === 'all'
    ? allPaths
    : allPaths.filter((path) => path.difficulty === selectedDifficulty);

  const difficultyLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];

  return (
    <div className="mb-12">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">
          Explore Learning Paths
        </h2>
        <p className="text-slate-400">
          Discover courses tailored to your skill level and interests
        </p>
      </div>

      {/* Difficulty Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setSelectedDifficulty('all')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            selectedDifficulty === 'all'
              ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300'
              : 'bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:text-slate-300 hover:border-slate-500/50'
          }`}
        >
          All Levels
        </button>

        {difficultyLevels.map((level) => (
          <button
            key={level}
            onClick={() => setSelectedDifficulty(level)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all capitalize ${
              selectedDifficulty === level
                ? 'bg-cyan-600/30 border border-cyan-500/50 text-cyan-300'
                : 'bg-slate-700/30 border border-slate-600/30 text-slate-400 hover:text-slate-300 hover:border-slate-500/50'
            } ${level === currentSkillLevel ? 'ring-2 ring-cyan-500/30' : ''}`}
            title={level === currentSkillLevel ? 'Your current skill level' : ''}
          >
            {level === currentSkillLevel && '👉 '}
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredPaths.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPaths.map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              isRecommended={path.difficulty === currentSkillLevel}
              isBookmarked={bookmarkedPathIds.includes(path.id)}
              onSelect={() => onSelectPath(path.id)}
              onToggleBookmark={onToggleBookmark}
            />
          ))}
        </div>
      ) : (
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-12 text-center backdrop-blur-sm">
          <p className="text-slate-400 text-lg">No courses found for this difficulty level.</p>
          <p className="text-slate-500 text-sm mt-2">Try selecting a different level!</p>
        </div>
      )}
    </div>
  );
}
