'use client';

import { useState, useEffect } from 'react';
import { User, UserProgress } from '@/types';
import { authService } from '@/lib/auth';
import AchievementsAndCertificates from './AchievementsAndCertificates';
import ProfileImageUpload from './ProfileImageUpload';

interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
  onBack: () => void;
}

export default function UserProfile({ user, onUpdate, onBack }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
  });
  const [avatar, setAvatar] = useState(user.avatar || '');
  const [profileImage, setProfileImage] = useState(user.profileImage || '');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleAvatarChange = (emoji: string) => {
    setAvatar(emoji);
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      setError('Name cannot be empty');
      return;
    }

    const updated = authService.updateUserProfile(user.id, {
      name: formData.name,
      avatar: avatar || undefined,
      profileImage: profileImage || undefined,
    });

    if (updated) {
      onUpdate(updated);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } else {
      setError('Failed to update profile');
    }
  };

  const avatarEmojis = ['👨‍💻', '👩‍💻', '🧑‍🎓', '👨‍🔬', '👩‍🔬', '🚀', '⭐', '💡', '🎯', '🏆'];
  const currentAvatar = avatar || '👨‍💻';

  useEffect(() => {
    const progress = authService.getUserProgress(user.id);
    setUserProgress(progress);
  }, [user.id]);

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold"
      >
        ← Back to Dashboard
      </button>

      <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-8 backdrop-blur-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-slate-100">My Profile</h2>
          <button
            onClick={() => {
              if (isEditing) {
                setFormData({ name: user.name });
                setAvatar(user.avatar || '');
                setProfileImage(user.profileImage || '');
              }
              setIsEditing(!isEditing);
              setError('');
              setSuccess('');
            }}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold text-sm transition-all"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            <p className="text-red-300 text-xs font-semibold">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-emerald-300 text-xs font-semibold">{success}</p>
          </div>
        )}

        {/* Avatar Section */}
        <div className="mb-8 text-center">
          <div className="inline-block">
            {profileImage ? (
              <img
                src={profileImage}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500/50 mb-4 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/50 rounded-full flex items-center justify-center text-6xl mb-4">
                {currentAvatar}
              </div>
            )}
          </div>

          {isEditing && (
            <div className="mt-6 space-y-6">
              {/* Photo Upload */}
              <div>
                <p className="text-slate-300 text-sm font-semibold mb-4">Profile Photo</p>
                <ProfileImageUpload
                  currentImage={profileImage}
                  onImageSelected={setProfileImage}
                />
              </div>

              {/* Emoji Avatar Fallback */}
              <div>
                <p className="text-slate-300 text-sm font-semibold mb-3">Or Choose Emoji Avatar</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {avatarEmojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleAvatarChange(emoji)}
                      className={`w-10 h-10 text-2xl rounded-lg transition-all ${
                        currentAvatar === emoji
                          ? 'bg-cyan-600 scale-110'
                          : 'bg-slate-700/50 hover:bg-slate-700'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Info */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
              />
            ) : (
              <p className="text-slate-100 text-lg font-semibold">{user.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
            <p className="text-slate-400 text-sm">{user.email}</p>
            <p className="text-slate-500 text-xs mt-1">Email cannot be changed</p>
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">Member Since</label>
            <p className="text-slate-400 text-sm">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>

          {/* Account Status */}
          <div className="pt-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-slate-300 text-sm font-semibold">Active Account</span>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <button
            onClick={handleSave}
            className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-lg font-semibold transition-all"
          >
            Save Changes
          </button>
        )}
      </div>

      {/* Achievements and Certificates */}
      {userProgress && (
        <div className="mt-6 bg-slate-800/50 border border-slate-700/60 rounded-lg p-6 backdrop-blur-sm">
          <AchievementsAndCertificates
            achievements={userProgress.achievements || []}
            certificates={userProgress.certificates || []}
          />
        </div>
      )}

      {/* Additional Info */}
      <div className="mt-6 bg-slate-800/30 border border-slate-700/30 rounded-lg p-6">
        <h3 className="text-sm font-bold text-cyan-300/80 mb-3">About Your Data</h3>
        <ul className="space-y-2 text-xs text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Your data is stored securely in your browser using localStorage.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Clearing your browser cache will delete all your account data.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-400 mt-1">•</span>
            <span>Your progress and preferences are synced automatically.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
