'use client';

import { useState, useMemo } from 'react';
import type { User, LearningPath } from '@/types';
import { communityService } from '@/lib/community';

interface CommunityHubProps {
  currentUser: User;
  allPaths: LearningPath[];
  onSelectPath: (pathId: string) => void;
}

export default function CommunityHub({ currentUser, allPaths, onSelectPath }: CommunityHubProps) {
  const [selectedFilter, setSelectedFilter] = useState<'recent' | 'trending' | 'toprated'>('recent');

  // Get all reviews across courses
  const allReviews = useMemo(() => {
    const reviews = [];
    for (const course of allPaths) {
      const courseReviews = communityService.getReviewsForCourse(course.id);
      reviews.push(...courseReviews.map((r) => ({ ...r, courseName: course.title })));
    }
    return reviews;
  }, [allPaths]);

  // Sort reviews based on filter
  const filteredReviews = useMemo(() => {
    let sorted = [...allReviews];
    if (selectedFilter === 'recent') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (selectedFilter === 'trending') {
      sorted.sort((a, b) => b.likes - a.likes);
    } else if (selectedFilter === 'toprated') {
      sorted.sort((a, b) => b.rating - a.rating);
    }
    return sorted.slice(0, 10);
  }, [allReviews, selectedFilter]);

  // Get top contributors
  const topContributors = useMemo(() => {
    const contributorsMap = new Map();
    allReviews.forEach((r) => {
      if (!contributorsMap.has(r.userId)) {
        const profile = communityService.getUserProfile(r.userId) || {
          userId: r.userId,
          userName: r.userName,
          avatar: r.userAvatar,
          reviews: [],
          followers: 0,
          following: 0,
        };
        contributorsMap.set(r.userId, { ...profile, reviewCount: 0 });
      }
      const contributor = contributorsMap.get(r.userId);
      contributor.reviewCount += 1;
    });

    return Array.from(contributorsMap.values())
      .sort((a, b) => b.reviewCount - a.reviewCount)
      .slice(0, 6);
  }, [allReviews]);

  // Get statistics
  const stats = useMemo(() => {
    return {
      totalReviews: allReviews.length,
      averageRating:
        allReviews.length > 0
          ? (allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length).toFixed(1)
          : '0',
      topContributorsCount: topContributors.length,
    };
  }, [allReviews, topContributors]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-slate-100 mb-2">🌍 Community Hub</h2>
        <p className="text-slate-400">Learn from other students and share your experience</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-cyan-500/20 rounded-lg p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Total Reviews</span>
            <span className="text-2xl">⭐</span>
          </div>
          <div className="text-3xl font-bold text-cyan-300">{stats.totalReviews}</div>
          <p className="text-slate-500 text-xs mt-2">Community feedback</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-emerald-500/20 rounded-lg p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Avg Rating</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="text-3xl font-bold text-emerald-300">{stats.averageRating}</div>
          <p className="text-slate-500 text-xs mt-2">Out of 5 stars</p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-purple-500/20 rounded-lg p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-slate-400 text-xs font-semibold uppercase tracking-wide">Contributors</span>
            <span className="text-2xl">👥</span>
          </div>
          <div className="text-3xl font-bold text-purple-300">{stats.topContributorsCount}</div>
          <p className="text-slate-500 text-xs mt-2">Active community members</p>
        </div>
      </div>

      {/* Top Contributors */}
      {topContributors.length > 0 && (
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-slate-700/60 rounded-lg p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-slate-100 mb-5">🏆 Top Contributors</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {topContributors.map((contributor, idx) => (
              <div key={contributor.userId} className="text-center">
                <div className="relative inline-block mb-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/30 rounded-full flex items-center justify-center text-2xl">
                    {contributor.avatar}
                  </div>
                  {idx < 3 && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🥉'}
                    </div>
                  )}
                </div>
                <p className="font-semibold text-slate-100 text-sm mb-1 truncate">{contributor.userName}</p>
                <p className="text-xs text-slate-400">{contributor.reviewCount} reviews</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews Filter */}
      <div className="flex gap-2 mb-4">
        {(['recent', 'trending', 'toprated'] as const).map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
              selectedFilter === filter
                ? 'bg-cyan-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {filter === 'recent' && '📅 Recent'}
            {filter === 'trending' && '🔥 Trending'}
            {filter === 'toprated' && '⭐ Top Rated'}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-8 text-center">
            <p className="text-slate-400">No reviews yet. Start exploring courses and share your feedback!</p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-5 hover:border-slate-600/60 transition-all cursor-pointer group"
              onClick={() => {
                const course = allPaths.find((p) => p.title === (review as any).courseName);
                if (course) onSelectPath(course.id);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{review.userAvatar}</span>
                    <span className="font-semibold text-slate-100">{review.userName}</span>
                    <span className="text-xs text-slate-500">
                      • {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mb-2 group-hover:text-cyan-300 transition-colors">
                    On: <span className="font-semibold">{(review as any).courseName}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className={`text-sm ${i <= review.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>

              <h4 className="font-semibold text-slate-100 mb-2">{review.title}</h4>
              <p className="text-slate-300 text-sm mb-3 line-clamp-2">{review.content}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">👍 {review.likes} found this helpful</span>
                {review.verified && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded">Verified Purchase</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
