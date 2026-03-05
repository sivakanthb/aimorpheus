'use client';

import { useMemo } from 'react';
import type { UserProgress, LearningPath, SkillLevel } from '@/types';
import { insightsService, type InsightMetrics } from '@/lib/insights';

interface LearningInsightsProps {
  userProgress: UserProgress;
  allPaths: LearningPath[];
  userSkillLevel: SkillLevel;
  onSelectPath: (pathId: string) => void;
}

export default function LearningInsights({
  userProgress,
  allPaths,
  userSkillLevel,
  onSelectPath,
}: LearningInsightsProps) {
  const insights = useMemo(
    () => insightsService.generateInsights(userProgress, allPaths, userSkillLevel),
    [userProgress, allPaths, userSkillLevel]
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">📊 Learning Insights</h2>
        <p className="text-slate-400">Your personalized learning analytics and recommendations</p>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Hours */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-cyan-500/20 rounded-lg p-5 backdrop-blur-sm hover:border-cyan-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Learning Hours</span>
            <span className="text-2xl">⏱️</span>
          </div>
          <div className="text-3xl font-bold text-cyan-300">{Math.round(insights.totalHoursLearned)}</div>
          <p className="text-slate-500 text-xs mt-2">
            {insights.averageHoursPerCourse > 0
              ? `Avg: ${insights.averageHoursPerCourse.toFixed(1)}h per course`
              : 'Keep going!'}
          </p>
        </div>

        {/* Completion Rate */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 rounded-lg p-5 backdrop-blur-sm hover:border-emerald-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Completion Rate</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-emerald-300">{Math.round(insights.completionRate)}%</div>
          <div className="w-full h-2 bg-slate-700/50 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
              style={{ width: `${insights.completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-orange-500/20 rounded-lg p-5 backdrop-blur-sm hover:border-orange-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Current Streak</span>
            <span className="text-2xl">🔥</span>
          </div>
          <div className="text-3xl font-bold text-orange-300">{insights.currentStreak}</div>
          <p className="text-slate-500 text-xs mt-2">
            {insights.currentStreak === 0 ? 'Start today!' : `${insights.currentStreak} days`}
          </p>
        </div>

        {/* Learning Velocity */}
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-lg p-5 backdrop-blur-sm hover:border-purple-500/40 transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Weekly Pace</span>
            <span className="text-2xl">⚡</span>
          </div>
          <div className="text-3xl font-bold text-purple-300">{insights.learningVelocity.toFixed(1)}h</div>
          <p className="text-slate-500 text-xs mt-2">per week average</p>
        </div>
      </div>

      {/* Weekly Progress */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/60 rounded-lg p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-slate-100 mb-4">📈 Weekly Progress</h3>
        <div className="flex items-end justify-between h-32 gap-2">
          {insights.weeklyStats.map((stat, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div className="relative w-full h-24 bg-slate-700/30 rounded-lg overflow-hidden group">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-cyan-500/80 to-cyan-400/40 transition-all group-hover:from-cyan-400 group-hover:to-cyan-300/60"
                  style={{ height: `${(stat.hoursLearned / 12) * 100}%` }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  {stat.hoursLearned}h
                </div>
              </div>
              <span className="text-xs text-slate-400 mt-2">{stat.week}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Areas for Improvement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border border-emerald-500/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-emerald-300 mb-4 flex items-center gap-2">
            <span>✨</span> Your Strengths
          </h3>
          <div className="space-y-2">
            {insights.strengths.map((strength, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-lg">✓</span>
                <span className="text-slate-200">{strength}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Areas for Improvement */}
        <div className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border border-blue-500/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
            <span>🎯</span> Areas to Focus
          </h3>
          <div className="space-y-2">
            {insights.areasForImprovement.map((area, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <span className="text-lg">→</span>
                <span className="text-slate-200">{area}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Skill Progression */}
      {insights.skillProgression.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/60 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-4">🎯 Skill Progression</h3>
          <div className="space-y-4">
            {insights.skillProgression.map((skill, idx) => (
              <div key={idx}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-200 font-semibold">{skill.skill}</span>
                    {skill.recentActivity && <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-1 rounded">Active</span>}
                  </div>
                  <span className="text-xs text-slate-400">{skill.currentLevel}</span>
                </div>
                <div className="w-full h-2 bg-slate-700/50 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all"
                    style={{ width: `${skill.estimatedCompletion}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-400 mt-1">{skill.estimatedCompletion}% mastered</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skill Gaps */}
      {insights.skillGaps.length > 0 && (
        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border border-yellow-500/30 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-yellow-300 mb-4">⚠️ Skill Gaps</h3>
          <div className="space-y-3">
            {insights.skillGaps.map((gap, idx) => {
              const levelColor = {
                critical: 'text-red-300 bg-red-500/10 border-red-500/30',
                high: 'text-orange-300 bg-orange-500/10 border-orange-500/30',
                medium: 'text-yellow-300 bg-yellow-500/10 border-yellow-500/30',
                low: 'text-blue-300 bg-blue-500/10 border-blue-500/30',
              };

              return (
                <div key={idx} className={`border rounded-lg p-3 ${levelColor[gap.gapLevel]}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{gap.skill}</p>
                      <p className="text-xs mt-1">Recommended: {gap.recommendedCourse}</p>
                    </div>
                    <span className="text-xs font-bold uppercase">{gap.gapLevel}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommended Next Courses */}
      {insights.recommendedNextCourses.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/60 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-4">🚀 Recommended Next Courses</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.recommendedNextCourses.map((pathId) => {
              const course = allPaths.find((p) => p.id === pathId);
              return course ? (
                <div
                  key={pathId}
                  className="bg-slate-700/40 border border-slate-600/40 rounded-lg p-4 hover:border-cyan-500/60 transition-all cursor-pointer group"
                  onClick={() => onSelectPath(pathId)}
                >
                  <h4 className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors mb-2">
                    {course.title}
                  </h4>
                  <div className="flex gap-2 text-xs text-slate-400">
                    <span>📚 {course.modules.length} modules</span>
                    <span>⏱️ {course.estimatedHours}h</span>
                  </div>
                  <button className="w-full mt-3 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded text-cyan-300 text-sm font-semibold transition-all">
                    View Course
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
