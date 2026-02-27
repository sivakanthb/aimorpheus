'use client';

import { useState } from 'react';
import type { RecommendationResult, UserRequirements, LearningPath } from '@/types';
import LearningPathCard from './LearningPathCard';
import PathDetailModal from './PathDetailModal';

interface RecommendationsDisplayProps {
  result: RecommendationResult;
  requirements: UserRequirements;
  onReset: () => void;
}

export default function RecommendationsDisplay({
  result,
  requirements,
  onReset,
}: RecommendationsDisplayProps) {
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);

  return (
      <div className="space-y-8">
      {/* Header with Explanation */}
      <div className="bg-gradient-to-br from-blue-700/80 via-indigo-700/70 to-purple-700/70 text-white rounded-2xl shadow-2xl p-5 mb-6 border border-purple-600/30 backdrop-blur-sm">
        <h2 className="text-2xl font-bold mb-2">Your Personalized Learning Paths</h2>
        <p className="text-sm text-blue-50/80 mb-4">{result.explanation}</p>

        {/* User Profile Summary */}
        <div className="bg-slate-800/60 rounded-lg p-4 mb-4 border border-slate-600/40">
          <h3 className="text-sm font-semibold text-white mb-3">Your Profile:</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-sm">
            <div>
              <span className="text-cyan-300/80">Skill Level:</span>
              <div className="font-semibold">{requirements.skillLevel}</div>
            </div>
            <div>
              <span className="text-cyan-300/80">Weekly Time:</span>
              <div className="font-semibold">{requirements.timePerWeek}</div>
            </div>
            <div>
              <span className="text-cyan-300/80">Expertise:</span>
              <div className="font-semibold">{requirements.expertise}</div>
            </div>
            <div>
              <span className="text-cyan-300/80">Learning Style:</span>
              <div className="font-semibold">{requirements.learningStyle}</div>
            </div>
            <div>
              <span className="text-cyan-300/80">Capabilities:</span>
              <div className="font-semibold">{requirements.capability.length} selected</div>
            </div>
          </div>
        </div>

        <button
          onClick={onReset}
          className="mt-2 bg-slate-700/60 text-blue-200/80 hover:bg-slate-600/60 font-semibold py-1.5 px-4 rounded-lg transition-colors border border-slate-600/40 hover:border-blue-400/60 text-sm"
        >
          ← Modify Profile
        </button>
      </div>

      {/* Top Recommendation Highlighted */}
      {result.paths.length > 0 && (
        <div className="bg-slate-800/70 border-2 border-cyan-400/40 rounded-2xl p-4 mb-5 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-cyan-300/80 mb-3">🎯 Top Recommendation</h3>
          <LearningPathCard
            path={result.paths[0]}
            isRecommended={true}
            onSelect={setSelectedPath}
          />
        </div>
      )}

      {/* All Recommended Paths */}
      <div className="mb-5">
        <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300 mb-4">Other Great Options</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {result.paths.slice(1).map((path) => (
            <LearningPathCard
              key={path.id}
              path={path}
              isRecommended={false}
              onSelect={setSelectedPath}
            />
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/40 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-cyan-300/80 mb-3">⚡ Quick Stats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-700/60 rounded-lg p-3 shadow-lg border border-slate-600/40 hover:border-cyan-400/40 transition-all">
            <div className="text-2xl font-bold text-cyan-300/80 mb-1">
              {Math.round(
                result.paths.reduce((sum, path) => sum + path.estimatedHours, 0) /
                  result.paths.length
              )}
            </div>
            <p className="text-gray-400 text-xs">Average Hours per Path</p>
          </div>
          <div className="bg-slate-700/60 rounded-lg p-3 shadow-lg border border-slate-600/40 hover:border-emerald-400/40 transition-all">
            <div className="text-2xl font-bold text-emerald-300/80 mb-1">
              {Math.round(
                (result.paths.reduce((sum, path) => sum + (path.matchScore || 0), 0) /
                  result.paths.length) as any
              )}
              %
            </div>
            <p className="text-gray-400 text-xs">Average Match Score</p>
          </div>
          <div className="bg-slate-700/60 rounded-lg p-3 shadow-lg border border-slate-600/40 hover:border-purple-400/40 transition-all">
            <div className="text-2xl font-bold text-purple-300/80 mb-1">{result.paths.length}</div>
            <p className="text-gray-400 text-xs">Recommended Paths</p>
          </div>
        </div>
      </div>

      {/* Hands-On Learning Resources */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/40 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-cyan-300/80 mb-2">🛠️ Hands-On Learning Resources</h3>
        <p className="text-sm text-gray-300 mb-4">
          Theory is important, but practice makes perfect! Here are some excellent platforms and websites where you can experiment, build projects, and reinforce your learning:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Python & ML */}
          <div className="bg-slate-700/50 rounded-lg p-4 shadow-sm border border-slate-600/40">
            <h4 className="font-bold text-sm text-blue-300/80 mb-2">🐍 Python & Machine Learning</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• <strong>Kaggle.com</strong> - Datasets, competitions, and notebooks</li>
              <li>• <strong>Google Colab</strong> - Free Jupyter notebooks in the cloud</li>
              <li>• <strong>Scikit-learn</strong> - Interactive tutorials and documentation</li>
              <li>• <strong>TensorFlow Playground</strong> - Visualize neural networks in real-time</li>
            </ul>
          </div>

          {/* AI & LLM Tools */}
          <div className="bg-slate-700/50 rounded-lg p-4 shadow-sm border border-slate-600/40">
            <h4 className="font-bold text-sm text-purple-300/80 mb-2">🎨 Generative AI & LLMs</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• <strong>ChatGPT / Claude</strong> - Experiment with language models</li>
              <li>• <strong>Hugging Face</strong> - Pre-trained models and datasets</li>
              <li>• <strong>RunwayML</strong> - AI creative tools for vision and generation</li>
              <li>• <strong>GitHub Copilot</strong> - AI-powered code assistant</li>
            </ul>
          </div>

          {/* Computer Vision */}
          <div className="bg-slate-700/50 rounded-lg p-4 shadow-sm border border-slate-600/40">
            <h4 className="font-bold text-sm text-cyan-300/80 mb-2">👁️ Computer Vision</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• <strong>OpenCV Tutorials</strong> - Image processing playground</li>
              <li>• <strong>Roboflow</strong> - Build and test vision models</li>
              <li>• <strong>MediaPipe</strong> - Ready-to-use ML solutions</li>
              <li>• <strong>Fast.ai</strong> - Top-down learning approach</li>
            </ul>
          </div>

          {/* Interactive Learning */}
          <div className="bg-slate-700/50 rounded-lg p-4 shadow-sm border border-slate-600/40">
            <h4 className="font-bold text-sm text-emerald-300/80 mb-2">📚 Interactive & Community</h4>
            <ul className="space-y-1 text-xs text-gray-300">
              <li>• <strong>Coursera / edX</strong> - Hands-on projects with certificates</li>
              <li>• <strong>GitHub</strong> - Browse open-source AI projects</li>
              <li>• <strong>Stack Overflow</strong> - Get help from the community</li>
              <li>• <strong>YouTube Channels</strong> - 3Blue1Brown, StatQuest, Andrej Karpathy</li>
            </ul>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-700/40 rounded-lg border border-slate-600/40">
          <p className="text-xs text-gray-300 font-semibold">
            💡 Pro Tip: Start with small projects that interest you, then gradually increase complexity. Building real projects is the fastest way to learn!
          </p>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/40 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-cyan-300/80 mb-3">💬 We'd Love Your Feedback!</h3>
        <p className="text-sm text-gray-300 mb-4">
          Your feedback helps us improve AIMorpheus. Please share your thoughts on the UI, layout, navigation, and overall experience.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md text-sm">
            📧 Send Feedback
          </button>
          <button className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold py-2 px-4 rounded-lg transition-all shadow-md text-sm">
            ⭐ Rate Application
          </button>
        </div>
      </div>

      {/* Articles on AI Section */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/40 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-blue-300/80 mb-3">📰 Featured AI Articles</h3>
        <p className="text-sm text-gray-300 mb-4">
          Stay updated with the latest articles on AI, machine learning, and emerging technologies from industry experts.
        </p>

        <div className="space-y-2">
          <a href="#" className="block bg-slate-700/50 hover:bg-slate-700/70 rounded-lg p-3 border border-slate-600/40 transition-all group">
            <p className="font-semibold text-blue-300/80 group-hover:text-blue-300 text-sm">Scaling Transformer Models: New Approaches to Parameter Efficiency</p>
            <p className="text-gray-400 text-xs mt-1">Nature Machine Intelligence • 2 days ago</p>
          </a>

          <a href="#" className="block bg-slate-700/50 hover:bg-slate-700/70 rounded-lg p-3 border border-slate-600/40 transition-all group">
            <p className="font-semibold text-blue-300/80 group-hover:text-blue-300 text-sm">AI Safety: Building Robustness in Large Language Models</p>
            <p className="text-gray-400 text-xs mt-1">DeepMind Blog • 5 days ago</p>
          </a>

          <a href="#" className="block bg-slate-700/50 hover:bg-slate-700/70 rounded-lg p-3 border border-slate-600/40 transition-all group">
            <p className="font-semibold text-blue-300/80 group-hover:text-blue-300 text-sm">The Future of Multimodal AI: Vision, Language, and Beyond</p>
            <p className="text-gray-400 text-xs mt-1">OpenAI Research • 1 week ago</p>
          </a>

          <a href="#" className="block bg-slate-700/50 hover:bg-slate-700/70 rounded-lg p-3 border border-slate-600/40 transition-all group">
            <p className="font-semibold text-blue-300/80 group-hover:text-blue-300 text-sm">Reinforcement Learning Breakthroughs in Robotics Control</p>
            <p className="text-gray-400 text-xs mt-1">MIT News • 1 week ago</p>
          </a>
        </div>
      </div>

      {/* Books on AI Section */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/40 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-purple-300/80 mb-3">📚 Essential AI & ML Books</h3>
        <p className="text-sm text-gray-300 mb-4">
          Recommended reading to deepen your understanding of AI fundamentals, practical applications, and advanced concepts.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/40 hover:border-purple-400/40 transition-all">
            <p className="font-semibold text-purple-300/80 text-sm">Deep Learning</p>
            <p className="text-gray-400 text-xs mt-1">Goodfellow, Bengio, Courville • MIT Press</p>
            <p className="text-gray-300 text-xs mt-2">Comprehensive introduction to deep learning including CNNs, RNNs, and modern architectures.</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/40 hover:border-purple-400/40 transition-all">
            <p className="font-semibold text-purple-300/80 text-sm">Hands-On ML with Scikit-Learn, Keras, and TensorFlow</p>
            <p className="text-gray-400 text-xs mt-1">Aurélien Géron • O'Reilly</p>
            <p className="text-gray-300 text-xs mt-2">Practical guide with code examples for building production-ready ML systems.</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/40 hover:border-purple-400/40 transition-all">
            <p className="font-semibold text-purple-300/80 text-sm">Attention is All You Need (The Transformer Paper)</p>
            <p className="text-gray-400 text-xs mt-1">Vaswani et al. • NeurIPS 2017</p>
            <p className="text-gray-300 text-xs mt-2">Foundational paper on transformers that revolutionized NLP and beyond.</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/40 hover:border-purple-400/40 transition-all">
            <p className="font-semibold text-purple-300/80 text-sm">Artificial Intelligence: A Modern Approach</p>
            <p className="text-gray-400 text-xs mt-1">Russell & Norvig • Pearson</p>
            <p className="text-gray-300 text-xs mt-2">Classic textbook covering search, NLP, computer vision, and intelligent systems.</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/40 hover:border-purple-400/40 transition-all">
            <p className="font-semibold text-purple-300/80 text-sm">The Hundred-Page ML Book</p>
            <p className="text-gray-400 text-xs mt-1">Andriy Burkov • Self-published</p>
            <p className="text-gray-300 text-xs mt-2">Concise guide to ML algorithms and practical implementation strategies.</p>
          </div>

          <div className="bg-slate-700/50 rounded-lg p-3 border border-slate-600/40 hover:border-purple-400/40 transition-all">
            <p className="font-semibold text-purple-300/80 text-sm">LLM Fundamentals: Build Practical Generative AI Applications</p>
            <p className="text-gray-400 text-xs mt-1">Liam Ottley · O'Reilly</p>
            <p className="text-gray-300 text-xs mt-2">Practical guide for building production systems with large language models.</p>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="bg-slate-800/80 rounded-2xl border border-slate-700/40 p-6 backdrop-blur-sm">
        <h3 className="text-lg font-bold text-blue-300/80 mb-2">📝 AI Thoughts & Blog</h3>
        <p className="text-sm text-gray-300 mb-4">
          Share your insights, ideas, and discussions about AI with our community. What are you learning? What challenges are you facing? What excites you about AI?
        </p>

        <div className="space-y-3">
          {/* Blog Post Input */}
          <div>
            <textarea
              placeholder="Share your thoughts on AI, machine learning, or your learning journey..."
              className="w-full bg-slate-700/50 text-gray-200 placeholder-gray-400 border border-slate-600/40 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-400/60 focus:ring-1 focus:ring-blue-400/30 resize-none"
              rows={3}
            ></textarea>
          </div>

          {/* Post Button */}
          <div className="flex gap-2">
            <button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition-all shadow-md text-sm">
              📤 Post Thought
            </button>
            <button className="bg-slate-700/60 text-gray-300 hover:bg-slate-600/60 font-semibold py-2 px-4 rounded-lg transition-all border border-slate-600/40 text-sm">
              Clear
            </button>
          </div>
        </div>

        {/* Sample Blog Posts */}
        <div className="mt-6 space-y-3 border-t border-slate-700/40 pt-4">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-3">Community Insights</p>
          
          <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/40">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-blue-300/80 text-sm">Alex Chen</p>
                <p className="text-xs text-gray-400">2 days ago</p>
              </div>
              <span className="text-xs bg-slate-600/50 text-blue-300/80 px-2 py-1 rounded border border-slate-600/40">#LLMs</span>
            </div>
            <p className="text-gray-300 text-sm">Just completed the Generative AI pathway! The hands-on projects with LangChain were eye-opening. Excited to build my own AI assistant next.</p>
          </div>

          <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/40">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-cyan-300/80 text-sm">Jordan Miles</p>
                <p className="text-xs text-gray-400">1 week ago</p>
              </div>
              <span className="text-xs bg-slate-600/50 text-cyan-300/80 px-2 py-1 rounded border border-slate-600/40">#PyTorch</span>
            </div>
          <p className="text-gray-300 text-sm mb-4">Struggling with overfitting in my CNN model. Any recommendations for regularization techniques? Looking to use AIMorpheus to strengthen my foundations.</p>
          </div>

          <div className="bg-slate-700/40 rounded-lg p-3 border border-slate-600/40">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-semibold text-emerald-300/80 text-sm">Sam Rivera</p>
                <p className="text-xs text-gray-400">3 days ago</p>
              </div>
              <span className="text-xs bg-slate-600/50 text-emerald-300/80 px-2 py-1 rounded border border-slate-600/40">#ComputerVision</span>
            </div>
            <p className="text-gray-300 text-sm">The Computer Vision pathway helped me land an intern position in robotics! Thanks to the hands-on resources, I was confident during interviews. 🚀</p>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedPath && (
        <PathDetailModal
          path={selectedPath}
          onClose={() => setSelectedPath(null)}
        />
      )}
    </div>
  );
}
