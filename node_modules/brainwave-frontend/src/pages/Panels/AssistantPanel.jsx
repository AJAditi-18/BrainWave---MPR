import React, { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";

export default function AssistantPanel({ isDark }) {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! 👋 How can I assist you today?" }
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
        { sender: "bot", text: "Thanks for your message! I'll help you shortly." }
      ]);
    }, 800);
  };

  return (
    <div className={`h-full flex flex-col ${isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"} rounded-lg shadow-lg`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? "border-gray-700" : "border-gray-200"} flex items-center space-x-3`}>
        <img src={BOT_AVATAR} alt="Bot" className="w-10 h-10 rounded-full" />
        <div>
          <h2 className="text-xl font-bold">Brainwave Assistant</h2>
          <p className="text-sm opacity-70">Always here to help</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-3 ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[70%] px-4 py-2 rounded-lg ${
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

      {/* Input Form */}
      <form onSubmit={sendMessage} className={`p-4 border-t ${isDark ? "border-gray-700" : "border-gray-200"} flex gap-2`}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className={`flex-1 px-4 py-2 rounded-lg border ${
            isDark
              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Send
        </button>
      </form>
    </div>
  );
}
