import type { UserRequirements, LearningPath, RecommendationResult } from '@/types';

export function calculateMatchScore(
  requirements: UserRequirements,
  path: LearningPath
): number {
  let score = 0;
  const weights = {
    skillLevel: 25,
    timeCompatibility: 25,
    interestMatch: 30,
    capabilityMatch: 20,
  };

  // Skill level matching
  const skillLevelRank: Record<string, number> = {
    beginner: 0,
    intermediate: 1,
    advanced: 2,
    expert: 3,
  };
  const skillDiff = Math.abs(
    skillLevelRank[requirements.skillLevel] - skillLevelRank[path.difficulty]
  );
  const skillScore = Math.max(0, 100 - skillDiff * 25);
  score += (skillScore / 100) * weights.skillLevel;

  // Time compatibility
  const timeRanges: Record<string, number> = {
    '5-10hrs': 7.5,
    '10-20hrs': 15,
    '20-40hrs': 30,
    '40+hrs': 50,
  };
  const userTimePerWeek = timeRanges[requirements.timePerWeek];
  const weeksDuration = path.estimatedHours / (userTimePerWeek || 7.5);
  const timeScore = Math.max(0, Math.min(100, 100 - Math.abs(weeksDuration - 12) * 5));
  score += (timeScore / 100) * weights.timeCompatibility;

  // Interest matching
  const matchingInterests = requirements.interests.filter((interest) =>
    path.interests?.includes(interest)
  ).length;
  const interestScore = (matchingInterests / Math.max(1, requirements.interests.length)) * 100;
  score += (interestScore / 100) * weights.interestMatch;

  // Capability matching - special handling for "No Coding Experience"
  let capabilityScore = 100; // Default to high score if no specific skills selected
  
  if (requirements.capability.length > 0 && !requirements.capability.includes('No Coding Experience')) {
    const matchingCapabilities = requirements.capability.filter((cap) =>
      path.skills?.some((skill) => skill.toLowerCase().includes(cap.toLowerCase()))
    ).length;
    capabilityScore = (matchingCapabilities / Math.max(1, requirements.capability.length)) * 100;
  } else if (requirements.capability.includes('No Coding Experience')) {
    // Favor beginner-friendly paths for novices
    capabilityScore = path.difficulty === 'beginner' ? 100 : Math.max(60, 100 - (path.estimatedHours / 2));
  }
  
  score += (capabilityScore / 100) * weights.capabilityMatch;

  return Math.round(score);
}

export function recommendPaths(
  requirements: UserRequirements,
  availablePaths: LearningPath[]
): RecommendationResult {
  const scoredPaths = availablePaths.map((path) => ({
    ...path,
    matchScore: calculateMatchScore(requirements, path),
  }));

  const sortedPaths = scoredPaths
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 5);

  const topPath = sortedPaths[0];
  const explanation = generateExplanation(requirements, topPath);

  return {
    paths: sortedPaths,
    explanation,
  };
}

function generateExplanation(
  requirements: UserRequirements,
  recommendedPath: LearningPath
): string {
  const timePerWeekStr = requirements.timePerWeek;
  const weeksNeeded = Math.ceil(
    recommendedPath.estimatedHours / (parseInt(timePerWeekStr) || 7.5)
  );

  return `Based on your ${requirements.skillLevel} skill level and ${timePerWeekStr} hours per week availability, 
    we recommend starting with "${recommendedPath.title}". This path aligns well with your interests 
    and can be completed in approximately ${weeksNeeded} weeks. The learning path covers essential skills 
    and provides hands-on experience suitable for your expertise level.`;
}
