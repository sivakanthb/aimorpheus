// User Requirements and Preferences
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type TimeAvailability = '5-10hrs' | '10-20hrs' | '20-40hrs' | '40+hrs';
export type Expertise = 'none' | 'basic' | 'solid' | 'mastery';
export type Interest = 'academic' | 'practical' | 'research' | 'entrepreneurship' | 'mixed';

export interface UserRequirements {
  skillLevel: SkillLevel;
  timePerWeek: TimeAvailability;
  capability: string[];
  expertise: Expertise;
  interests: Interest[];
  learningStyle: 'visual' | 'hands-on' | 'theoretical' | 'mixed';
}

// Learning Path and Course
export interface Module {
  id: string;
  title: string;
  description: string;
  duration: number; // in hours
  difficulty: SkillLevel;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  overview: string;
  difficulty: SkillLevel;
  estimatedHours: number;
  prerequisites: string[];
  modules: Module[];
  skills: string[];
  targetAudience: string;
  interests: Interest[];
  matchScore?: number;
}

// Recommendation Result
export interface RecommendationResult {
  paths: LearningPath[];
  explanation: string;
}

// User Authentication and Profile
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  profileImage?: string; // Base64 encoded image data
  createdAt: string;
  preferences?: UserRequirements;
  bookmarkedPathIds?: string[]; // Saved courses for later
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

// User Progress and Learning
export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  timeSpent: number; // in minutes
}

export interface PathProgress {
  pathId: string;
  enrolledAt: string;
  completedModules: string[];
  totalTimeSpent: number; // in minutes
  lastAccessedAt: string;
  progress: number; // percentage 0-100
}

export interface UserProgress {
  userId: string;
  pathProgress: PathProgress[];
  totalHoursLearned: number;
  completedPaths: string[];
  currentStreak: number; // days
  achievements: Achievement[];
  certificates: Certificate[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  type: 'first-course' | 'five-courses' | 'ten-courses' | 'fifty-hours' | 'hundred-hours' | 'streak-7' | 'streak-30' | 'perfect-module';
}

export interface Certificate {
  id: string;
  pathId: string;
  pathTitle: string;
  earnedAt: string;
  certificateNumber: string;
}

export interface Notification {
  id: string;
  type: 'achievement' | 'recommendation' | 'enrollment' | 'completion';
  title: string;
  message: string;
  icon: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export interface UserDashboardData {
  user: User;
  progress: UserProgress;
  recommendedPaths: LearningPath[];
  enrolledPaths: LearningPath[];
}

// Community Features
export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  title: string;
  content: string;
  verified: boolean; // enrolled and completed
  likes: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Comment {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  likes: number;
  replies: Comment[];
  createdAt: string;
}

export interface UserProfile {
  userId: string;
  userName: string;
  avatar?: string;
  bio?: string;
  coursesCompleted: number;
  totalHoursLearned: number;
  skills: string[];
  achievements: Achievement[];
  reviews: CourseReview[];
  followers: number;
  following: number;
  joinedAt: string;
}

export interface CommunityMetrics {
  totalReviews: number;
  averageRating: number;
  mostHelpfulReview?: CourseReview;
  commentsCount: number;
  topContributors: UserProfile[];
}
// Discussion & Forums
export interface DiscussionThread {
  id: string;
  pathId: string;
  title: string;
  description: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  replies: DiscussionReply[];
  views: number;
  isAnswered: boolean;
}

export interface DiscussionReply {
  id: string;
  threadId: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  isAnswer: boolean;
  likes: number;
  createdAt: string;
  updatedAt?: string;
}