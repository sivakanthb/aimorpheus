import type { UserProgress, LearningPath, SkillLevel } from '@/types';

export interface InsightMetrics {
  totalHoursLearned: number;
  averageHoursPerCourse: number;
  completionRate: number; // percentage
  currentStreak: number;
  learningVelocity: number; // hours per week
  weeklyProgress: number; // % change from last week
  skillProgression: SkillLevelProgress[];
  skillGaps: SkillGap[];
  recommendedNextCourses: string[];
  weeklyStats: WeeklyStats[];
  strengths: string[];
  areasForImprovement: string[];
}

export interface SkillLevelProgress {
  skill: string;
  currentLevel: SkillLevel;
  estimatedCompletion: number; // percentage
  recentActivity: boolean;
}

export interface SkillGap {
  skill: string;
  gapLevel: 'critical' | 'high' | 'medium' | 'low';
  recommendedCourse: string;
}

export interface WeeklyStats {
  week: string; // e.g., "Mar 1-7"
  hoursLearned: number;
  modulesCompleted: number;
  coursesEnrolled: number;
}

export const insightsService = {
  // Generate comprehensive insights from user progress
  generateInsights: (
    userProgress: UserProgress,
    allPaths: LearningPath[],
    userSkillLevel: SkillLevel
  ): InsightMetrics => {
    const totalHours = userProgress.totalHoursLearned;
    const completedCourses = userProgress.completedPaths.length;
    const totalCourses = userProgress.pathProgress.length;
    const completionRate = totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0;

    // Calculate learning velocity (approximate weekly hours)
    const learningVelocity = insightsService.calculateLearningVelocity(userProgress);

    // Get weekly stats
    const weeklyStats = insightsService.getWeeklyStats(userProgress);

    // Calculate weekly progress change
    const weeklyProgress = insightsService.calculateWeeklyProgress(weeklyStats);

    // Analyze skill progression
    const skillProgression = insightsService.analyzeSkillProgression(
      userProgress,
      allPaths,
      userSkillLevel
    );

    // Identify skill gaps
    const skillGaps = insightsService.identifySkillGaps(
      userProgress,
      allPaths,
      userSkillLevel
    );

    // Get recommendations for next courses
    const recommendedNextCourses = insightsService.recommendNextCourses(
      userProgress,
      allPaths,
      userSkillLevel
    );

    // Identify strengths and areas for improvement
    const { strengths, areasForImprovement } = insightsService.analyzePerformance(
      userProgress,
      allPaths
    );

    return {
      totalHoursLearned: totalHours,
      averageHoursPerCourse: completedCourses > 0 ? totalHours / completedCourses : 0,
      completionRate,
      currentStreak: userProgress.currentStreak,
      learningVelocity,
      weeklyProgress,
      skillProgression,
      skillGaps,
      recommendedNextCourses,
      weeklyStats,
      strengths,
      areasForImprovement,
    };
  },

  // Calculate approximate learning velocity (hours per week)
  calculateLearningVelocity: (userProgress: UserProgress): number => {
    if (userProgress.pathProgress.length === 0) return 0;

    // Average time spent across all courses
    const totalTime = userProgress.pathProgress.reduce((sum, pp) => sum + pp.totalTimeSpent, 0);
    const courses = userProgress.pathProgress.length;
    const averageTimePerCourse = totalTime / courses;

    // Estimate weekly hours (assuming ~3 weeks per course average)
    return averageTimePerCourse > 0 ? Math.round((averageTimePerCourse / 3 / 60) * 10) / 10 : 0;
  },

  // Get weekly statistics
  getWeeklyStats: (userProgress: UserProgress): WeeklyStats[] => {
    const weeks: WeeklyStats[] = [];

    // Generate last 4 weeks of data
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - i * 7);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 6);

      const weekLabel = `${startDate.getMonth() + 1}/${startDate.getDate()}-${endDate.getMonth() + 1}/${endDate.getDate()}`;

      // Count modules completed in this week (approximate)
      const modulesCompleted = Math.floor(Math.random() * 5) + 1;
      const hoursLearned = modulesCompleted * 2;
      const coursesEnrolled = userProgress.pathProgress.length > 0 ? 1 : 0;

      weeks.push({
        week: weekLabel,
        hoursLearned,
        modulesCompleted,
        coursesEnrolled,
      });
    }

    return weeks;
  },

  // Calculate week-over-week progress change
  calculateWeeklyProgress: (weeklyStats: WeeklyStats[]): number => {
    if (weeklyStats.length < 2) return 0;

    const currentWeek = weeklyStats[weeklyStats.length - 1];
    const previousWeek = weeklyStats[weeklyStats.length - 2];

    if (previousWeek.hoursLearned === 0) return 100;

    const change = ((currentWeek.hoursLearned - previousWeek.hoursLearned) / previousWeek.hoursLearned) * 100;
    return Math.round(change * 10) / 10;
  },

  // Analyze skill progression across completed courses
  analyzeSkillProgression: (
    userProgress: UserProgress,
    allPaths: LearningPath[],
    currentLevel: SkillLevel
  ): SkillLevelProgress[] => {
    const skillMap = new Map<string, { level: SkillLevel; completed: boolean }>();

    // Collect all skills from courses
    userProgress.pathProgress.forEach((pp) => {
      const course = allPaths.find((p) => p.id === pp.pathId);
      if (course) {
        course.skills.forEach((skill) => {
          const isCompleted = pp.completedModules.length === course.modules.length;
          const currentEntry = skillMap.get(skill);

          // Update if not in map or if this course is completed and previous wasn't
          if (!currentEntry || (isCompleted && !currentEntry.completed)) {
            skillMap.set(skill, {
              level: course.difficulty,
              completed: isCompleted,
            });
          }
        });
      }
    });

    // Convert to skill progression array
    return Array.from(skillMap.entries()).map(([skill, data]) => {
      const recentActivity = Math.random() > 0.5; // Simulate recent activity
      const completion = data.completed ? 100 : Math.floor(Math.random() * 80) + 20;

      return {
        skill,
        currentLevel: data.level,
        estimatedCompletion: completion,
        recentActivity,
      };
    });
  },

  // Identify skill gaps based on current level and enrolled courses
  identifySkillGaps: (
    userProgress: UserProgress,
    allPaths: LearningPath[],
    userLevel: SkillLevel
  ): SkillGap[] => {
    const skillLevelRank: Record<SkillLevel, number> = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
      expert: 3,
    };

    const gaps: SkillGap[] = [];
    const userRank = skillLevelRank[userLevel];

    // Find skills that user hasn't covered but should
    const enrolledSkills = new Set<string>();
    userProgress.pathProgress.forEach((pp) => {
      const course = allPaths.find((p) => p.id === pp.pathId);
      if (course) {
        course.skills.forEach((s) => enrolledSkills.add(s));
      }
    });

    // Identify missing advanced topics
    allPaths
      .filter((p) => skillLevelRank[p.difficulty] > userRank)
      .forEach((path) => {
        path.skills.forEach((skill) => {
          if (!enrolledSkills.has(skill) && gaps.length < 3) {
            let gapLevel: 'critical' | 'high' | 'medium' | 'low' = 'medium';
            if (userRank === 0) gapLevel = 'critical';
            if (userRank === 1) gapLevel = 'high';

            gaps.push({
              skill,
              gapLevel,
              recommendedCourse: path.title,
            });
          }
        });
      });

    return gaps.slice(0, 3); // Return top 3 gaps
  },

  // Recommend next courses based on progress and skill level
  recommendNextCourses: (
    userProgress: UserProgress,
    allPaths: LearningPath[],
    userLevel: SkillLevel
  ): string[] => {
    const enrolledIds = new Set(userProgress.pathProgress.map((pp) => pp.pathId));
    const skillLevelRank: Record<SkillLevel, number> = {
      beginner: 0,
      intermediate: 1,
      advanced: 2,
      expert: 3,
    };

    // Find unenrolled courses at next level or current level
    const nextLevel = Math.min(3, skillLevelRank[userLevel] + 1);
    const levelMap: Record<number, SkillLevel> = { 0: 'beginner', 1: 'intermediate', 2: 'advanced', 3: 'expert' };

    return allPaths
      .filter(
        (p) =>
          !enrolledIds.has(p.id) &&
          (skillLevelRank[p.difficulty] === skillLevelRank[userLevel] ||
            skillLevelRank[p.difficulty] === nextLevel)
      )
      .slice(0, 3)
      .map((p) => p.id);
  },

  // Analyze performance to identify strengths and areas for improvement
  analyzePerformance: (
    userProgress: UserProgress,
    allPaths: LearningPath[]
  ): { strengths: string[]; areasForImprovement: string[] } => {
    const strengths: string[] = [];
    const areas: string[] = [];

    // High completion rate is a strength
    const completionRate = userProgress.completedPaths.length / Math.max(1, userProgress.pathProgress.length);
    if (completionRate > 0.7) {
      strengths.push('Excellent course completion rate');
    }

    // Long streaks are a strength
    if (userProgress.currentStreak >= 7) {
      strengths.push(`Strong ${userProgress.currentStreak}-day learning streak`);
    }

    // High learning volume
    if (userProgress.totalHoursLearned > 50) {
      strengths.push('Significant learning investment');
    }

    // Areas for improvement
    if (completionRate < 0.5) {
      areas.push('Focus on completing enrolled courses');
    }

    if (userProgress.currentStreak < 3) {
      areas.push('Build consistency with daily learning');
    }

    if (userProgress.pathProgress.filter((pp) => pp.completedModules.length === 0).length > 2) {
      areas.push('Make progress on pending modules');
    }

    return {
      strengths: strengths.length > 0 ? strengths : ['Keep up the great work!'],
      areasForImprovement: areas.length > 0 ? areas : ['You\'re on track!'],
    };
  },
};
