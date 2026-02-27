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
