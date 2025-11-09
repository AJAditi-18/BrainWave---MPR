import React, { useState, useRef, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712027.png";

const Chatbot = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! 👋 How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    // Simulate bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Thanks for your message! I'll help you shortly." }
      ]);
    }, 800);
  };

  if (!open) return null;

  return (
    <div
      style={{
        width: "400px",
        height: "500px",
        backgroundColor: "#fff",
        borderRadius: "12px",
        boxShadow: "0 10px 40px rgba(0, 0, 0, 0.2)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "slideUp 0.3s ease-out",
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: "#06b6d4",
          color: "white",
          padding: "1rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="flex items-center space-x-2">
          <img
            src={BOT_AVATAR}
            alt="Bot"
            style={{ width: "32px", height: "32px", borderRadius: "50%" }}
          />
          <div>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: "bold" }}>
              Brainwave Assistant
            </h3>
            <p style={{ margin: 0, fontSize: "0.75rem", opacity: 0.8 }}>
              Always here to help
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "white",
            cursor: "pointer",
            fontSize: "1.5rem",
            padding: 0,
          }}
        >
          <XMarkIcon className="h-5 w-5" />
        </button>
      </div>

      {/* Messages Container */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
          backgroundColor: "#f9fafb",
        }}
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                maxWidth: "70%",
                padding: "0.75rem 1rem",
                borderRadius: "12px",
                backgroundColor: msg.sender === "user" ? "#06b6d4" : "#e5e7eb",
                color: msg.sender === "user" ? "white" : "#1f2937",
                fontSize: "0.95rem",
                wordWrap: "break-word",
                lineHeight: "1.4",
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={sendMessage}
        style={{
          display: "flex",
          gap: "0.5rem",
          padding: "1rem",
          borderTop: "1px solid #e5e7eb",
          backgroundColor: "white",
        }}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{
            flex: 1,
            padding: "0.75rem",
            border: "1px solid #d1d5db",
            borderRadius: "8px",
            fontSize: "0.95rem",
            outline: "none",
            transition: "border-color 0.2s",
          }}
          onFocus={(e) => (e.target.style.borderColor = "#06b6d4")}
          onBlur={(e) => (e.target.style.borderColor = "#d1d5db")}
        />
        <button
          type="submit"
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#06b6d4",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
            transition: "background-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#22d3ee")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#06b6d4")}
        >
          Send
        </button>
      </form>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default Chatbot;
