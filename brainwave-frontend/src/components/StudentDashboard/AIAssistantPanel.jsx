import React, { useState } from 'react';

const AIAssistantPanel = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I\'m your study assistant. Ask me anything!' }
  ]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { role: 'ai', text: 'This is a placeholder response. AI features coming soon!' }]);
    }, 500);
    setInput('');
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">AI Assistant</h2>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md dark:shadow-gray-900/50 flex flex-col" style={{ height: 'calc(100vh - 200px)' }}>
        {/* Messages Area */}
        <div className="flex-1 p-6 overflow-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-4 py-2 rounded-2xl max-w-xs ${
                msg.role === 'ai' 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-gray-800 dark:text-gray-100' 
                  : 'bg-teal-600 text-white'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex gap-2">
            <input
              className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything..."
            />
            <button 
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition"
              onClick={handleSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
