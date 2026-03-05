'use client';

interface ResourcesProps {
  onBack: () => void;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: number;
  author: string;
  image: string;
}

const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Future of AI in Education',
    excerpt: 'Discover how artificial intelligence is transforming the way we learn and teach.',
    category: 'AI & Learning',
    readTime: 8,
    author: 'Dr. Sarah Chen',
    image: '🤖',
  },
  {
    id: '2',
    title: 'Mastering Deep Learning: A Beginner\'s Guide',
    excerpt: 'Start your deep learning journey with this comprehensive guide from basics to advanced concepts.',
    category: 'Deep Learning',
    readTime: 12,
    author: 'Prof. James Wilson',
    image: '🧠',
  },
  {
    id: '3',
    title: 'How to Build Your Learning Habit',
    excerpt: 'Learn proven strategies to develop a consistent learning habit that sticks.',
    category: 'Learning Tips',
    readTime: 6,
    author: 'Alex Rivera',
    image: '📚',
  },
  {
    id: '4',
    title: 'NLP Breakthroughs in 2025',
    excerpt: 'Explore the latest breakthroughs in Natural Language Processing and their applications.',
    category: 'NLP',
    readTime: 10,
    author: 'Dr. Emma Thompson',
    image: '💬',
  },
  {
    id: '5',
    title: 'Building ML Models That Scale',
    excerpt: 'Best practices for creating machine learning models that perform well in production.',
    category: 'Machine Learning',
    readTime: 15,
    author: 'Michael Zhang',
    image: '⚙️',
  },
  {
    id: '6',
    title: 'The Art of Effective Learning Review',
    excerpt: 'Optimize your learning with proven review techniques and spaced repetition methods.',
    category: 'Study Techniques',
    readTime: 7,
    author: 'Lisa Anderson',
    image: '📝',
  },
];

export default function Resources({ onBack }: ResourcesProps) {
  return (
    <div className="max-w-7xl mx-auto">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-semibold"
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800/80 to-slate-900/80 border border-slate-700/60 rounded-lg p-8 mb-8 backdrop-blur-sm">
        <h1 className="text-4xl font-bold text-slate-100 mb-2">📚 Learning Resources</h1>
        <p className="text-slate-400">Explore curated articles, guides, and insights on AI, machine learning, and effective learning strategies.</p>
      </div>

      {/* Categories Filter */}
      <div className="mb-8">
        <div className="flex gap-2 flex-wrap">
          {['All', 'AI & Learning', 'Deep Learning', 'NLP', 'Machine Learning', 'Learning Tips'].map((cat) => (
            <button
              key={cat}
              className="px-4 py-2 rounded-lg border border-slate-600/50 bg-slate-700/30 text-slate-300 hover:bg-slate-700/50 hover:border-cyan-500/50 text-sm font-semibold transition-all"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="bg-slate-800/50 border border-slate-700/60 rounded-lg overflow-hidden hover:border-slate-700 hover:bg-slate-800/70 transition-all group cursor-pointer"
          >
            {/* Image/Icon */}
            <div className="h-40 bg-gradient-to-br from-slate-700/50 to-slate-800/50 flex items-center justify-center text-6xl group-hover:from-slate-700 group-hover:to-slate-800 transition-all">
              {post.image}
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block px-2 py-1 bg-cyan-600/20 border border-cyan-500/30 rounded text-cyan-300 text-xs font-semibold">
                  {post.category}
                </span>
                <span className="text-xs text-slate-500">
                  {post.readTime} min read
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-cyan-300 transition-colors line-clamp-2">
                {post.title}
              </h3>

              <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                <span className="text-xs text-slate-500">by {post.author}</span>
                <button className="px-3 py-1 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/30 text-cyan-300 rounded text-xs font-semibold transition-all">
                  Read
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Featured Video Section */}
      <div className="bg-slate-800/50 border border-slate-700/60 rounded-lg p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">🎥 Featured Video Tutorials</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { title: 'Getting Started with Neural Networks', duration: '24:35', views: '12.5K' },
            { title: 'Advanced Python for Data Science', duration: '45:20', views: '8.2K' },
          ].map((video, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative h-40 bg-gradient-to-br from-slate-700/50 to-slate-800/50 rounded-lg flex items-center justify-center text-5xl mb-3 group-hover:from-slate-700 group-hover:to-slate-800 transition-all">
                ▶️
              </div>
              <h3 className="font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">{video.title}</h3>
              <p className="text-sm text-slate-400">{video.duration} • {video.views} views</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
