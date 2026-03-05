const BOOKMARKS_KEY = 'aimorpheus_bookmarks';

export const bookmarkService = {
  // Get all bookmarked path IDs for a user
  getBookmarkedPathIds: (userId: string): string[] => {
    try {
      const bookmarksJson = localStorage.getItem(`${BOOKMARKS_KEY}_${userId}`);
      return bookmarksJson ? JSON.parse(bookmarksJson) : [];
    } catch (error) {
      return [];
    }
  },

  // Check if a path is bookmarked
  isBookmarked: (userId: string, pathId: string): boolean => {
    const bookmarked = bookmarkService.getBookmarkedPathIds(userId);
    return bookmarked.includes(pathId);
  },

  // Add a path to bookmarks
  addBookmark: (userId: string, pathId: string): void => {
    try {
      const bookmarks = bookmarkService.getBookmarkedPathIds(userId);
      if (!bookmarks.includes(pathId)) {
        bookmarks.unshift(pathId); // Add to beginning
        localStorage.setItem(`${BOOKMARKS_KEY}_${userId}`, JSON.stringify(bookmarks));
      }
    } catch (error) {
      console.error('Add bookmark error:', error);
    }
  },

  // Remove a path from bookmarks
  removeBookmark: (userId: string, pathId: string): void => {
    try {
      const bookmarks = bookmarkService.getBookmarkedPathIds(userId);
      const updated = bookmarks.filter((id) => id !== pathId);
      localStorage.setItem(`${BOOKMARKS_KEY}_${userId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Remove bookmark error:', error);
    }
  },

  // Get count of bookmarked paths
  getBookmarkCount: (userId: string): number => {
    return bookmarkService.getBookmarkedPathIds(userId).length;
  },

  // Clear all bookmarks for a user
  clearAll: (userId: string): void => {
    try {
      localStorage.removeItem(`${BOOKMARKS_KEY}_${userId}`);
    } catch (error) {
      console.error('Clear bookmarks error:', error);
    }
  },
};
