'use client';

import type { LearningPath } from '@/types';
import LearningPathCard from './LearningPathCard';

interface SavedCoursesProps {
  bookmarkedPathIds: string[];
  allPaths: LearningPath[];
  onSelectPath: (pathId: string) => void;
  onToggleBookmark: (pathId: string) => void;
}

export default function SavedCourses({
  bookmarkedPathIds,
  allPaths,
  onSelectPath,
  onToggleBookmark,
}: SavedCoursesProps) {
  // Get the actual LearningPath objects for bookmarked IDs
  const savedCourses = bookmarkedPathIds
    .map((id) => allPaths.find((p) => p.id === id))
    .filter(Boolean) as LearningPath[];

  if (savedCourses.length === 0) {
    return (
      <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-12 text-center">
        <div className="text-4xl mb-3">📚</div>
        <p className="text-slate-300 font-semibold">No Saved Courses Yet</p>
        <p className="text-slate-400 text-sm mt-2">
          Bookmark courses to save them for later and access them quickly.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-100">Saved Courses</h2>
          <p className="text-slate-400 text-sm mt-1">
            {savedCourses.length} course{savedCourses.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <div className="px-4 py-2 bg-slate-700/50 border border-slate-600/40 rounded-lg">
          <span className="text-cyan-300 font-bold text-lg">{savedCourses.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedCourses.map((path) => (
          <LearningPathCard
            key={path.id}
            path={path}
            isBookmarked={true}
            onSelect={() => onSelectPath(path.id)}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
}
