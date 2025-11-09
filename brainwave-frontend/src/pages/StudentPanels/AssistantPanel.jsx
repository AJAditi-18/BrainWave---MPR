import React, { useState, useRef, useEffect } from "react";

export default function AssistantPanel({ isDark }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! 👋 I'm your AI Assistant. How can I help you with your studies today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "I'm processing your question. This is a demo response. For real assistance, check back soon!" }
      ]);
    }, 800);
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg shadow-lg overflow-hidden`}>
      <h1 className="text-3xl font-bold p-6 border-b">AI Assistant</h1>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-3 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-lg ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white"
                  : isDark
                  ? "bg-gray-700 text-gray-100"
                  : "bg-gray-200 text-gray-900"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={sendMessage} className={`p-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"} flex gap-2`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          className={`flex-1 px-4 py-2 rounded-lg border ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } focus:outline-none`}
        />
        <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
          Send
        </button>
      </form>
    </div>
  );
}
