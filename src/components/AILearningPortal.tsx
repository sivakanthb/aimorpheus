'use client';

import { useState, useEffect } from 'react';
import type { User, UserRequirements, RecommendationResult, Notification } from '@/types';
import OnboardingForm from './OnboardingForm';
import RecommendationsDisplay from './RecommendationsDisplay';
import LoginPage from './LoginPage';
import UserDashboard from './UserDashboard';
import UserProfile from './UserProfile';
import PathDetailModal from './PathDetailModal';
import NavigationBar from './NavigationBar';
import Resources from './Resources';
import AIAssistant from './AIAssistant';
import CommunityHub from './CommunityHub';
import { recommendPaths } from '@/lib/recommendations';
import { learningPaths } from '@/lib/learningPaths';
import { authService } from '@/lib/auth';
import { notificationService } from '@/lib/notifications';

export default function AILearningPortal() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [stage, setStage] = useState<'auth' | 'onboarding' | 'edit-preferences' | 'dashboard' | 'path-detail' | 'profile' | 'resources' | 'community'>('auth');
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Check if user is already logged in
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
      // Load notifications for this user
      const userNotifications = notificationService.getNotifications(user.id);
      setNotifications(userNotifications);
      // If user has preferences, go to dashboard; otherwise show onboarding
      setStage(user.preferences ? 'dashboard' : 'onboarding');
    }
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    // Load notifications for this user
    const userNotifications = notificationService.getNotifications(user.id);
    setNotifications(userNotifications);
    // If new user (no preferences), show onboarding; otherwise go to dashboard
    setStage(user.preferences ? 'dashboard' : 'onboarding');
  };

  const handlePreferencesSubmit = (requirements: UserRequirements) => {
    if (!currentUser) return;
    
    // Save preferences to user profile
    const updatedUser = authService.updateUserProfile(currentUser.id, {
      preferences: requirements,
    });
    
    if (updatedUser) {
      setCurrentUser(updatedUser);
      setStage('dashboard');
    }
  };

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setStage('auth');
  };



  const handleSelectPath = (pathId: string) => {
    setSelectedPathId(pathId);
    setStage('path-detail');
  };

  const handleViewProfile = () => {
    setStage('profile');
  };

  const handleBackToDashboard = () => {
    setStage('dashboard');
  };

  const handleUpdateUser = (user: User) => {
    setCurrentUser(user);
  };

  const handleEditPreferences = () => {
    setStage('edit-preferences');
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (!currentUser) return;
    notificationService.markAsRead(currentUser.id, notificationId);
    // Update local state
    const updatedNotifications = notificationService.getNotifications(currentUser.id);
    setNotifications(updatedNotifications);
  };

  const handleClearAllNotifications = () => {
    if (!currentUser) return;
    notificationService.clearAll(currentUser.id);
    // Update local state
    setNotifications([]);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full"></div>
      </main>
    );
  }

  // Show LoginPage if not authenticated
  if (!currentUser) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 py-6 px-3 sm:px-4 lg:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-2">
              <span className="text-5xl">⚡</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">
              AIMorpheus
            </h1>
            <p className="text-lg font-semibold text-gray-200 mb-1">Master the Future of Intelligence</p>
            <p className="text-sm text-gray-300 max-w-xl mx-auto">
              Your personalized journey to mastering artificial intelligence
            </p>
          </div>

          <div className="max-w-md mx-auto">
            <LoginPage onLoginSuccess={handleLoginSuccess} />
          </div>

          {/* Ecosystem Cross-Links */}
          <div className="mt-10 mb-6 text-center">
            <p className="text-sm font-semibold text-gray-300 mb-4">Explore Sivakanth's AI Lab</p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href="https://ai-sage-nine.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-indigo-400/50 hover:text-indigo-300 transition-all">
                🤝 AI Buddy <span className="text-xs text-gray-500">— AI Readiness Check</span>
              </a>
              <a href="https://myaicompass.vercel.app/" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-300 hover:border-blue-400/50 hover:text-blue-300 transition-all">
                🧭 AI Compass <span className="text-xs text-gray-500">— AI Tools Catalog</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Show Onboarding if user is new (no preferences yet)
  if (stage === 'onboarding' && currentUser) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">
        <NavigationBar
          user={currentUser}
          currentPage="onboarding"
          paths={learningPaths}
          notifications={notifications}
          onNavigateDashboard={() => setStage('dashboard')}
          onNavigateProfile={() => setStage('profile')}
          onNavigateResources={() => setStage('resources')}
          onNavigateCommunity={() => setStage('community')}
          onSelectPath={handleSelectPath}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onLogout={handleLogout}
        />
        
        <div className="py-6 px-3 sm:px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-2">
                <span className="text-5xl">⚡</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">
                AIMorpheus
              </h1>
              <p className="text-lg font-semibold text-gray-200 mb-1">Master the Future of Intelligence</p>
              <p className="text-sm text-gray-300 max-w-xl mx-auto">
                Let's personalize your learning journey
              </p>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-2xl p-5 mb-6 border border-purple-500/40 backdrop-blur-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">🎯 Welcome to AIMorpheus, {currentUser.name}!</h2>
              <p className="text-sm text-blue-50 leading-relaxed mb-3">
                To get the best learning recommendations tailored just for you, we need to understand your goals, available time, and learning style. This quick questionnaire will help us create your perfect learning path.
              </p>
              <p className="text-sm text-blue-50 leading-relaxed">
                Don't worry—you can update your preferences anytime from your profile!
              </p>
            </div>

            {/* Onboarding Form */}
            <div className="max-w-xl mx-auto">
              <OnboardingForm onSubmit={handlePreferencesSubmit} isLoading={false} />
            </div>
          </div>
        </div>
        <AIAssistant />
      </main>
    );
  }

  // Show Edit Preferences (same as onboarding but can be triggered from dashboard)
  if (stage === 'edit-preferences' && currentUser) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">
        <NavigationBar
          user={currentUser}
          currentPage="edit-preferences"
          paths={learningPaths}
          notifications={notifications}
          onNavigateDashboard={() => setStage('dashboard')}
          onNavigateProfile={() => setStage('profile')}
          onNavigatePreferences={() => setStage('edit-preferences')}
          onNavigateResources={() => setStage('resources')}
          onNavigateCommunity={() => setStage('community')}
          onSelectPath={handleSelectPath}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onLogout={handleLogout}
        />
        
        <div className="py-6 px-3 sm:px-4 lg:px-6">
          <div className="max-w-6xl mx-auto">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="inline-block mb-2">
                <span className="text-5xl">⚙️</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-2">
                Update Preferences
              </h1>
              <p className="text-lg font-semibold text-gray-200 mb-1">Refine your learning path</p>
              <p className="text-sm text-gray-300 max-w-xl mx-auto">
                Adjust your goals and get fresh recommendations
              </p>
            </div>

            {/* Welcome Message */}
            <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-purple-700 text-white rounded-2xl shadow-2xl p-5 mb-6 border border-purple-500/40 backdrop-blur-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-2">📊 Update Your Learning Profile</h2>
              <p className="text-sm text-blue-50 leading-relaxed">
                Let us know how your learning goals or available time have changed, and we'll give you fresh recommendations!
              </p>
            </div>

            {/* Onboarding Form */}
            <div className="max-w-xl mx-auto">
              <OnboardingForm 
                onSubmit={(reqs) => {
                  handlePreferencesSubmit(reqs);
                }} 
                isLoading={false} 
              />
            </div>
          </div>
        </div>
        <AIAssistant />
      </main>
    );
  }

  // Show UserDashboard
  if (stage === 'dashboard') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">
        <NavigationBar
          user={currentUser!}
          currentPage="dashboard"
          paths={learningPaths}
          notifications={notifications}
          onNavigateDashboard={() => setStage('dashboard')}
          onNavigateProfile={() => setStage('profile')}
          onNavigatePreferences={handleEditPreferences}
          onNavigateResources={() => setStage('resources')}
          onNavigateCommunity={() => setStage('community')}
          onSelectPath={handleSelectPath}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onLogout={handleLogout}
        />
        
        <div className="py-6 px-3 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <UserDashboard
              user={currentUser!}
              onSelectPath={handleSelectPath}
              onViewProfile={handleViewProfile}
              onLogout={handleLogout}
            />
          </div>
        </div>
        <AIAssistant />
      </main>
    );
  }

  // Show UserProfile
  if (stage === 'profile') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">
        <NavigationBar
          user={currentUser!}
          currentPage="profile"
          paths={learningPaths}
          notifications={notifications}
          onNavigateDashboard={() => setStage('dashboard')}
          onNavigateProfile={() => setStage('profile')}
          onNavigatePreferences={handleEditPreferences}
          onNavigateResources={() => setStage('resources')}
          onNavigateCommunity={() => setStage('community')}
          onSelectPath={handleSelectPath}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onLogout={handleLogout}
        />
        
        <div className="py-6 px-3 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <UserProfile
              user={currentUser!}
              onUpdate={handleUpdateUser}
              onBack={handleBackToDashboard}
            />
          </div>
        </div>
        <AIAssistant />
      </main>
    );
  }

  // Show Path Detail
  if (stage === 'path-detail' && selectedPathId) {
    const selectedPath = learningPaths.find((p) => p.id === selectedPathId);
    if (selectedPath) {
      return (
        <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">
          <NavigationBar
            user={currentUser!}
            currentPage="dashboard"
            paths={learningPaths}
            notifications={notifications}
            onNavigateDashboard={handleBackToDashboard}
            onNavigateProfile={() => setStage('profile')}
            onNavigatePreferences={handleEditPreferences}
            onNavigateResources={() => setStage('resources')}
            onNavigateCommunity={() => setStage('community')}
            onSelectPath={handleSelectPath}
            onMarkNotificationAsRead={handleMarkNotificationAsRead}
            onClearAllNotifications={handleClearAllNotifications}
            onLogout={handleLogout}
          />
          
          <div className="py-6 px-3 sm:px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
              <PathDetailModal
                path={selectedPath}
                currentUser={currentUser!}
                onClose={handleBackToDashboard}
              />
            </div>
          </div>
          <AIAssistant />
        </main>
      );
    }
  }

  // Show Resources
  if (stage === 'resources' && currentUser) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">
        <NavigationBar
          user={currentUser}
          currentPage="dashboard"
          paths={learningPaths}
          notifications={notifications}
          onNavigateDashboard={() => setStage('dashboard')}
          onNavigateProfile={() => setStage('profile')}
          onNavigatePreferences={handleEditPreferences}
          onNavigateResources={() => setStage('resources')}
          onNavigateCommunity={() => setStage('community')}
          onSelectPath={handleSelectPath}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onLogout={handleLogout}
        />
        
        <div className="py-6 px-3 sm:px-4 lg:px-6">
          <Resources onBack={() => setStage('dashboard')} />
        </div>
        <AIAssistant />
      </main>
    );
  }

  // Show Community Hub
  if (stage === 'community' && currentUser) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900">
        <NavigationBar
          user={currentUser}
          currentPage="dashboard"
          paths={learningPaths}
          notifications={notifications}
          onNavigateDashboard={() => setStage('dashboard')}
          onNavigateProfile={() => setStage('profile')}
          onNavigatePreferences={handleEditPreferences}
          onNavigateResources={() => setStage('resources')}
          onNavigateCommunity={() => setStage('community')}
          onSelectPath={handleSelectPath}
          onMarkNotificationAsRead={handleMarkNotificationAsRead}
          onClearAllNotifications={handleClearAllNotifications}
          onLogout={handleLogout}
        />
        
        <div className="py-6 px-3 sm:px-4 lg:px-6">
          <div className="max-w-7xl mx-auto">
            <CommunityHub
              currentUser={currentUser}
              allPaths={learningPaths}
              onSelectPath={handleSelectPath}
            />
          </div>
        </div>
        <AIAssistant />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 py-6 px-3 sm:px-4 lg:px-6">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-slate-400">Loading...</p>
      </div>
    </main>
  );
}
