'use client';

import { useState, useEffect } from 'react';
import { User, RegisterCredentials, LoginCredentials } from '@/types';
import { authService } from '@/lib/auth';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
}

export default function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showSavedAccounts, setShowSavedAccounts] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load saved accounts on component mount
  useEffect(() => {
    // Initialize demo account
    authService.initializeDemoAccount();

    const usersJson = localStorage.getItem('aimorpheus_users');
    if (usersJson) {
      try {
        const users = JSON.parse(usersJson);
        const emails = Object.keys(users);
        setSavedAccounts(emails);
      } catch {
        setSavedAccounts([]);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSelectSavedAccount = (email: string) => {
    setFormData({
      ...formData,
      email: email,
    });
    setShowSavedAccounts(false);
    setError('');
  };

  const handleTryDemo = async () => {
    setLoading(true);
    setError('');
    
    const credentials: LoginCredentials = {
      email: 'demo@aimorpheus.com',
      password: 'demo123',
    };

    const user = authService.login(credentials);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Demo account unavailable');
    }
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const credentials: LoginCredentials = {
      email: formData.email,
      password: formData.password,
    };

    const user = authService.login(credentials);
    if (user) {
      onLoginSuccess(user);
    } else {
      setError('Invalid email or password');
    }
    setLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!formData.name) {
      setError('Name is required');
      setLoading(false);
      return;
    }

    const credentials: RegisterCredentials = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
    };

    const user = authService.register(credentials);
    if (user) {
      // Auto-login after registration
      const loginCredentials: LoginCredentials = {
        email: credentials.email,
        password: credentials.password,
      };
      const loggedInUser = authService.login(loginCredentials);
      if (loggedInUser) {
        onLoginSuccess(loggedInUser);
      }
    } else {
      setError('Email already registered. Please login or use a different email.');
    }
    setLoading(false);
  };

  const isLogin = mode === 'login';
  const handleSubmit = isLogin ? handleLogin : handleRegister;
  const isValid =
    formData.email && formData.password && (isLogin || formData.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
            AIMorpheus
          </h1>
          <p className="text-slate-400 text-sm">Master the Future of Intelligence</p>
        </div>

        {/* Demo Button - Prominent CTA */}
        <button
          onClick={handleTryDemo}
          disabled={loading}
          className="w-full mb-4 py-3 px-4 rounded-lg font-bold text-sm transition-all bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '🔄 Loading Demo...' : '🚀 Try Demo Now - No Registration!'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-slate-700/50"></div>
          <span className="text-xs text-slate-500">Or Login</span>
          <div className="flex-1 h-px bg-slate-700/50"></div>
        </div>

        {/* Card */}
        <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-8 backdrop-blur-sm shadow-xl">
          {/* Mode Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`flex-1 py-2 px-3 rounded-lg font-semibold text-sm transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md'
                  : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
              }`}
            >
              Register
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field (Register Only) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
                  disabled={loading}
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30 transition-all text-sm"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                <p className="text-red-300 text-xs font-semibold">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isValid || loading}
              className={`w-full py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${
                isValid && !loading
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-500 hover:to-blue-500 shadow-md hover:shadow-lg'
                  : 'bg-slate-700/50 text-slate-400 cursor-not-allowed'
              }`}
            >
              {loading ? (isLogin ? 'Logging In...' : 'Creating Account...') : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          {/* Demo & Saved Accounts */}
          {isLogin && (
            <div className="mt-6 pt-6 border-t border-slate-700/50">
              {/* Saved Accounts */}
              {savedAccounts.length > 0 && (
                <div className="mb-6">
                  <button
                    type="button"
                    onClick={() => setShowSavedAccounts(!showSavedAccounts)}
                    className="text-xs text-slate-400 font-semibold hover:text-cyan-400 transition-colors mb-2 flex items-center gap-1"
                  >
                    {showSavedAccounts ? '✕' : '+'} Your Saved Accounts ({savedAccounts.length})
                  </button>
                  
                  {showSavedAccounts && (
                    <div className="space-y-2 bg-slate-900/30 rounded-lg p-3 border border-slate-700/30">
                      {savedAccounts.map((email) => (
                        <button
                          key={email}
                          type="button"
                          onClick={() => handleSelectSavedAccount(email)}
                          className="w-full text-left px-3 py-2 rounded-lg bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 text-xs font-semibold transition-colors border border-slate-600/30 hover:border-cyan-500/30"
                        >
                          📧 {email}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Demo Credentials */}
              <div>
                <p className="text-xs text-slate-400 mb-2 font-semibold">Demo Credentials:</p>
                <p className="text-xs text-slate-500">Email: demo@aimorpheus.com</p>
                <p className="text-xs text-slate-500">Password: demo123</p>
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      email: 'demo@aimorpheus.com',
                      password: 'demo123',
                      name: '',
                    });
                    setError('');
                    setShowSavedAccounts(false);
                  }}
                  className="mt-3 w-full py-2 px-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  Use Demo Credentials
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-xs mt-6">
          Secure • Private Account • Browser Storage
        </p>
      </div>
    </div>
  );
}
