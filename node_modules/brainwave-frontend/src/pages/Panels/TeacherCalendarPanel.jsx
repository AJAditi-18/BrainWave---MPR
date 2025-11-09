import React, { useState } from "react";
import {
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  XMarkIcon,
  BellIcon,
  ClipboardIcon,
} from "@heroicons/react/24/outline";

export default function TeacherCalendarPanel({ isDark }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Midterm Exams - DSA",
      date: "2025-11-20",
      type: "exam",
      subject: "Data Structures",
      time: "10:00 AM",
      duration: "2 hours",
      room: "Lab A1",
      students: 45,
    },
    {
      id: 2,
      title: "Parent-Teacher Meeting",
      date: "2025-11-22",
      type: "meeting",
      time: "3:00 PM",
      description: "Discussing student progress",
    },
    {
      id: 3,
      title: "Final Project Submission",
      date: "2025-11-30",
      type: "deadline",
      subject: "Web Development",
      description: "All students must submit their projects",
    },
    {
      id: 4,
      title: "Class Test - Math",
      date: "2025-11-15",
      type: "exam",
      subject: "Mathematics",
      time: "2:00 PM",
      duration: "1.5 hours",
    },
  ]);
  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    type: "exam",
    subject: "",
    time: "",
    duration: "",
    room: "",
    description: "",
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (!newEvent.title || !newEvent.date) {
      alert("Please fill in title and date");
      return;
    }

    if (editingEvent) {
      setEvents(events.map((ev) => (ev.id === editingEvent.id ? { ...newEvent, id: ev.id } : ev)));
      setEditingEvent(null);
    } else {
      setEvents([...events, { ...newEvent, id: Date.now() }]);
    }

    setNewEvent({ title: "", date: "", type: "exam", subject: "", time: "", duration: "", room: "", description: "" });
    setShowEventForm(false);
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((ev) => ev.id !== id));
  };

  const handleEditEvent = (event) => {
    setNewEvent(event);
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const getEventsForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((ev) => ev.date === dateStr);
  };

  const getEventColor = (type) => {
    switch (type) {
      case "exam":
        return "bg-red-100 border-red-500 text-red-800";
      case "meeting":
        return "bg-blue-100 border-blue-500 text-blue-800";
      case "deadline":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "event":
        return "bg-green-100 border-green-500 text-green-800";
      default:
        return "bg-gray-100 border-gray-500 text-gray-800";
    }
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  return (
    <div className={`${isDark ? "text-white" : "text-gray-900"}`}>
      <h1 className="text-3xl font-bold mb-6">📅 Calendar & Exam Dates</h1>

      {/* Add Event Button */}
      <div className="mb-6">
        <button
          onClick={() => {
            setShowEventForm(!showEventForm);
            setEditingEvent(null);
            setNewEvent({ title: "", date: "", type: "exam", subject: "", time: "", duration: "", room: "", description: "" });
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Add Event / Exam Date
        </button>
      </div>

      {/* Event Form */}
      {showEventForm && (
        <div className={`p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-600 ${isDark ? "bg-gray-700" : "bg-blue-50"}`}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{editingEvent ? "Edit Event" : "Create New Event"}</h2>
            <button
              onClick={() => {
                setShowEventForm(false);
                setEditingEvent(null);
              }}
              className="text-gray-500 hover:text-red-500"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleAddEvent} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Title */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Event Title *
                </label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  placeholder="e.g., Midterm Exam - DSA"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Date */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Date *
                </label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Event Type */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Event Type *
                </label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                >
                  <option value="exam">📝 Exam</option>
                  <option value="meeting">👥 Meeting</option>
                  <option value="deadline">⏰ Deadline</option>
                  <option value="event">🎉 Event</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Subject (if exam)
                </label>
                <input
                  type="text"
                  value={newEvent.subject}
                  onChange={(e) => setNewEvent({ ...newEvent, subject: e.target.value })}
                  placeholder="e.g., Data Structures"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Time */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Time
                </label>
                <input
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Duration */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Duration
                </label>
                <input
                  type="text"
                  value={newEvent.duration}
                  onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                  placeholder="e.g., 2 hours"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>

              {/* Room/Location */}
              <div>
                <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                  Room/Location
                </label>
                <input
                  type="text"
                  value={newEvent.room}
                  onChange={(e) => setNewEvent({ ...newEvent, room: e.target.value })}
                  placeholder="e.g., Lab A1"
                  className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    isDark
                      ? "bg-gray-600 border-gray-500 text-white"
                      : "bg-white border-gray-300 text-gray-900"
                  }`}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>
                Description
              </label>
              <textarea
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Additional details..."
                rows="3"
                className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                  isDark
                    ? "bg-gray-600 border-gray-500 text-white"
                    : "bg-white border-gray-300 text-gray-900"
                }`}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {editingEvent ? "💾 Update Event" : "✅ Add Event"}
            </button>
          </form>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-2">
          <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={handlePrevMonth}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                ← Previous
              </button>
              <h2 className="text-2xl font-bold">
                {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button
                onClick={handleNextMonth}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
              >
                Next →
              </button>
            </div>

            {/* Weekdays */}
            <div className="grid grid-cols-7 gap-2 mb-2">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className={`text-center font-bold py-2 rounded ${
                    isDark ? "bg-gray-600" : "bg-gray-200"
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              {days.map((day, index) => {
                const dayEvents = day ? getEventsForDate(day) : [];
                return (
                  <div
                    key={index}
                    className={`min-h-24 p-2 rounded-lg border ${
                      day
                        ? isDark
                          ? "bg-gray-600 border-gray-500"
                          : "bg-gray-50 border-gray-300"
                        : isDark
                        ? "bg-gray-800"
                        : "bg-gray-100"
                    } ${day && dayEvents.length > 0 ? "border-2 border-blue-500" : ""}`}
                  >
                    {day && (
                      <>
                        <p className="font-bold mb-1 text-sm">{day}</p>
                        <div className="space-y-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`text-xs p-1 rounded border-l-2 ${getEventColor(event.type)} cursor-pointer hover:opacity-80`}
                              title={event.title}
                            >
                              {event.type === "exam" ? "📝" : event.type === "meeting" ? "👥" : event.type === "deadline" ? "⏰" : "🎉"}{" "}
                              {event.title.substring(0, 12)}...
                            </div>
                          ))}
                          {dayEvents.length > 2 && (
                            <p className="text-xs text-blue-600 font-semibold">+{dayEvents.length - 2} more</p>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className={`p-6 rounded-lg shadow-md ${isDark ? "bg-gray-700" : "bg-white"}`}>
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <BellIcon className="h-6 w-6" />
            Upcoming Events
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {events
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 10)
              .map((event) => (
                <div
                  key={event.id}
                  className={`p-3 rounded-lg border-l-4 ${getEventColor(event.type)}`}
                >
                  <p className="font-bold text-sm">{event.title}</p>
                  <p className="text-xs opacity-75 mt-1">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </p>
                  {event.time && <p className="text-xs opacity-75">⏱️ {event.time}</p>}
                  {event.subject && <p className="text-xs opacity-75">📚 {event.subject}</p>}
                  {event.room && <p className="text-xs opacity-75">📍 {event.room}</p>}

                  {/* Actions */}
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => handleEditEvent(event)}
                      className="flex-1 text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center justify-center gap-1"
                    >
                      <PencilIcon className="h-3 w-3" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="flex-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition flex items-center justify-center gap-1"
                    >
                      <TrashIcon className="h-3 w-3" />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-red-900" : "bg-red-100"}`}>
          <p className="text-sm font-semibold text-gray-600">Total Exams</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {events.filter((e) => e.type === "exam").length}
          </p>
        </div>
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-blue-900" : "bg-blue-100"}`}>
          <p className="text-sm font-semibold text-gray-600">Meetings</p>
          <p className="text-2xl font-bold text-blue-600 mt-2">
            {events.filter((e) => e.type === "meeting").length}
          </p>
        </div>
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-yellow-900" : "bg-yellow-100"}`}>
          <p className="text-sm font-semibold text-gray-600">Deadlines</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {events.filter((e) => e.type === "deadline").length}
          </p>
        </div>
        <div className={`p-4 rounded-lg shadow-md ${isDark ? "bg-green-900" : "bg-green-100"}`}>
          <p className="text-sm font-semibold text-gray-600">Total Events</p>
          <p className="text-2xl font-bold text-green-600 mt-2">{events.length}</p>
        </div>
      </div>
    </div>
  );
}
