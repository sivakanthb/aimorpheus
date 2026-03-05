import { Notification } from '@/types';

const NOTIFICATIONS_KEY = 'aimorpheus_notifications';

export const notificationService = {
  // Get all notifications for a user
  getNotifications: (userId: string): Notification[] => {
    try {
      const notifJson = localStorage.getItem(`${NOTIFICATIONS_KEY}_${userId}`);
      return notifJson ? JSON.parse(notifJson) : [];
    } catch (error) {
      return [];
    }
  },

  // Get unread notification count
  getUnreadCount: (userId: string): number => {
    const notifications = notificationService.getNotifications(userId);
    return notifications.filter((n) => !n.read).length;
  },

  // Add a new notification
  addNotification: (userId: string, notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): void => {
    try {
      const notifications = notificationService.getNotifications(userId);
      const newNotif: Notification = {
        ...notification,
        id: `notif-${Date.now()}`,
        createdAt: new Date().toISOString(),
        read: false,
      };

      notifications.unshift(newNotif); // Add to beginning
      // Keep only last 20 notifications
      const limited = notifications.slice(0, 20);
      localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(limited));
    } catch (error) {
      console.error('Add notification error:', error);
    }
  },

  // Mark notification as read
  markAsRead: (userId: string, notificationId: string): void => {
    try {
      const notifications = notificationService.getNotifications(userId);
      const updated = notifications.map((n) =>
        n.id === notificationId ? { ...n, read: true } : n
      );
      localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Mark as read error:', error);
    }
  },

  // Mark all as read
  markAllAsRead: (userId: string): void => {
    try {
      const notifications = notificationService.getNotifications(userId);
      const updated = notifications.map((n) => ({ ...n, read: true }));
      localStorage.setItem(`${NOTIFICATIONS_KEY}_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Mark all as read error:', error);
    }
  },

  // Clear all notifications
  clearAll: (userId: string): void => {
    try {
      localStorage.removeItem(`${NOTIFICATIONS_KEY}_${userId}`);
    } catch (error) {
      console.error('Clear notifications error:', error);
    }
  },

  // Create achievement notification
  createAchievementNotif: (title: string, description: string, icon: string): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'achievement',
    title,
    message: description,
    icon,
  }),

  // Create recommendation notification
  createRecommendationNotif: (courseTitle: string, icon: string = '📚'): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'recommendation',
    title: 'New Recommendation',
    message: `We think you'd love "${courseTitle}"`,
    icon,
  }),

  // Create enrollment notification
  createEnrollmentNotif: (courseTitle: string): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'enrollment',
    title: 'Course Enrolled',
    message: `You've enrolled in "${courseTitle}"`,
    icon: '📝',
  }),

  // Create completion notification
  createCompletionNotif: (courseTitle: string): Omit<Notification, 'id' | 'createdAt' | 'read'> => ({
    type: 'completion',
    title: 'Course Completed! 🎉',
    message: `Congratulations on completing "${courseTitle}"`,
    icon: '🏆',
  }),
};
