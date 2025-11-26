// AIAssistantPanel.jsx
import React, { useState, useRef, useEffect } from 'react';

const AIAssistantPanel = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'ai',
      text: 'Hey! 👋 I\'m Brainwave AI Assistant. I\'m here to help you with your studies, answer questions about your schedule, assignments, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Frontend AI responses - no backend needed
  const generateAIResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    // Study help
    if (lowerMessage.includes('how to study') || lowerMessage.includes('study tips')) {
      return '📚 Here are some effective study tips:\n1. Break topics into smaller chunks\n2. Use the Pomodoro technique (25 min study + 5 min break)\n3. Create mind maps for complex topics\n4. Practice with previous year papers\n5. Teach others what you learned\n\nWould you like specific tips for any subject?';
    }

    // Schedule questions
    if (lowerMessage.includes('what\'s my timetable') || lowerMessage.includes('my schedule')) {
      return '📅 Your timetable is available in the Dashboard! Check the Weekly Timetable section to see all your classes and timings.';
    }

    // Exam questions
    if (lowerMessage.includes('when is my exam') || lowerMessage.includes('exam date')) {
      return '📝 Check the "Next Exam" section on your Dashboard to see your upcoming exams. You can also add exam dates in the Calendar panel!';
    }

    // Assignment questions
    if (lowerMessage.includes('assignment') || lowerMessage.includes('homework')) {
      return '📋 Your assignments are listed in the Dashboard under "Next Assignment". You can add new assignments through the Calendar panel with due dates!';
    }

    // Reminders
    if (lowerMessage.includes('reminder') || lowerMessage.includes('remind me')) {
      return '🔔 You can set reminders in the Calendar panel! Click on any date and add a reminder. All reminders will be displayed in your Dashboard.';
    }

    // Holiday questions
    if (lowerMessage.includes('holiday') || lowerMessage.includes('break')) {
      return '🌴 Check the "Next Holiday" section in your Dashboard to see upcoming holidays. You can add new holidays in the Calendar panel!';
    }

    // Time management
    if (lowerMessage.includes('time management') || lowerMessage.includes('manage time')) {
      return '⏱️ Time Management Tips:\n1. Plan your day the night before\n2. Prioritize tasks (Important vs Urgent)\n3. Use your timetable to organize classes\n4. Set reminders for important tasks\n5. Take regular breaks\n6. Review and adjust your schedule\n\nUse the Dashboard and Calendar to track everything!';
    }

    // Subject help
    if (lowerMessage.includes('help with') || lowerMessage.includes('explain')) {
      return '🎓 I can provide study guidance! Try asking me:\n- "How to study for Math?"\n- "Study tips for programming"\n- "How to prepare for exams?"\n- "Time management advice"\n\nWhat subject do you need help with?';
    }

    // Calendar help
    if (lowerMessage.includes('calendar') || lowerMessage.includes('add event')) {
      return '📅 In the Calendar panel, you can:\n1. Add new events (exams, assignments, holidays)\n2. Set event types (exam, assignment, holiday)\n3. Add descriptions and dates\n4. View all your scheduled events\n5. Link events to your dashboard\n\nClick on a date to add an event!';
    }

    // Dashboard help
    if (lowerMessage.includes('dashboard') || lowerMessage.includes('stats')) {
      return '📊 Your Dashboard shows:\n1. SHIFT - Your class shift\n2. CLASSES TODAY - Today\'s classes\n3. REMINDERS - Active reminders count\n4. EVENTS - Total events created\n5. Next Exam - Upcoming exam\n6. Weekly Timetable - All your classes\n7. Upcoming Events - Holidays, assignments, reminders\n\nEverything syncs automatically!';
    }

    // Timetable editing
    if (lowerMessage.includes('edit timetable') || lowerMessage.includes('update timetable')) {
      return '✏️ To edit your timetable:\n1. Go to Dashboard\n2. Click "✏️ Edit" button on Weekly Timetable\n3. Fill in Subject, Teacher name, and Room number\n4. Click "💾 Save Changes"\n\nYour timetable will be saved locally!';
    }

    // General greetings
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return 'Hi there! 👋 I\'m here to help you with your studies and manage your academic schedule. Ask me about:\n- Study tips\n- Your schedule and timetable\n- Exams and assignments\n- Time management\n- Or anything about using Brainwave!\n\nWhat can I help you with?';
    }

    // Thank you
    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return 'You\'re welcome! 😊 Feel free to ask me anything else about your studies or how to use Brainwave. I\'m always here to help!';
    }

    // Default response
    return '🤔 I understand you\'re asking about: ' + userMessage + '\n\nTry asking me about:\n- Study tips and techniques\n- Your schedule and timetable\n- Exams and assignments\n- Reminders and events\n- Time management\n- How to use Dashboard features\n\nHow can I assist you better?';
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    // Simulate delay for better UX
    setTimeout(() => {
      const aiReply = generateAIResponse(userInput);
      const aiMessage = {
        id: messages.length + 2,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-2xl mx-auto h-screen flex flex-col">
        {/* HEADER */}
        <div className="mb-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            🤖 Brainwave AI Assistant
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Ask me anything about your studies, schedule, and assignments!
          </p>
        </div>

        {/* CHAT CONTAINER */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-4 overflow-y-auto">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg whitespace-pre-wrap ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white rounded-br-none'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user'
                        ? 'text-blue-100'
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* INPUT AREA */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <div className="flex gap-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your question... (Shift+Enter for new line)"
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none max-h-32"
              rows="3"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className={`px-6 py-2 rounded-lg font-semibold transition-all h-fit ${
                isLoading || !inputMessage.trim()
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isLoading ? '⏳ Sending...' : '📤 Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPanel;
