'use client';

import { useState } from 'react';
import type { CourseReview, User } from '@/types';
import { communityService } from '@/lib/community';

interface CourseReviewsProps {
  courseId: string;
  currentUser: User;
  onReviewAdded?: (review: CourseReview) => void;
}

export default function CourseReviews({ courseId, currentUser, onReviewAdded }: CourseReviewsProps) {
  const [reviews, setReviews] = useState<CourseReview[]>(communityService.getReviewsForCourse(courseId));
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const averageRating = communityService.getAverageRating(courseId);

  const handleSubmitReview = () => {
    if (!title.trim() || !content.trim()) return;

    const newReview = communityService.addReview(courseId, {
      courseId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || '👤',
      rating,
      title,
      content,
      verified: true,
      likes: 0,
    });

    setReviews([newReview, ...reviews]);
    setTitle('');
    setContent('');
    setRating(5);
    setShowForm(false);
    onReviewAdded?.(newReview);
  };

  const handleLikeReview = (reviewId: string) => {
    communityService.likeReview(courseId, reviewId);
    setReviews(reviews.map((r) => (r.id === reviewId ? { ...r, likes: r.likes + 1 } : r)));
  };

  const handleDeleteReview = (reviewId: string) => {
    communityService.deleteReview(courseId, reviewId);
    setReviews(reviews.filter((r) => r.id !== reviewId));
  };

  return (
    <div className="space-y-6">
      {/* Header with Rating */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-100 mb-2">Reviews & Ratings</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-cyan-300">{averageRating.toFixed(1)}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span
                    key={i}
                    className={`text-lg ${i <= Math.round(averageRating) ? 'text-yellow-400' : 'text-slate-600'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <span className="text-slate-400 text-sm">({reviews.length} reviews)</span>
          </div>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-300 font-semibold text-sm transition-all"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-5 backdrop-blur-sm">
          <h4 className="font-bold text-slate-100 mb-4">Share Your Experience</h4>

          {/* Rating Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  onClick={() => setRating(i)}
                  className="text-3xl transition-transform hover:scale-125"
                >
                  <span className={i <= rating ? 'text-yellow-400' : 'text-slate-600'}>★</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Excellent course!"
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-300 mb-2">Review</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share what you learned and your experience..."
              rows={4}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSubmitReview}
              disabled={!title.trim() || !content.trim()}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-lg font-semibold text-sm transition-all"
            >
              Post Review
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setTitle('');
                setContent('');
                setRating(5);
              }}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-lg font-semibold text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-lg p-6 text-center">
            <p className="text-slate-400">No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className="bg-slate-800/40 border border-slate-700/40 rounded-lg p-4 hover:border-slate-600/60 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{review.userAvatar}</span>
                  <div>
                    <p className="font-semibold text-slate-100">{review.userName}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`text-sm ${i <= review.rating ? 'text-yellow-400' : 'text-slate-600'}`}
                          >
                            ★
                          </span>
                        ))}
                      </div>
                      {review.verified && (
                        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {review.userId === currentUser.id && (
                  <button
                    onClick={() => handleDeleteReview(review.id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Delete
                  </button>
                )}
              </div>

              {/* Content */}
              <h4 className="font-semibold text-slate-100 mb-2">{review.title}</h4>
              <p className="text-slate-300 text-sm mb-3">{review.content}</p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleLikeReview(review.id)}
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-300 transition-colors"
                >
                  <span>👍</span>
                  <span>{review.likes} helpful</span>
                </button>
                <span className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
