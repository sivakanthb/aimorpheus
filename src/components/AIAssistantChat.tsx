'use client';

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIAssistantChatProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export default function AIAssistantChat({ messages, onSendMessage }: AIAssistantChatProps) {
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim()) {
      setIsLoading(true);
      onSendMessage(inputValue);
      setInputValue('');
      setTimeout(() => setIsLoading(false), 600);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-96 bg-slate-800 border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden z-40 backdrop-blur-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-3 flex items-center gap-2 border-b border-slate-700/50">
        <span className="text-xl">🤖</span>
        <div>
          <h3 className="font-bold text-white text-sm">AI Learning Assistant</h3>
          <p className="text-xs text-purple-100">Always here to help</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs px-4 py-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none'
                  : 'bg-slate-700/60 text-slate-100 border border-slate-600/50 rounded-bl-none'
              }`}
            >
              <p className="leading-relaxed">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700/60 text-slate-100 border border-slate-600/50 px-4 py-2 rounded-lg rounded-bl-none">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-slate-700/50 bg-slate-800/80 backdrop-blur-sm">
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask me anything..."
            className="flex-1 bg-slate-700/40 border border-slate-600/50 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-cyan-500/50 focus:bg-slate-700/60 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!inputValue.trim() || isLoading}
            className="px-3 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
