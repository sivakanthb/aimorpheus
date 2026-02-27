'use client';

import { useState } from 'react';
import type { UserRequirements, SkillLevel, TimeAvailability, Interest } from '@/types';

interface OnboardingFormProps {
  onSubmit: (requirements: UserRequirements) => void;
  isLoading?: boolean;
}

export default function OnboardingForm({ onSubmit, isLoading = false }: OnboardingFormProps) {
  const [formData, setFormData] = useState<UserRequirements>({
    skillLevel: 'beginner',
    timePerWeek: '10-20hrs',
    capability: [],
    expertise: 'none',
    interests: ['mixed'],
    learningStyle: 'mixed',
  });

  const skillLevels: SkillLevel[] = ['beginner', 'intermediate', 'advanced', 'expert'];
  const timeOptions: TimeAvailability[] = ['5-10hrs', '10-20hrs', '20-40hrs', '40+hrs'];
  const expertiseOptions = ['none', 'basic', 'solid', 'mastery'];
  const interestOptions: Interest[] = ['academic', 'practical', 'research', 'entrepreneurship', 'mixed'];
  const capabilityOptions = ['No Coding Experience', 'Python', 'JavaScript', 'Statistics', 'Linear Algebra', 'Mathematics'];
  const learningStyles = ['visual', 'hands-on', 'theoretical', 'mixed'];

  const handleSkillLevelChange = (level: SkillLevel) => {
    setFormData((prev) => ({ ...prev, skillLevel: level }));
  };

  const handleTimeChange = (time: TimeAvailability) => {
    setFormData((prev) => ({ ...prev, timePerWeek: time }));
  };

  const handleExpertiseChange = (exp: string) => {
    setFormData((prev) => ({ ...prev, expertise: exp as any }));
  };

  const handleCapabilityToggle = (capability: string) => {
    setFormData((prev) => ({
      ...prev,
      capability: prev.capability.includes(capability)
        ? prev.capability.filter((c) => c !== capability)
        : [...prev.capability, capability],
    }));
  };

  const handleInterestToggle = (interest: Interest) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleLearningStyleChange = (style: string) => {
    setFormData((prev) => ({ ...prev, learningStyle: style as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.capability.length === 0 || formData.interests.length === 0) {
      alert('Please select at least one capability and one interest');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 bg-white/10 rounded-2xl shadow-2xl p-6 border border-white/20 backdrop-blur-md">
      <div>
        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">Your Learning Profile</h2>
        <p className="text-sm text-gray-100">Tell us about your AI learning journey so we can recommend the perfect path.</p>
      </div>

      {/* Skill Level */}
      <div>
        <label className="block text-xs font-semibold text-cyan-200 mb-2">Current Skill Level</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {skillLevels.map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => handleSkillLevelChange(level)}
              className={`py-1.5 px-3 rounded-lg font-medium text-sm transition-all ${
                formData.skillLevel === level
                  ? 'bg-gradient-to-r from-cyan-400 to-blue-400 text-slate-900 shadow-lg shadow-cyan-300/50'
                  : 'bg-white/10 text-gray-100 hover:bg-white/20 border border-white/20'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Time Availability */}
      <div>
        <label className="block text-xs font-semibold text-cyan-200 mb-2">Weekly Time Availability</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {timeOptions.map((time) => (
            <button
              key={time}
              type="button"
              onClick={() => handleTimeChange(time)}
              className={`py-1.5 px-3 rounded-lg font-medium text-sm transition-all ${
                formData.timePerWeek === time
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-900 shadow-lg shadow-emerald-300/50'
                  : 'bg-white/10 text-gray-100 hover:bg-white/20 border border-white/20'
              }`}
            >
              {time}
            </button>
          ))}
        </div>
      </div>

      {/* Current Capabilities */}
      <div>
        <label className="block text-xs font-semibold text-cyan-200 mb-2">Your Current Capabilities</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {capabilityOptions.map((capability) => (
            <button
              key={capability}
              type="button"
              onClick={() => handleCapabilityToggle(capability)}
              className={`py-1.5 px-3 rounded-lg font-medium text-sm transition-all border-2 ${
                formData.capability.includes(capability)
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 border-pink-300 text-slate-900 shadow-lg shadow-pink-300/50'
                  : 'bg-white/10 border-white/20 text-gray-100 hover:border-white/40 hover:bg-white/20'
              }`}
            >
              {capability}
            </button>
          ))}
        </div>
      </div>

      {/* Expertise Level */}
      <div>
        <label className="block text-xs font-semibold text-cyan-200 mb-2">Your Expertise Level</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {expertiseOptions.map((exp) => (
            <button
              key={exp}
              type="button"
              onClick={() => handleExpertiseChange(exp)}
              className={`py-1.5 px-3 rounded-lg font-medium text-sm transition-all ${
                formData.expertise === exp
                  ? 'bg-gradient-to-r from-orange-400 to-amber-400 text-slate-900 shadow-lg shadow-orange-300/50'
                  : 'bg-white/10 text-gray-100 hover:bg-white/20 border border-white/20'
              }`}
            >
              {exp.charAt(0).toUpperCase() + exp.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Interests */}
      <div>
        <label className="block text-xs font-semibold text-cyan-200 mb-2">Learning Interests</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {interestOptions.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => handleInterestToggle(interest)}
              className={`py-1.5 px-3 rounded-lg font-medium text-sm transition-all border-2 ${
                formData.interests.includes(interest)
                  ? 'bg-gradient-to-r from-pink-400 to-rose-400 border-rose-300 text-slate-900 shadow-lg shadow-rose-300/50'
                  : 'bg-white/10 border-white/20 text-gray-100 hover:border-white/40 hover:bg-white/20'
              }`}
            >
              {interest.charAt(0).toUpperCase() + interest.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Learning Style */}
      <div>
        <label className="block text-xs font-semibold text-cyan-200 mb-2">Preferred Learning Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {learningStyles.map((style) => (
            <button
              key={style}
              type="button"
              onClick={() => handleLearningStyleChange(style)}
              className={`py-1.5 px-3 rounded-lg font-medium text-sm transition-all ${
                formData.learningStyle === style
                  ? 'bg-gradient-to-r from-indigo-400 to-purple-400 text-slate-900 shadow-lg shadow-indigo-300/50'
                  : 'bg-white/10 text-gray-100 hover:bg-white/20 border border-white/20'
              }`}
            >
              {style.charAt(0).toUpperCase() + style.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 hover:from-cyan-300 hover:via-blue-300 hover:to-purple-300 disabled:from-slate-400 disabled:to-slate-500 text-slate-900 font-bold py-2 px-4 rounded-lg transition-all shadow-xl shadow-cyan-300/50 disabled:shadow-none text-sm"
      >
        {isLoading ? 'Finding Your Path...' : 'Get Your Learning Paths'}
      </button>
    </form>
  );
}
