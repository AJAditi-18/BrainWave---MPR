import React, { useState } from 'react';

const AIAssistantPanel = ({ token, teacherId }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'ai', 
      text: 'Hello! I\'m your AI teaching assistant. I can help you with lesson planning, grading suggestions, student performance analysis, and more. How can I assist you today?' 
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      const aiResponse = {
        role: 'ai',
        text: 'This is a placeholder response. AI integration coming soon! Your question was: "' + input + '"'
      };
      setMessages(prev => [...prev, aiResponse]);
      setLoading(false);
    }, 1000);
  };

  const quickPrompts = [
    'Suggest creative teaching methods',
    'How to improve student engagement?',
    'Create a quiz on data structures',
    'Analyze class performance trends'
  ];

  const handleQuickPrompt = (prompt) => {
    setInput(prompt);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">AI Teaching Assistant</h2>

      {/* Quick Prompts */}
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Quick prompts:</p>
        <div className="flex flex-wrap gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickPrompt(prompt)}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition text-sm"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md flex flex-col" style={{ height: 'calc(100vh - 350px)' }}>
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-5 py-3 rounded-2xl max-w-2xl ${
                msg.role === 'ai' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-gray-800 dark:text-gray-100' 
                  : 'bg-teal-600 text-white'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="text-left mb-4">
              <div className="inline-block px-5 py-3 rounded-2xl bg-blue-100 dark:bg-blue-900/30">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Ask me anything about teaching, lesson planning, or student management..."
              disabled={loading}
            />
            <button 
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-xl font-semibold transition flex items-center gap-2"
              onClick={handleSend}
              disabled={loading || !input.trim()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
