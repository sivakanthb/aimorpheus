'use client';

import { useState, useEffect } from 'react';
import { User, UserProgress } from '@/types';
import { authService } from '@/lib/auth';
import { bookmarkService } from '@/lib/bookmarks';
import { learningPaths } from '@/lib/learningPaths';
import { recommendPaths } from '@/lib/recommendations';
import ExploreBySkill from './ExploreBySkill';
import SavedCourses from './SavedCourses';
import LearningInsights from './LearningInsights';

interface UserDashboardProps {
  user: User;
  onSelectPath: (pathId: string) => void;
  onViewProfile: () => void;
  onLogout: () => void;
}

export default function UserDashboard({
  user,
  onSelectPath,
  onViewProfile,
  onLogout,
}: UserDashboardProps) {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [recommendations, setRecommendations] = useState<typeof learningPaths>([]);
  const [loading, setLoading] = useState(true);
  const [unenrollConfirm, setUnenrollConfirm] = useState<string | null>(null);
  const [bookmarkedPathIds, setBookmarkedPathIds] = useState<string[]>([]);

  useEffect(() => {
    // Load user progress
    const progress = authService.getUserProgress(user.id);
    setUserProgress(progress);

    // Load bookmarks
    const bookmarks = bookmarkService.getBookmarkedPathIds(user.id);
    setBookmarkedPathIds(bookmarks);

    // Get recommendations for user
    if (user.preferences) {
      const recs = recommendPaths(user.preferences, learningPaths).paths;
      setRecommendations(recs);
    }

    setLoading(false);
  }, [user]);

  const handleUnenroll = (pathId: string) => {
    authService.unenrollFromPath(user.id, pathId);
    // Refresh progress
    const updatedProgress = authService.getUserProgress(user.id);
    setUserProgress(updatedProgress);
    setUnenrollConfirm(null);
  };

  const handleToggleBookmark = (pathId: string) => {
    if (bookmarkService.isBookmarked(user.id, pathId)) {
      bookmarkService.removeBookmark(user.id, pathId);
    } else {
      bookmarkService.addBookmark(user.id, pathId);
    }
    const updated = bookmarkService.getBookmarkedPathIds(user.id);
    setBookmarkedPathIds(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full"></div>
      </div>
    );
  }

  // Calculate stats
  const enrolledPaths =
    userProgress?.pathProgress 
      .map((pp) => learningPaths.find((p) => p.id === pp.pathId))
      .filter(Boolean) || [];
  const completedModules = userProgress?.pathProgress.reduce((total, pp) => total + pp.completedModules.length, 0) || 0;
  const totalLearningHours = Math.round((userProgress?.totalHoursLearned || 0));

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/60 rounded-lg p-6 mb-8 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/50 rounded-full flex items-center justify-center text-4xl">
              {user.avatar || '👨‍💻'}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-100">Welcome, {user.name}!</h1>
              <p className="text-slate-400 text-sm mt-1">Keep learning, keep growing</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onViewProfile}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 rounded-lg text-slate-200 font-semibold text-sm transition-all"
            >
              Profile
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 font-semibold text-sm transition-all"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {/* Enrolled Paths */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Enrolled Paths</p>
              <p className="text-3xl font-bold text-cyan-300 mt-2">{enrolledPaths.length}</p>
            </div>
            <div className="w-12 h-12 bg-cyan-600/20 border border-cyan-500/30 rounded-lg flex items-center justify-center text-2xl">
              🎓
            </div>
          </div>
        </div>

        {/* Completed Modules */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Completed</p>
              <p className="text-3xl font-bold text-emerald-300 mt-2">{completedModules}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-600/20 border border-emerald-500/30 rounded-lg flex items-center justify-center text-2xl">
              ✅
            </div>
          </div>
        </div>

        {/* Learning Hours */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Learning Hours</p>
              <p className="text-3xl font-bold text-blue-300 mt-2">{totalLearningHours}</p>
            </div>
            <div className="w-12 h-12 bg-blue-600/20 border border-blue-500/30 rounded-lg flex items-center justify-center text-2xl">
              ⏱️
            </div>
          </div>
        </div>

        {/* Streaks */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Current Streak</p>
              <p className="text-3xl font-bold text-orange-300 mt-2">
                {userProgress?.currentStreak || 0} days
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-600/20 border border-orange-500/30 rounded-lg flex items-center justify-center text-2xl">
              🔥
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enrolled Paths Section */}
        <div className="lg:col-span-2">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">My Learning Paths</h2>

          {enrolledPaths.length > 0 ? (
            <div className="space-y-4">
              {enrolledPaths.map((path) => {
                if (!path) return null;
                const pathProg = userProgress?.pathProgress.find((p) => p.pathId === path.id);
                const completedCount = pathProg?.completedModules.length || 0;
                const progressPercent = Math.round((completedCount / path.modules.length) * 100);

                return (
                  <div
                    key={path.id}
                    className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-5 backdrop-blur-sm hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-100">{path.title}</h3>
                        <p className="text-slate-400 text-sm mt-1">{path.description}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <button
                          onClick={() => onSelectPath(path.id)}
                          className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold text-sm transition-all whitespace-nowrap"
                        >
                          Continue
                        </button>
                        {unenrollConfirm === path.id ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUnenroll(path.id)}
                              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all"
                              title="Confirm unenroll"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setUnenrollConfirm(null)}
                              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg font-semibold text-sm transition-all"
                              title="Cancel"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setUnenrollConfirm(path.id)}
                            className="px-3 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg font-semibold text-sm transition-all"
                            title="Remove from learning paths"
                          >
                            ✕
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300">
                          {completedCount} of {path.modules.length} modules
                        </span>
                        <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-600 to-blue-600 transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Path Info */}
                    <div className="flex gap-4 mt-4 text-xs text-slate-400">
                      <span>📚 {path.modules.length} modules</span>
                      <span>⏱️ ~{path.estimatedHours}h</span>
                      <span>📊 {path.difficulty}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-8 text-center">
              <p className="text-slate-400">You haven't enrolled in any paths yet.</p>
              <p className="text-slate-500 text-sm mt-2">Check out our recommendations below!</p>
            </div>
          )}
        </div>

        {/* Recommended Paths Section */}
        <div>
          <h2 className="text-2xl font-bold text-slate-100 mb-4">Recommended for You</h2>

          {recommendations.length > 0 ? (
            <div className="space-y-4">
              {recommendations.slice(0, 3).map((path) => {
                const isEnrolled = enrolledPaths.some((p) => p?.id === path.id);

                return (
                  <div
                    key={path.id}
                    className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-cyan-500/20 rounded-lg p-4 hover:border-cyan-500/40 transition-all"
                  >
                    <h3 className="font-bold text-slate-100 text-sm">{path.title}</h3>
                    <p className="text-slate-400 text-xs mt-1 line-clamp-2">{path.description}</p>
                    <div className="flex gap-2 mt-3 text-xs text-slate-400">
                      <span>📚 {path.modules.length}</span>
                      <span>⏱️ {path.estimatedHours}h</span>
                    </div>
                    {!isEnrolled && (
                      <button
                        onClick={() => {
                          authService.enrollInPath(user.id, path.id, path.title);
                          const progress = authService.getUserProgress(user.id);
                          setUserProgress(progress);
                        }}
                        className="w-full mt-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded text-cyan-300 font-semibold text-xs transition-all"
                      >
                        Enroll Now
                      </button>
                    )}
                    {isEnrolled && (
                      <div className="mt-3 py-2 text-center text-emerald-300 text-xs font-semibold">
                        ✓ Enrolled
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6 text-center">
              <p className="text-slate-400 text-sm">No recommendations available yet.</p>
            </div>
          )}
        </div>
      </div>

      {/* Saved Courses Section */}
      {bookmarkedPathIds.length > 0 && (
        <div className="mt-12 mb-12">
          <SavedCourses
            bookmarkedPathIds={bookmarkedPathIds}
            allPaths={learningPaths}
            onSelectPath={onSelectPath}
            onToggleBookmark={handleToggleBookmark}
          />
        </div>
      )}

      {/* Explore Courses by Skill Level */}
      {user.preferences && (
        <ExploreBySkill
          currentSkillLevel={user.preferences.skillLevel}
          allPaths={learningPaths}
          bookmarkedPathIds={bookmarkedPathIds}
          onSelectPath={onSelectPath}
          onToggleBookmark={handleToggleBookmark}
        />
      )}

      {/* Learning Insights Section */}
      {userProgress && (
        <div className="mt-12 mb-12">
          <LearningInsights
            userProgress={userProgress}
            allPaths={learningPaths}
            userSkillLevel={user.preferences?.skillLevel || 'beginner'}
            onSelectPath={onSelectPath}
          />
        </div>
      )}

      {/* Quick Stats */}
      <div className="mt-8 bg-gradient-to-r from-slate-800/50 to-slate-850/50 border border-slate-700/60 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-cyan-300/80 mb-4">LEARNING ANALYTICS</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-400 text-xs font-semibold">Member Since</p>
            <p className="text-slate-200 font-semibold mt-1">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold">Next Goal</p>
            <p className="text-slate-200 font-semibold mt-1">
              {Math.max(0, 5 - completedModules)} modules
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold">Avg. Session</p>
            <p className="text-slate-200 font-semibold mt-1">
              {completedModules > 0 && userProgress
                ? Math.round((userProgress.totalHoursLearned * 60) / completedModules)
                : '-'}
              min
            </p>
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold">Total Time</p>
            <p className="text-slate-200 font-semibold mt-1">{totalLearningHours}h</p>
          </div>
        </div>
      </div>
    </div>
  );
}
