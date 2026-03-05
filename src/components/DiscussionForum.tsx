'use client';

import { useState, useMemo } from 'react';
import type { DiscussionThread, User } from '@/types';
import { communityService } from '@/lib/community';

interface DiscussionForumProps {
  pathId: string;
  pathTitle: string;
  currentUser: User;
  onClose?: () => void;
}

export default function DiscussionForum({ pathId, pathTitle, currentUser, onClose }: DiscussionForumProps) {
  const [threads, setThreads] = useState<DiscussionThread[]>(communityService.getDiscussionsForPath(pathId));
  const [showNewThread, setShowNewThread] = useState(false);
  const [selectedThread, setSelectedThread] = useState<DiscussionThread | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'unanswered'>('recent');
  const [newThreadTitle, setNewThreadTitle] = useState('');
  const [newThreadDesc, setNewThreadDesc] = useState('');
  const [newThreadTags, setNewThreadTags] = useState('');
  const [newReplyContent, setNewReplyContent] = useState('');

  const sortedThreads = useMemo(() => {
    let sorted = [...threads];
    if (sortBy === 'recent') {
      sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'popular') {
      sorted.sort((a, b) => b.views - a.views || b.replies.length - a.replies.length);
    } else if (sortBy === 'unanswered') {
      sorted = sorted.filter((t) => !t.isAnswered).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return sorted;
  }, [threads, sortBy]);

  const handleCreateThread = () => {
    if (!newThreadTitle.trim() || !newThreadDesc.trim()) return;

    const newThread = communityService.createDiscussionThread(pathId, {
      pathId,
      title: newThreadTitle,
      description: newThreadDesc,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      tags: newThreadTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setThreads([newThread, ...threads]);
    setNewThreadTitle('');
    setNewThreadDesc('');
    setNewThreadTags('');
    setShowNewThread(false);
  };

  const handleAddReply = (threadId: string) => {
    if (!newReplyContent.trim()) return;

    communityService.addReplyToThread(pathId, threadId, {
      content: newReplyContent,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      isAnswer: false,
      likes: 0,
    });

    // Update local state
    const updatedThreads = threads.map((t) =>
      t.id === threadId
        ? {
            ...t,
            replies: communityService.getDiscussionsForPath(pathId).find((th) => th.id === threadId)?.replies || [],
          }
        : t
    );
    setThreads(updatedThreads);
    
    // Update selected thread if viewing it
    if (selectedThread?.id === threadId) {
      setSelectedThread(updatedThreads.find((t) => t.id === threadId) || null);
    }
    
    setNewReplyContent('');
  };

  const handleMarkAnswered = (threadId: string) => {
    communityService.markThreadAsAnswered(pathId, threadId);
    setThreads(threads.map((t) => (t.id === threadId ? { ...t, isAnswered: true } : t)));
    if (selectedThread?.id === threadId) {
      setSelectedThread({ ...selectedThread, isAnswered: true });
    }
  };

  const handleLikeReply = (threadId: string, replyId: string) => {
    communityService.likeReply(pathId, threadId, replyId);
    const updatedThreads = threads.map((t) =>
      t.id === threadId
        ? {
            ...t,
            replies: communityService.getDiscussionsForPath(pathId).find((th) => th.id === threadId)?.replies || [],
          }
        : t
    );
    setThreads(updatedThreads);
    if (selectedThread?.id === threadId) {
      setSelectedThread(updatedThreads.find((t) => t.id === threadId) || null);
    }
  };

  // If thread is selected, show thread detail
  if (selectedThread) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <button
          onClick={() => setSelectedThread(null)}
          className="flex items-center gap-2 text-cyan-300 hover:text-cyan-200 text-sm font-semibold transition-colors"
        >
          ← Back to Discussions
        </button>

        {/* Thread Header */}
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-slate-100 mb-2">{selectedThread.title}</h2>
              <p className="text-slate-400 text-sm mb-3">{selectedThread.description}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>By <span className="text-cyan-300">{selectedThread.userName}</span></span>
                <span>•</span>
                <span>{new Date(selectedThread.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{selectedThread.views} views</span>
                <span>•</span>
                <span>{selectedThread.replies.length} replies</span>
              </div>
            </div>
            {selectedThread.isAnswered && (
              <span className="px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full text-green-300 text-xs font-semibold">
                ✓ Answered
              </span>
            )}
          </div>

          {/* Tags */}
          {selectedThread.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedThread.tags.map((tag) => (
                <span key={tag} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300 border border-slate-600/30">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-slate-100">{selectedThread.replies.length} Replies</h3>

          {selectedThread.replies.map((reply) => (
            <div key={reply.id} className={`rounded-lg p-4 backdrop-blur-sm ${reply.isAnswer ? 'bg-green-600/10 border border-green-500/20' : 'bg-slate-800/50 border border-slate-700/30'}`}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-600/20 to-blue-600/20 border border-cyan-500/30 flex items-center justify-center text-sm">
                    {reply.userAvatar || '👤'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{reply.userName}</p>
                    <p className="text-xs text-slate-500">{new Date(reply.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {reply.isAnswer && (
                  <span className="px-2 py-1 bg-green-600/20 border border-green-500/30 rounded text-xs text-green-300 font-semibold">
                    Accepted Answer
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm mb-3">{reply.content}</p>
              <button
                onClick={() => handleLikeReply(selectedThread.id, reply.id)}
                className="text-xs text-slate-500 hover:text-cyan-300 transition-colors flex items-center gap-1"
              >
                👍 {reply.likes > 0 ? reply.likes : 'Helpful'}
              </button>
            </div>
          ))}
        </div>

        {/* Reply Form */}
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
          <h4 className="font-bold text-slate-100 mb-4">Add Your Reply</h4>
          <textarea
            value={newReplyContent}
            onChange={(e) => setNewReplyContent(e.target.value)}
            placeholder="Share your thoughts or answer..."
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded p-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none h-24 mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={() => handleAddReply(selectedThread.id)}
              className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-300 font-semibold text-sm transition-all"
            >
              Post Reply
            </button>
            {currentUser.id === selectedThread.userId && !selectedThread.isAnswered && (
              <button
                onClick={() => handleMarkAnswered(selectedThread.id)}
                className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-300 font-semibold text-sm transition-all"
              >
                Mark as Answered
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show list of threads
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-slate-100 mb-1">Discussion Forum</h2>
          <p className="text-slate-400 text-sm">{pathTitle}</p>
        </div>
        <button
          onClick={() => setShowNewThread(true)}
          className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-300 font-semibold text-sm transition-all"
        >
          + New Discussion
        </button>
      </div>

      {/* Sort Controls */}
      <div className="flex gap-2">
        {(['recent', 'popular', 'unanswered'] as const).map((sort) => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              sortBy === sort
                ? 'bg-cyan-600/30 border border-cyan-500/30 text-cyan-300'
                : 'bg-slate-800/50 border border-slate-700/30 text-slate-400 hover:text-slate-300'
            }`}
          >
            {sort}
          </button>
        ))}
      </div>

      {/* New Thread Form */}
      {showNewThread && (
        <div className="bg-slate-800/50 border border-cyan-500/20 rounded-lg p-6 backdrop-blur-sm">
          <h4 className="font-bold text-slate-100 mb-4">Start a New Discussion</h4>
          <input
            type="text"
            value={newThreadTitle}
            onChange={(e) => setNewThreadTitle(e.target.value)}
            placeholder="Thread title (be specific)..."
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded p-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 mb-3"
          />
          <textarea
            value={newThreadDesc}
            onChange={(e) => setNewThreadDesc(e.target.value)}
            placeholder="Describe your question or topic in detail..."
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded p-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 resize-none h-20 mb-3"
          />
          <input
            type="text"
            value={newThreadTags}
            onChange={(e) => setNewThreadTags(e.target.value)}
            placeholder="Tags (comma-separated, e.g. help, bug, feature)..."
            className="w-full bg-slate-900/50 border border-slate-700/50 rounded p-3 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 mb-4"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCreateThread}
              className="px-4 py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 rounded-lg text-cyan-300 font-semibold text-sm transition-all"
            >
              Create Discussion
            </button>
            <button
              onClick={() => setShowNewThread(false)}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700/70 border border-slate-600/30 rounded-lg text-slate-300 font-semibold text-sm transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Threads List */}
      <div className="space-y-3">
        {sortedThreads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400 mb-4">No discussions yet. Start the conversation!</p>
          </div>
        ) : (
          sortedThreads.map((thread) => (
            <button
              key={thread.id}
              onClick={() => {
                communityService.incrementThreadViews(pathId, thread.id);
                setSelectedThread({ ...thread, views: thread.views + 1 });
              }}
              className="w-full text-left bg-slate-800/50 border border-slate-700/30 hover:border-cyan-500/30 rounded-lg p-4 transition-all group backdrop-blur-sm"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">{thread.title}</h3>
                    {thread.isAnswered && (
                      <span className="text-xs px-2 py-1 bg-green-600/20 border border-green-500/30 rounded text-green-300 font-semibold">
                        ✓ Answered
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-400 line-clamp-2">{thread.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-3">
                  <span>By {thread.userName}</span>
                  <span>•</span>
                  <span>{new Date(thread.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>{thread.views} views</span>
                  <span>{thread.replies.length} replies</span>
                </div>
              </div>

              {thread.tags.length > 0 && (
                <div className="flex gap-1 mt-2">
                  {thread.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 bg-slate-700/50 rounded text-slate-400 border border-slate-600/30">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
