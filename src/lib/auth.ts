import { User, LoginCredentials, RegisterCredentials, UserProgress, PathProgress, Achievement, Certificate } from '@/types';

const USERS_KEY = 'aimorpheus_users';
const CURRENT_USER_KEY = 'aimorpheus_current_user';
const USER_PROGRESS_KEY = 'aimorpheus_user_progress';

// Simple password hashing (NOT for production - this is just for demo)
function hashPassword(password: string): string {
  return btoa(password); // Base64 encoding - for demo only
}

function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export const authService = {
  // Initialize demo account if it doesn't exist
  initializeDemoAccount: (): void => {
    try {
      const usersJson = localStorage.getItem(USERS_KEY);
      const users: Record<string, { user: User; passwordHash: string }> = usersJson
        ? JSON.parse(usersJson)
        : {};

      // Check if demo account already exists
      if (!users['demo@aimorpheus.com']) {
        const demoUser: User = {
          id: 'demo-user-' + Date.now().toString(),
          email: 'demo@aimorpheus.com',
          name: 'Demo User',
          createdAt: new Date().toISOString(),
        };

        users['demo@aimorpheus.com'] = {
          user: demoUser,
          passwordHash: hashPassword('demo123'),
        };

        localStorage.setItem(USERS_KEY, JSON.stringify(users));

        // Initialize demo user progress
        const userProgress: UserProgress = {
          userId: demoUser.id,
          pathProgress: [],
          totalHoursLearned: 0,
          completedPaths: [],
          currentStreak: 0,
          achievements: [],
          certificates: [],
        };
        const progressMap = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '{}');
        progressMap[demoUser.id] = userProgress;
        localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressMap));
      }
    } catch (error) {
      console.error('Demo account initialization error:', error);
    }
  },

  // Register a new user
  register: (credentials: RegisterCredentials): User | null => {
    try {
      const usersJson = localStorage.getItem(USERS_KEY);
      const users: Record<string, { user: User; passwordHash: string }> = usersJson
        ? JSON.parse(usersJson)
        : {};

      // Check if user already exists
      if (users[credentials.email]) {
        return null; // User exists
      }

      const newUser: User = {
        id: Date.now().toString(),
        email: credentials.email,
        name: credentials.name,
        createdAt: new Date().toISOString(),
      };

      users[credentials.email] = {
        user: newUser,
        passwordHash: hashPassword(credentials.password),
      };

      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Initialize user progress
      const userProgress: UserProgress = {
        userId: newUser.id,
        pathProgress: [],
        totalHoursLearned: 0,
        completedPaths: [],
        currentStreak: 0,
        achievements: [],
        certificates: [],
      };
      const progressMap = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '{}');
      progressMap[newUser.id] = userProgress;
      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressMap));

      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      return null;
    }
  },

  // Login user
  login: (credentials: LoginCredentials): User | null => {
    try {
      const usersJson = localStorage.getItem(USERS_KEY);
      if (!usersJson) return null;

      const users: Record<string, { user: User; passwordHash: string }> = JSON.parse(usersJson);
      const userRecord = users[credentials.email];

      if (!userRecord || !verifyPassword(credentials.password, userRecord.passwordHash)) {
        return null; // Invalid credentials
      }

      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userRecord.user));
      return userRecord.user;
    } catch (error) {
      console.error('Login error:', error);
      return null;
    }
  },

  // Get current logged-in user
  getCurrentUser: (): User | null => {
    try {
      const userJson = localStorage.getItem(CURRENT_USER_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  // Logout user
  logout: (): void => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },

  // Get user progress
  getUserProgress: (userId: string): UserProgress | null => {
    try {
      const progressMap = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '{}');
      return progressMap[userId] || null;
    } catch (error) {
      console.error('Get user progress error:', error);
      return null;
    }
  },

  // Update user progress
  updateUserProgress: (userId: string, progress: UserProgress): void => {
    try {
      const progressMap = JSON.parse(localStorage.getItem(USER_PROGRESS_KEY) || '{}');
      progressMap[userId] = progress;
      localStorage.setItem(USER_PROGRESS_KEY, JSON.stringify(progressMap));
    } catch (error) {
      console.error('Update user progress error:', error);
    }
  },

  // Enroll user in a path
  enrollInPath: (userId: string, pathId: string, pathTitle: string): void => {
    try {
      const progress = authService.getUserProgress(userId);
      if (!progress) return;

      const existingPath = progress.pathProgress.find((p) => p.pathId === pathId);
      if (existingPath) return; // Already enrolled

      const newPathProgress: PathProgress = {
        pathId,
        enrolledAt: new Date().toISOString(),
        completedModules: [],
        totalTimeSpent: 0,
        lastAccessedAt: new Date().toISOString(),
        progress: 0,
      };

      progress.pathProgress.push(newPathProgress);
      authService.updateUserProgress(userId, progress);
    } catch (error) {
      console.error('Enroll in path error:', error);
    }
  },

  // Mark module as completed
  completeModule: (userId: string, pathId: string, moduleId: string, timeSpent: number): void => {
    try {
      const progress = authService.getUserProgress(userId);
      if (!progress) return;

      const pathProgress = progress.pathProgress.find((p) => p.pathId === pathId);
      if (!pathProgress) return;

      if (!pathProgress.completedModules.includes(moduleId)) {
        pathProgress.completedModules.push(moduleId);
      }

      pathProgress.totalTimeSpent += timeSpent;
      pathProgress.lastAccessedAt = new Date().toISOString();
      progress.totalHoursLearned = Math.floor(
        progress.pathProgress.reduce((sum, p) => sum + p.totalTimeSpent, 0) / 60
      );

      authService.updateUserProgress(userId, progress);
    } catch (error) {
      console.error('Complete module error:', error);
    }
  },

  // Unenroll from a path
  unenrollFromPath: (userId: string, pathId: string): void => {
    try {
      const progress = authService.getUserProgress(userId);
      if (!progress) return;

      // Remove the path from pathProgress
      progress.pathProgress = progress.pathProgress.filter((p) => p.pathId !== pathId);

      authService.updateUserProgress(userId, progress);
    } catch (error) {
      console.error('Unenroll from path error:', error);
    }
  },

  // Update user profile
  updateUserProfile: (userId: string, updates: Partial<User>): User | null => {
    try {
      const user = authService.getCurrentUser();
      if (!user || user.id !== userId) return null;

      const updatedUser = { ...user, ...updates };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

      // Update in users list
      const usersJson = localStorage.getItem(USERS_KEY);
      if (usersJson) {
        const users = JSON.parse(usersJson);
        if (users[user.email]) {
          users[user.email].user = updatedUser;
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
        }
      }

      return updatedUser;
    } catch (error) {
      console.error('Update user profile error:', error);
      return null;
    }
  },

  // Award an achievement
  awardAchievement: (userId: string, achievement: Achievement): void => {
    try {
      const progress = authService.getUserProgress(userId);
      if (!progress) return;

      // Check if already has this achievement
      if (progress.achievements.some(a => a.id === achievement.id)) {
        return;
      }

      progress.achievements.push(achievement);
      authService.updateUserProgress(userId, progress);
    } catch (error) {
      console.error('Award achievement error:', error);
    }
  },

  // Check and award achievements based on progress
  checkAndAwardAchievements: (userId: string): void => {
    try {
      const progress = authService.getUserProgress(userId);
      if (!progress) return;

      const completedCount = progress.completedPaths.length;
      const totalHours = progress.totalHoursLearned;
      const streak = progress.currentStreak;

      // First course
      if (completedCount === 1) {
        authService.awardAchievement(userId, {
          id: 'first-course',
          title: 'First Step',
          description: 'Complete your first learning path',
          icon: '🎯',
          earnedAt: new Date().toISOString(),
          type: 'first-course',
        });
      }

      // Five courses
      if (completedCount === 5) {
        authService.awardAchievement(userId, {
          id: 'five-courses',
          title: 'Course Master',
          description: 'Complete 5 learning paths',
          icon: '🏆',
          earnedAt: new Date().toISOString(),
          type: 'five-courses',
        });
      }

      // Ten courses
      if (completedCount === 10) {
        authService.awardAchievement(userId, {
          id: 'ten-courses',
          title: 'Learning Legend',
          description: 'Complete 10 learning paths',
          icon: '👑',
          earnedAt: new Date().toISOString(),
          type: 'ten-courses',
        });
      }

      // 50 hours
      if (totalHours === 50 && !progress.achievements.some(a => a.id === 'fifty-hours')) {
        authService.awardAchievement(userId, {
          id: 'fifty-hours',
          title: 'Time Traveler',
          description: 'Learn for 50 hours',
          icon: '⏰',
          earnedAt: new Date().toISOString(),
          type: 'fifty-hours',
        });
      }

      // 100 hours
      if (totalHours >= 100 && !progress.achievements.some(a => a.id === 'hundred-hours')) {
        authService.awardAchievement(userId, {
          id: 'hundred-hours',
          title: 'Century Scholar',
          description: 'Learn for 100 hours',
          icon: '💯',
          earnedAt: new Date().toISOString(),
          type: 'hundred-hours',
        });
      }

      // 7-day streak
      if (streak === 7 && !progress.achievements.some(a => a.id === 'streak-7')) {
        authService.awardAchievement(userId, {
          id: 'streak-7',
          title: 'Week Warrior',
          description: 'Maintain a 7-day learning streak',
          icon: '🔥',
          earnedAt: new Date().toISOString(),
          type: 'streak-7',
        });
      }

      // 30-day streak
      if (streak === 30 && !progress.achievements.some(a => a.id === 'streak-30')) {
        authService.awardAchievement(userId, {
          id: 'streak-30',
          title: 'Unstoppable Force',
          description: 'Maintain a 30-day learning streak',
          icon: '⚡',
          earnedAt: new Date().toISOString(),
          type: 'streak-30',
        });
      }
    } catch (error) {
      console.error('Check and award achievements error:', error);
    }
  },

  // Generate and award certificate
  awardCertificate: (userId: string, pathId: string, pathTitle: string): Certificate | null => {
    try {
      const progress = authService.getUserProgress(userId);
      if (!progress) return null;

      // Check if already has certificate for this path
      if (progress.certificates.some(c => c.pathId === pathId)) {
        return null;
      }

      const certificate: Certificate = {
        id: `cert-${pathId}-${Date.now()}`,
        pathId,
        pathTitle,
        earnedAt: new Date().toISOString(),
        certificateNumber: `CERT-${Date.now().toString().slice(-8).toUpperCase()}`,
      };

      if (!progress.certificates) {
        progress.certificates = [];
      }

      progress.certificates.push(certificate);
      authService.updateUserProgress(userId, progress);

      return certificate;
    } catch (error) {
      console.error('Award certificate error:', error);
      return null;
    }
  },
};