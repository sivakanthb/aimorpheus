'use client';

import { useState, useRef, useEffect } from 'react';
import { Notification } from '@/types';

interface NotificationsBellProps {
  notifications: Notification[];
  onMarkAsRead: (notificationId: string) => void;
  onClearAll: () => void;
}

export default function NotificationsBell({
  notifications,
  onMarkAsRead,
  onClearAll,
}: NotificationsBellProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDropdown]);

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'text-yellow-400';
      case 'recommendation':
        return 'text-blue-400';
      case 'enrollment':
        return 'text-green-400';
      case 'completion':
        return 'text-purple-400';
      default:
        return 'text-slate-400';
    }
  };

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-yellow-900/20 border-yellow-700/30';
      case 'recommendation':
        return 'bg-blue-900/20 border-blue-700/30';
      case 'enrollment':
        return 'bg-green-900/20 border-green-700/30';
      case 'completion':
        return 'bg-purple-900/20 border-purple-700/30';
      default:
        return 'bg-slate-700/20 border-slate-600/30';
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className={`relative p-2 rounded-lg transition-all ${
          showDropdown
            ? 'bg-cyan-600/30 border border-cyan-500/50'
            : 'hover:bg-slate-700/40 border border-transparent'
        }`}
        title={`${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700/60 rounded-lg shadow-2xl z-50 overflow-hidden backdrop-blur-sm max-h-96 flex flex-col">
          {/* Header */}
          <div className="bg-slate-800/95 border-b border-slate-700/40 px-4 py-3 flex items-center justify-between sticky top-0">
            <h3 className="font-semibold text-slate-100 flex items-center gap-2">
              <span>📬 Notifications</span>
              {unreadCount > 0 && (
                <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </h3>
            {notifications.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-slate-300 underline transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-700/30">
            {notifications.length > 0 ? (
              notifications.slice(0, 10).map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => {
                    if (!notification.read) {
                      onMarkAsRead(notification.id);
                    }
                  }}
                  className={`px-4 py-3 hover:bg-slate-700/40 transition-colors cursor-pointer border-l-4 ${
                    notification.read ? 'border-l-transparent' : 'border-l-cyan-500'
                  } ${notification.read ? 'opacity-75' : ''}`}
                >
                  <div className="flex gap-3">
                    <span className={`text-lg flex-shrink-0 ${getNotificationColor(notification.type)}`}>
                      {notification.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-100">{notification.title}</p>
                      <p className="text-xs text-slate-400 line-clamp-2">{notification.message}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(notification.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                    {!notification.read && (
                      <div className="flex-shrink-0 w-2 h-2 bg-cyan-500 rounded-full mt-1" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-slate-400 text-sm">
                <p>✨ No notifications yet</p>
                <p className="text-xs mt-1">Complete courses and earn achievements to see notifications!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
