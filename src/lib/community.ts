import type { CourseReview, Comment, UserProfile, CommunityMetrics, DiscussionThread, DiscussionReply } from '@/types';

const REVIEWS_KEY = 'aimorpheus_reviews';
const COMMENTS_KEY = 'aimorpheus_comments';
const PROFILES_KEY = 'aimorpheus_profiles';
const DISCUSSIONS_KEY = 'aimorpheus_discussions';

export const communityService = {
  // ===== REVIEWS =====
  getReviewsForCourse: (courseId: string): CourseReview[] => {
    try {
      const reviewsJson = localStorage.getItem(`${REVIEWS_KEY}_${courseId}`);
      return reviewsJson ? JSON.parse(reviewsJson) : [];
    } catch (error) {
      return [];
    }
  },

  addReview: (courseId: string, review: Omit<CourseReview, 'id' | 'createdAt' | 'updatedAt'>): CourseReview => {
    try {
      const reviews = communityService.getReviewsForCourse(courseId);
      const newReview: CourseReview = {
        ...review,
        id: `review-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      reviews.unshift(newReview);
      localStorage.setItem(`${REVIEWS_KEY}_${courseId}`, JSON.stringify(reviews));
      return newReview;
    } catch (error) {
      throw new Error('Failed to add review');
    }
  },

  updateReview: (courseId: string, reviewId: string, updates: Partial<CourseReview>): void => {
    try {
      const reviews = communityService.getReviewsForCourse(courseId);
      const updated = reviews.map((r) =>
        r.id === reviewId ? { ...r, ...updates, updatedAt: new Date().toISOString() } : r
      );
      localStorage.setItem(`${REVIEWS_KEY}_${courseId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Update review error:', error);
    }
  },

  deleteReview: (courseId: string, reviewId: string): void => {
    try {
      const reviews = communityService.getReviewsForCourse(courseId);
      const filtered = reviews.filter((r) => r.id !== reviewId);
      localStorage.setItem(`${REVIEWS_KEY}_${courseId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Delete review error:', error);
    }
  },

  likeReview: (courseId: string, reviewId: string): void => {
    try {
      const reviews = communityService.getReviewsForCourse(courseId);
      const updated = reviews.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r));
      localStorage.setItem(`${REVIEWS_KEY}_${courseId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Like review error:', error);
    }
  },

  getAverageRating: (courseId: string): number => {
    const reviews = communityService.getReviewsForCourse(courseId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / reviews.length) * 10) / 10;
  },

  // ===== COMMENTS =====
  getCommentsForCourse: (courseId: string): Comment[] => {
    try {
      const commentsJson = localStorage.getItem(`${COMMENTS_KEY}_${courseId}`);
      return commentsJson ? JSON.parse(commentsJson) : [];
    } catch (error) {
      return [];
    }
  },

  addComment: (courseId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies'>): Comment => {
    try {
      const comments = communityService.getCommentsForCourse(courseId);
      const newComment: Comment = {
        ...comment,
        id: `comment-${Date.now()}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      };
      comments.unshift(newComment);
      localStorage.setItem(`${COMMENTS_KEY}_${courseId}`, JSON.stringify(comments));
      return newComment;
    } catch (error) {
      throw new Error('Failed to add comment');
    }
  },

  replyToComment: (courseId: string, commentId: string, reply: Omit<Comment, 'id' | 'createdAt' | 'likes' | 'replies'>): void => {
    try {
      const comments = communityService.getCommentsForCourse(courseId);
      const updated = comments.map((c) => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: [
              ...c.replies,
              {
                ...reply,
                id: `reply-${Date.now()}`,
                createdAt: new Date().toISOString(),
                likes: 0,
                replies: [],
              },
            ],
          };
        }
        return c;
      });
      localStorage.setItem(`${COMMENTS_KEY}_${courseId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Reply to comment error:', error);
    }
  },

  likeComment: (courseId: string, commentId: string): void => {
    try {
      const comments = communityService.getCommentsForCourse(courseId);
      const updated = comments.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c));
      localStorage.setItem(`${COMMENTS_KEY}_${courseId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Like comment error:', error);
    }
  },

  deleteComment: (courseId: string, commentId: string): void => {
    try {
      const comments = communityService.getCommentsForCourse(courseId);
      const filtered = comments.filter((c) => c.id !== commentId);
      localStorage.setItem(`${COMMENTS_KEY}_${courseId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Delete comment error:', error);
    }
  },

  // ===== USER PROFILES =====
  getUserProfile: (userId: string): UserProfile | null => {
    try {
      const profileJson = localStorage.getItem(`${PROFILES_KEY}_${userId}`);
      return profileJson ? JSON.parse(profileJson) : null;
    } catch (error) {
      return null;
    }
  },

  createOrUpdateProfile: (profile: UserProfile): void => {
    try {
      localStorage.setItem(`${PROFILES_KEY}_${profile.userId}`, JSON.stringify(profile));
    } catch (error) {
      console.error('Profile save error:', error);
    }
  },

  getAllProfiles: (): UserProfile[] => {
    try {
      const profiles: UserProfile[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(PROFILES_KEY)) {
          const profileJson = localStorage.getItem(key);
          if (profileJson) {
            profiles.push(JSON.parse(profileJson));
          }
        }
      }
      return profiles;
    } catch (error) {
      return [];
    }
  },

  followUser: (followerId: string, followingId: string): void => {
    try {
      const profile = communityService.getUserProfile(followerId);
      if (profile) {
        profile.following += 1;
        communityService.createOrUpdateProfile(profile);
      }

      const targetProfile = communityService.getUserProfile(followingId);
      if (targetProfile) {
        targetProfile.followers += 1;
        communityService.createOrUpdateProfile(targetProfile);
      }
    } catch (error) {
      console.error('Follow user error:', error);
    }
  },

  // ===== COMMUNITY METRICS =====
  getCourseMetrics: (courseId: string): CommunityMetrics => {
    const reviews = communityService.getReviewsForCourse(courseId);
    const comments = communityService.getCommentsForCourse(courseId);
    const topReview = reviews.length > 0 ? reviews.reduce((max, r) => (r.likes > max.likes ? r : max)) : undefined;

    // Get unique contributors
    const contributorIds = new Set<string>();
    reviews.forEach((r) => contributorIds.add(r.userId));
    comments.forEach((c) => contributorIds.add(c.userId));

    const topContributors = Array.from(contributorIds)
      .slice(0, 5)
      .map((id) => communityService.getUserProfile(id))
      .filter((p) => p !== null) as UserProfile[];

    return {
      totalReviews: reviews.length,
      averageRating: communityService.getAverageRating(courseId),
      mostHelpfulReview: topReview,
      commentsCount: comments.length,
      topContributors,
    };
  },

  // Helper: Generate user profile from user data
  generateUserProfile: (userId: string, userName: string, avatar: string | undefined): UserProfile => {
    return {
      userId,
      userName,
      avatar,
      bio: 'Learning enthusiast on AIMorpheus',
      coursesCompleted: 0,
      totalHoursLearned: 0,
      skills: [],
      achievements: [],
      reviews: [],
      followers: 0,
      following: 0,
      joinedAt: new Date().toISOString(),
    };
  },

  // ===== DISCUSSIONS & FORUMS =====
  getDiscussionsForPath: (pathId: string): DiscussionThread[] => {
    try {
      const discussionsJson = localStorage.getItem(`${DISCUSSIONS_KEY}_${pathId}`);
      return discussionsJson ? JSON.parse(discussionsJson) : [];
    } catch (error) {
      return [];
    }
  },

  createDiscussionThread: (pathId: string, thread: Omit<DiscussionThread, 'id' | 'createdAt' | 'replies' | 'views' | 'isAnswered'>): DiscussionThread => {
    try {
      const discussions = communityService.getDiscussionsForPath(pathId);
      const newThread: DiscussionThread = {
        ...thread,
        id: `thread-${Date.now()}`,
        createdAt: new Date().toISOString(),
        replies: [],
        views: 0,
        isAnswered: false,
      };
      discussions.unshift(newThread);
      localStorage.setItem(`${DISCUSSIONS_KEY}_${pathId}`, JSON.stringify(discussions));
      return newThread;
    } catch (error) {
      throw new Error('Failed to create discussion thread');
    }
  },

  addReplyToThread: (pathId: string, threadId: string, reply: Omit<DiscussionReply, 'id' | 'createdAt' | 'threadId'>): DiscussionReply => {
    try {
      const discussions = communityService.getDiscussionsForPath(pathId);
      const newReply: DiscussionReply = {
        ...reply,
        id: `reply-${Date.now()}`,
        threadId,
        createdAt: new Date().toISOString(),
      };
      
      const updatedDiscussions = discussions.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            replies: [...t.replies, newReply],
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      });
      
      localStorage.setItem(`${DISCUSSIONS_KEY}_${pathId}`, JSON.stringify(updatedDiscussions));
      return newReply;
    } catch (error) {
      throw new Error('Failed to add reply to thread');
    }
  },

  markThreadAsAnswered: (pathId: string, threadId: string): void => {
    try {
      const discussions = communityService.getDiscussionsForPath(pathId);
      const updated = discussions.map((t) =>
        t.id === threadId ? { ...t, isAnswered: true, updatedAt: new Date().toISOString() } : t
      );
      localStorage.setItem(`${DISCUSSIONS_KEY}_${pathId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Mark as answered error:', error);
    }
  },

  likeReply: (pathId: string, threadId: string, replyId: string): void => {
    try {
      const discussions = communityService.getDiscussionsForPath(pathId);
      const updated = discussions.map((t) => {
        if (t.id === threadId) {
          return {
            ...t,
            replies: t.replies.map((r) => (r.id === replyId ? { ...r, likes: r.likes + 1 } : r)),
          };
        }
        return t;
      });
      localStorage.setItem(`${DISCUSSIONS_KEY}_${pathId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Like reply error:', error);
    }
  },

  deleteThread: (pathId: string, threadId: string): void => {
    try {
      const discussions = communityService.getDiscussionsForPath(pathId);
      const filtered = discussions.filter((t) => t.id !== threadId);
      localStorage.setItem(`${DISCUSSIONS_KEY}_${pathId}`, JSON.stringify(filtered));
    } catch (error) {
      console.error('Delete thread error:', error);
    }
  },

  incrementThreadViews: (pathId: string, threadId: string): void => {
    try {
      const discussions = communityService.getDiscussionsForPath(pathId);
      const updated = discussions.map((t) =>
        t.id === threadId ? { ...t, views: t.views + 1 } : t
      );
      localStorage.setItem(`${DISCUSSIONS_KEY}_${pathId}`, JSON.stringify(updated));
    } catch (error) {
      console.error('Increment views error:', error);
    }
  },
};
