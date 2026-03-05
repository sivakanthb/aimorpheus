'use client';

import { useState, useEffect } from 'react';
import { themeService, type Theme } from '@/lib/theme';

interface ThemeSelectorProps {
  onThemeChange?: (theme: Theme) => void;
  currentTheme?: Theme;
}

export default function ThemeSelector({ onThemeChange, currentTheme }: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>('dark');

  useEffect(() => {
    const theme = currentTheme || themeService.getTheme();
    setSelectedTheme(theme);
  }, [currentTheme]);

  const handleThemeSelect = (theme: Theme) => {
    setSelectedTheme(theme);
    themeService.setTheme(theme);
    onThemeChange?.(theme);
  };

  const themes: { id: Theme; label: string; description: string; colors: string }[] = [
    {
      id: 'dark',
      label: 'Dark Mode',
      description: 'Easy on the eyes with dark background',
      colors: 'bg-slate-800 border-slate-700',
    },
    {
      id: 'light',
      label: 'Light Mode',
      description: 'Bright and clean interface',
      colors: 'bg-slate-100 border-slate-300',
    },
  ];

  return (
    <div className="w-full max-w-2xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-100 mb-2">Choose Your Theme</h2>
        <p className="text-slate-400">Select a background theme that works best for you</p>
      </div>

      {/* Theme Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => handleThemeSelect(theme.id)}
            className={`relative p-6 rounded-lg border-2 transition-all cursor-pointer group ${
              selectedTheme === theme.id
                ? 'border-cyan-500 bg-slate-700/50 ring-2 ring-cyan-500/50'
                : 'border-slate-600 bg-slate-700/20 hover:border-slate-500 hover:bg-slate-700/30'
            }`}
          >
            {/* Theme Preview */}
            <div className={`w-full h-32 rounded mb-4 border-2 ${theme.colors} flex items-center justify-center overflow-hidden`}>
              <div className="text-center">
                {theme.id === 'dark' ? (
                  <>
                    <div className="text-3xl mb-2">🌙</div>
                    <div className="text-xs text-slate-400">Dark Preview</div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2">☀️</div>
                    <div className="text-xs text-slate-600">Light Preview</div>
                  </>
                )}
              </div>
            </div>

            {/* Theme Info */}
            <div className="text-left">
              <h3 className="text-lg font-semibold text-slate-100 mb-1">{theme.label}</h3>
              <p className="text-sm text-slate-400">{theme.description}</p>
            </div>

            {/* Selection Indicator */}
            {selectedTheme === theme.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Active Theme Display */}
      <div className="mt-8 p-4 rounded-lg bg-slate-700/30 border border-slate-600">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-cyan-500" />
          <span className="text-slate-300">
            Current theme: <span className="font-semibold text-cyan-400">{selectedTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
