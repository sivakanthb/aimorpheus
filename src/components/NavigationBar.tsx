'use client';

import { useState } from 'react';
import { User, LearningPath, Notification } from '@/types';
import SearchBar from './SearchBar';
import NotificationsBell from './NotificationsBell';

interface NavigationBarProps {
  user: User;
  currentPage: 'dashboard' | 'profile' | 'onboarding' | 'edit-preferences' | 'resources' | 'community';
  paths: LearningPath[];
  notifications: Notification[];
  onNavigateDashboard: () => void;
  onNavigateProfile: () => void;
  onNavigatePreferences?: () => void;
  onNavigateResources?: () => void;
  onNavigateCommunity?: () => void;
  onSelectPath: (pathId: string) => void;
  onMarkNotificationAsRead: (notificationId: string) => void;
  onClearAllNotifications: () => void;
  onLogout: () => void;
}

export default function NavigationBar({
  user,
  currentPage,
  paths,
  notifications,
  onNavigateDashboard,
  onNavigateProfile,
  onNavigatePreferences,
  onNavigateResources,
  onNavigateCommunity,
  onSelectPath,
  onMarkNotificationAsRead,
  onClearAllNotifications,
  onLogout,
}: NavigationBarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    onLogout();
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    onNavigateProfile();
  };

  const handlePreferencesClick = () => {
    setShowUserMenu(false);
    if (onNavigatePreferences) {
      onNavigatePreferences();
    }
  };

  const handleDashboardClick = () => {
    setShowUserMenu(false);
    onNavigateDashboard();
  };

  const handleResourcesClick = () => {
    setShowUserMenu(false);
    if (onNavigateResources) {
      onNavigateResources();
    }
  };

  const handleCommunityClick = () => {
    setShowUserMenu(false);
    if (onNavigateCommunity) {
      onNavigateCommunity();
    }
  };

  return (
    <nav className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-b border-slate-700/60 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateDashboard}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              title="Go to Dashboard"
            >
              <span className="text-2xl">⚡</span>
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent hidden sm:inline">
                AIMorpheus
              </span>
            </button>
          </div>

          {/* Center: HOME Button + Search Bar */}
          <div className="flex-1 flex justify-center mx-4">
            <div className="flex items-center gap-4">
              <button
                onClick={handleDashboardClick}
                className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/40 text-cyan-300 hover:text-cyan-200 hover:border-cyan-500/60 font-semibold text-sm transition-all flex items-center gap-2 whitespace-nowrap min-h-12 sm:min-h-auto"
                title="Go Home (Dashboard)"
              >
                <span className="text-lg">🏠</span>
                <span className="hidden sm:inline">HOME</span>
              </button>
              
              {/* Search Bar */}
              <SearchBar paths={paths} onSelectPath={onSelectPath} />
            </div>
          </div>

          {/* Right: Notifications Bell + User Menu & Logout */}
          <div className="flex items-center gap-3 relative">
            {/* Notifications Bell */}
            <NotificationsBell
              notifications={notifications}
              onMarkAsRead={onMarkNotificationAsRead}
              onClearAll={onClearAllNotifications}
            />

            {/* User Avatar & Name Dropdown Trigger */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg bg-slate-700/30 border border-slate-600/30 hover:bg-slate-700/50 hover:border-slate-600/50 transition-all hidden sm:flex min-h-12 sm:min-h-auto"
              title="User Menu"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-8 h-8 rounded-full object-cover border border-cyan-500/30"
                />
              ) : (
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-sm">
                  {user.avatar || '👤'}
                </div>
              )}
              <span className="text-slate-300 text-sm font-semibold truncate max-w-[100px]">
                {user.name.split(' ')[0]}
              </span>
              <span className={`text-slate-400 text-xs transition-transform ${showUserMenu ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>

            {/* Mobile Avatar Only */}
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-12 h-12 sm:w-8 sm:h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 text-sm sm:hidden hover:border-cyan-500/50 transition-all overflow-hidden"
              title="User Menu"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                user.avatar || '👤'
              )}
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 border border-slate-700/60 rounded-lg shadow-xl backdrop-blur-sm z-50 overflow-hidden">
                {/* User Info Header */}
                <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/50">
                  <p className="text-sm font-bold text-slate-100">{user.name}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  <button
                    onClick={handleDashboardClick}
                    className="w-full text-left px-4 py-3 sm:py-2 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 text-sm font-semibold transition-all flex items-center gap-2 min-h-12 sm:min-h-auto"
                  >
                    <span>📊</span> My Dashboard
                  </button>

                  {currentPage !== 'profile' && (
                    <button
                      onClick={handleProfileClick}
                      className="w-full text-left px-4 py-3 sm:py-2 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 text-sm font-semibold transition-all flex items-center gap-2 min-h-12 sm:min-h-auto"
                    >
                      <span>👤</span> My Profile
                    </button>
                  )}

                  {onNavigatePreferences && currentPage !== 'edit-preferences' && (
                    <button
                      onClick={handlePreferencesClick}
                      className="w-full text-left px-4 py-3 sm:py-2 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 text-sm font-semibold transition-all flex items-center gap-2 min-h-12 sm:min-h-auto"
                    >
                      <span>⚙️</span> Edit Preferences
                    </button>
                  )}

                  {onNavigateResources && currentPage !== 'resources' && (
                    <button
                      onClick={handleResourcesClick}
                      className="w-full text-left px-4 py-3 sm:py-2 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 text-sm font-semibold transition-all flex items-center gap-2 min-h-12 sm:min-h-auto"
                    >
                      <span>📚</span> Resources & Blogs
                    </button>
                  )}

                  {onNavigateCommunity && currentPage !== 'community' && (
                    <button
                      onClick={handleCommunityClick}
                      className="w-full text-left px-4 py-3 sm:py-2 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-300 text-sm font-semibold transition-all flex items-center gap-2 min-h-12 sm:min-h-auto"
                    >
                      <span>👥</span> Community Hub
                    </button>
                  )}

                  <button
                    onClick={handleLogoutClick}
                    className="w-full text-left px-4 py-3 sm:py-2 text-red-300 hover:bg-red-600/20 hover:text-red-200 text-sm font-semibold transition-all flex items-center gap-2 min-h-12 sm:min-h-auto"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              </div>
            )}

            {/* Logout Button (Desktop, visible when menu is closed) */}
            {!showUserMenu && (
              <button
                onClick={handleLogoutClick}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-300 hover:text-red-200 font-semibold text-sm transition-all flex items-center gap-1 sm:hidden min-h-12 sm:min-h-auto"
                title="Logout"
              >
                <span>🚪</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu - Removed as navigation is now in HOME button and user dropdown */}
      </div>
    </nav>
  );
}
